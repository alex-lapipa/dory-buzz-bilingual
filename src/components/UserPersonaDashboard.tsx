import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Brain, 
  TrendingUp, 
  Clock, 
  Target, 
  BarChart3,
  Lightbulb,
  RefreshCw
} from '@/components/icons/lucide-compat';

interface UserPersona {
  id: string;
  persona_type: string;
  characteristics: any;
  engagement_level: string;
  preferred_features: string[];
  learning_preferences: any;
  usage_frequency: string;
  risk_churn: number;
  lifetime_value_score: number;
  calculated_at: string;
}

interface Insight {
  id: string;
  insight_type: string;
  title: string;
  description: string;
  priority_score: number;
  status: string;
  generated_at: string;
}

export const UserPersonaDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [persona, setPersona] = useState<UserPersona | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      loadPersonaData();
      loadInsights();
    }
  }, [user]);

  const loadPersonaData = async () => {
    try {
      const { data, error } = await supabase
        .from('user_personas')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setPersona(data);
    } catch (error) {
      console.error('Error loading persona:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInsights = async () => {
    try {
      const { data, error } = await supabase
        .from('improvement_insights')
        .select('*')
        .order('priority_score', { ascending: false })
        .limit(5);

      if (error) throw error;
      setInsights(data || []);
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  };

  const generatePersona = async (forceRefresh = false) => {
    if (!user) return;

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('persona_generator', {
        body: { userId: user.id, forceRefresh }
      });

      if (error) throw error;

      setPersona(data.persona);
      toast({
        title: "Persona Updated",
        description: "Your user persona has been generated successfully!",
      });
    } catch (error) {
      console.error('Error generating persona:', error);
      toast({
        title: "Error",
        description: "Failed to generate persona. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const generateInsights = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('insights_generator');

      if (error) throw error;

      await loadInsights();
      toast({
        title: "Insights Generated",
        description: `Generated ${data.insights.length} new improvement insights!`,
      });
    } catch (error) {
      console.error('Error generating insights:', error);
      toast({
        title: "Error",
        description: "Failed to generate insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const getPersonaTypeColor = (type: string) => {
    const colors = {
      'beginner_gardener': 'bg-green-100 text-green-800',
      'intermediate_gardener': 'bg-blue-100 text-blue-800',
      'expert_gardener': 'bg-purple-100 text-purple-800',
      'bee_enthusiast': 'bg-yellow-100 text-yellow-800',
      'casual_learner': 'bg-gray-100 text-gray-800',
      'dedicated_student': 'bg-orange-100 text-orange-800',
      'educator': 'bg-indigo-100 text-indigo-800',
      'researcher': 'bg-pink-100 text-pink-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getEngagementColor = (level: string) => {
    const colors = {
      'high': 'text-green-600',
      'medium': 'text-yellow-600',
      'low': 'text-red-600'
    };
    return colors[level as keyof typeof colors] || 'text-gray-600';
  };

  const getInsightTypeIcon = (type: string) => {
    const icons = {
      'feature_request': Target,
      'ux_improvement': TrendingUp,
      'content_gap': Brain,
      'engagement_issue': User,
      'retention_issue': Clock
    };
    const Icon = icons[type as keyof typeof icons] || Lightbulb;
    return <Icon className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Analytics & Persona</h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => generatePersona(true)} 
            disabled={generating}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
            Refresh Persona
          </Button>
          <Button 
            onClick={generateInsights} 
            disabled={generating}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Generate Insights
          </Button>
        </div>
      </div>

      {!persona ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No Persona Data Available</h3>
            <p className="text-gray-600 mb-4">
              We need some usage data to generate your persona. Use the app for a few days and then come back!
            </p>
            <Button onClick={() => generatePersona(true)} disabled={generating}>
              {generating ? 'Generating...' : 'Try to Generate Now'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Persona Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Persona Type</p>
                    <Badge className={getPersonaTypeColor(persona.persona_type)}>
                      {persona.persona_type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <User className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Engagement Level</p>
                    <p className={`text-lg font-semibold capitalize ${getEngagementColor(persona.engagement_level)}`}>
                      {persona.engagement_level}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Usage Frequency</p>
                    <p className="text-lg font-semibold capitalize">{persona.usage_frequency}</p>
                  </div>
                  <Clock className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Churn Risk</p>
                    <div className="space-y-2">
                      <p className="text-lg font-semibold">{Math.round(persona.risk_churn)}%</p>
                      <Progress value={persona.risk_churn} className="h-2" />
                    </div>
                  </div>
                  <Target className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Persona Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Characteristics & Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Preferred Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {persona.preferred_features.map((feature, index) => (
                      <Badge key={index} variant="secondary">
                        {feature.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Learning Preferences</h4>
                  <div className="space-y-1 text-sm">
                    {Object.entries(persona.learning_preferences).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key.replace('_', ' ')}:</span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Characteristics</h4>
                  <div className="space-y-1 text-sm">
                    {Object.entries(persona.characteristics).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key.replace('_', ' ')}:</span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Improvement Insights</CardTitle>
              </CardHeader>
              <CardContent>
                {insights.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">
                    No insights available. Generate insights to see improvement recommendations.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {insights.slice(0, 3).map((insight) => (
                      <div key={insight.id} className="border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          {getInsightTypeIcon(insight.insight_type)}
                          <h4 className="font-medium text-sm">{insight.title}</h4>
                          <Badge variant="outline" className="ml-auto">
                            {insight.priority_score}/100
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {insight.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};