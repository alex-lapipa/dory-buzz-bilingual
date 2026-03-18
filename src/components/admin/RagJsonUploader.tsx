import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Loader2, FileJson, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IngestResult {
  success: boolean;
  document_id: string;
  dry_run: boolean;
  kb_inserted: number;
  kb_updated: number;
  kb_skipped: number;
  bf_inserted: number;
  bf_skipped: number;
  vc_inserted: number;
  vc_skipped: number;
  embedded: number;
  total_inserted: number;
  total_skipped: number;
  errors: string[];
}

interface DocPreview {
  document_id: string;
  title: string;
  sections: number;
  estimatedRows: number;
  types: string[];
}

const RagJsonUploader: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<DocPreview[]>([]);
  const [ingesting, setIngesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<IngestResult[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const analyzeFile = async (file: File): Promise<{ doc: any; preview: DocPreview }> => {
    const text = await file.text();
    const doc = JSON.parse(text);
    const types: string[] = [];
    let estimatedRows = 0;

    for (const s of doc.sections || []) {
      if (s.facts) { types.push('bee_facts'); estimatedRows += s.facts.length; }
      else if (s.words) { types.push('vocabulary'); estimatedRows += s.words.length; }
      else if (s.chunks) { types.push('kb_chunks'); estimatedRows += s.chunks.length; }
      else if (s.content) { types.push('kb_content'); estimatedRows++; }
      else if (s.scene_en) { types.push('storycard_panel'); estimatedRows++; }
      else if (s.role) { types.push('agent'); estimatedRows++; }
    }

    return {
      doc,
      preview: {
        document_id: doc.document_id || file.name,
        title: doc.title || file.name,
        sections: doc.sections?.length || 0,
        estimatedRows,
        types: [...new Set(types)],
      },
    };
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setResults([]);

    const analyzed = await Promise.all(selected.map(analyzeFile));
    setPreviews(analyzed.map(a => a.preview));
  };

  const ingestAll = async () => {
    setIngesting(true);
    setResults([]);
    const allResults: IngestResult[] = [];

    for (let i = 0; i < files.length; i++) {
      setProgress(((i) / files.length) * 100);
      try {
        const { doc } = await analyzeFile(files[i]);
        const { data, error } = await supabase.functions.invoke('rag_json_ingest', {
          body: { document: doc },
        });
        if (error) throw error;
        allResults.push(data as IngestResult);
      } catch (e: any) {
        allResults.push({
          success: false, document_id: files[i].name, dry_run: false,
          kb_inserted: 0, kb_updated: 0, kb_skipped: 0,
          bf_inserted: 0, bf_skipped: 0, vc_inserted: 0, vc_skipped: 0,
          embedded: 0, total_inserted: 0, total_skipped: 0,
          errors: [e.message || 'Unknown error'],
        });
      }
    }

    setProgress(100);
    setResults(allResults);
    setIngesting(false);

    const totalInserted = allResults.reduce((s, r) => s + r.total_inserted, 0);
    const totalEmbedded = allResults.reduce((s, r) => s + r.embedded, 0);
    toast({
      title: '✅ RAG Ingestion Complete',
      description: `${totalInserted} rows inserted, ${totalEmbedded} embedded across ${files.length} files.`,
    });
  };

  const totalEstimated = previews.reduce((s, p) => s + p.estimatedRows, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileJson className="h-5 w-5" /> Upload RAG JSON Files
        </CardTitle>
        <CardDescription>
          Upload structured JSON files to ingest into the knowledge base, bee facts, and vocabulary cards. Additive only — never deletes existing data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={ingesting}>
            <Upload className="h-4 w-4 mr-2" /> Select JSON Files
          </Button>
          {files.length > 0 && (
            <Badge variant="secondary">{files.length} file{files.length > 1 ? 's' : ''} selected</Badge>
          )}
        </div>

        {/* Previews */}
        {previews.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Preview</h4>
            {previews.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.sections} sections · ~{p.estimatedRows} rows</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {p.types.map(t => (
                    <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-muted-foreground">
                Total: ~{totalEstimated} rows across {previews.length} documents
              </p>
              <Button onClick={ingestAll} disabled={ingesting}>
                {ingesting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                Ingest All ({previews.length})
              </Button>
            </div>
          </div>
        )}

        {/* Progress */}
        {ingesting && (
          <div className="space-y-1">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">Processing {Math.round(progress)}%...</p>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Results</h4>
            {results.map((r, i) => (
              <div key={i} className="p-3 rounded-lg border border-border space-y-2">
                <div className="flex items-center gap-2">
                  {r.success ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-destructive" />}
                  <span className="text-sm font-medium">{r.document_id}</span>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                  <div className="text-center p-1 bg-muted/50 rounded">
                    <div className="font-bold text-foreground">{r.kb_inserted}</div>
                    <div className="text-muted-foreground">KB New</div>
                  </div>
                  <div className="text-center p-1 bg-muted/50 rounded">
                    <div className="font-bold text-foreground">{r.kb_skipped}</div>
                    <div className="text-muted-foreground">KB Skip</div>
                  </div>
                  <div className="text-center p-1 bg-muted/50 rounded">
                    <div className="font-bold text-foreground">{r.bf_inserted}</div>
                    <div className="text-muted-foreground">Facts New</div>
                  </div>
                  <div className="text-center p-1 bg-muted/50 rounded">
                    <div className="font-bold text-foreground">{r.bf_skipped}</div>
                    <div className="text-muted-foreground">Facts Skip</div>
                  </div>
                  <div className="text-center p-1 bg-muted/50 rounded">
                    <div className="font-bold text-foreground">{r.vc_inserted}</div>
                    <div className="text-muted-foreground">Vocab New</div>
                  </div>
                  <div className="text-center p-1 bg-muted/50 rounded">
                    <div className="font-bold text-foreground">{r.embedded}</div>
                    <div className="text-muted-foreground">Embedded</div>
                  </div>
                </div>
                {r.errors.length > 0 && (
                  <div className="text-xs text-destructive">
                    {r.errors.slice(0, 3).map((e, j) => <p key={j}>⚠ {e}</p>)}
                    {r.errors.length > 3 && <p>...and {r.errors.length - 3} more</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RagJsonUploader;
