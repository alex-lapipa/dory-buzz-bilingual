import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContentRequest {
  topic: string;
  category: string;
  difficulty_level: number;
  content_types: string[]; // ['facts', 'activities', 'quizzes', 'videos', 'experiments']
  age_group?: string;
  language?: string;
}

interface LearningContent {
  facts: any[];
  activities: any[];
  quizzes: any[];
  experiments: any[];
  videos: any[];
}

class LearningOrchestrator {
  private openaiKey = Deno.env.get('OPENAI_API_KEY');
  private anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
  private xaiKey = Deno.env.get('XAI_API_KEY');
  private supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  async generateFacts(topic: string, category: string, difficulty: number, language = 'en') {
    console.log(`Generating facts for ${topic} (${category}) at difficulty ${difficulty}`);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: `You are an expert educator creating engaging ${category} facts for children. Generate educational content in ${language}. Focus on making learning fun and accessible.`
            },
            {
              role: 'user',
              content: `Create 10 fascinating facts about ${topic} for difficulty level ${difficulty}/10. Include scientific accuracy, fun elements, and age-appropriate language. Return as JSON array with: title, content, fun_fact (boolean), image_description.`
            }
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const factsText = data.choices[0].message.content;
      
      try {
        return JSON.parse(factsText);
      } catch {
        // Fallback if JSON parsing fails
        return [{
          title: `Amazing ${topic} Facts`,
          content: factsText,
          fun_fact: true,
          image_description: `Beautiful illustration of ${topic}`
        }];
      }
    } catch (error) {
      console.error('OpenAI facts generation error:', error);
      return [];
    }
  }

  async generateActivities(topic: string, category: string, difficulty: number, language = 'en') {
    console.log(`Generating activities for ${topic} using Claude`);
    
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.anthropicKey,
          'content-type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: `Create 5 hands-on educational activities about ${topic} in the ${category} category. Difficulty level: ${difficulty}/10. Language: ${language}. 

              Each activity should include:
              - Activity name
              - Materials needed (common household items)
              - Step-by-step instructions
              - Learning objectives
              - Safety notes (if applicable)
              - Expected outcomes
              
              Return as JSON array format.`
            }
          ]
        })
      });

      const data = await response.json();
      const activitiesText = data.content[0].text;
      
      try {
        return JSON.parse(activitiesText);
      } catch {
        // Fallback parsing
        return [{
          name: `${topic} Exploration`,
          materials: ['paper', 'pencil', 'curiosity'],
          instructions: activitiesText,
          objectives: [`Learn about ${topic}`],
          safety_notes: 'Adult supervision recommended',
          outcomes: 'Better understanding of the topic'
        }];
      }
    } catch (error) {
      console.error('Claude activities generation error:', error);
      return [];
    }
  }

  async generateQuizzes(topic: string, category: string, difficulty: number, language = 'en') {
    console.log(`Generating quizzes for ${topic} using Grok`);
    
    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.xaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'grok-beta',
          messages: [
            {
              role: 'system',
              content: `You are a quiz master creating engaging educational quizzes for children. Make learning fun and interactive in ${language}.`
            },
            {
              role: 'user',
              content: `Create a 10-question quiz about ${topic} for ${category} category, difficulty ${difficulty}/10. 

              Include:
              - Multiple choice questions (4 options each)
              - True/false questions
              - Fill-in-the-blank questions
              - Fun fact explanations for each answer
              
              Return as JSON with question, type, options (if applicable), correct_answer, explanation.`
            }
          ],
          temperature: 0.6,
        }),
      });

      const data = await response.json();
      const quizText = data.choices[0].message.content;
      
      try {
        return JSON.parse(quizText);
      } catch {
        return [{
          question: `What do you know about ${topic}?`,
          type: 'multiple_choice',
          options: ['A lot', 'Some things', 'A little', 'Want to learn more'],
          correct_answer: 'Want to learn more',
          explanation: `There's always more to discover about ${topic}!`
        }];
      }
    } catch (error) {
      console.error('Grok quiz generation error:', error);
      return [];
    }
  }

  async generateExperiments(topic: string, category: string, difficulty: number, language = 'en') {
    console.log(`Generating experiments for ${topic} using OpenAI`);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: `You are a science educator creating safe, engaging experiments for children. Focus on ${category} topics in ${language}.`
            },
            {
              role: 'user',
              content: `Design 5 safe, simple experiments related to ${topic} for difficulty level ${difficulty}/10. 

              Each experiment should include:
              - Experiment name
              - Purpose/hypothesis
              - Materials (safe, common items)
              - Detailed steps
              - Expected results
              - Scientific explanation
              - Safety precautions
              - Extensions/variations
              
              Return as JSON array.`
            }
          ],
          temperature: 0.8,
        }),
      });

      const data = await response.json();
      const experimentsText = data.choices[0].message.content;
      
      try {
        return JSON.parse(experimentsText);
      } catch {
        return [{
          name: `${topic} Investigation`,
          purpose: `Explore the fascinating world of ${topic}`,
          materials: ['observation skills', 'notebook', 'curiosity'],
          steps: experimentsText,
          expected_results: 'New understanding and excitement about learning',
          explanation: `This helps us understand ${topic} better`,
          safety: 'Always have an adult present',
          extensions: 'Continue exploring and asking questions'
        }];
      }
    } catch (error) {
      console.error('OpenAI experiments generation error:', error);
      return [];
    }
  }

  async generateVideoScripts(topic: string, category: string, difficulty: number, language = 'en') {
    console.log(`Generating video scripts for ${topic} using Claude`);
    
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.anthropicKey,
          'content-type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: `Create 3 engaging video scripts about ${topic} for ${category} education. Difficulty: ${difficulty}/10. Language: ${language}.

              Each script should include:
              - Video title
              - Duration (3-5 minutes)
              - Scene descriptions
              - Narrator dialogue
              - Visual cues
              - Interactive elements
              - Learning objectives
              
              Make them fun, educational, and suitable for children.
              Return as JSON array.`
            }
          ]
        })
      });

      const data = await response.json();
      const scriptsText = data.content[0].text;
      
      try {
        return JSON.parse(scriptsText);
      } catch {
        return [{
          title: `Discovering ${topic}`,
          duration: '5 minutes',
          scenes: [{ description: 'Introduction to the topic', dialogue: scriptsText }],
          visuals: [`Beautiful imagery of ${topic}`],
          interactions: ['Ask questions', 'Observe carefully'],
          objectives: [`Learn about ${topic}`, 'Have fun while learning']
        }];
      }
    } catch (error) {
      console.error('Claude video scripts generation error:', error);
      return [];
    }
  }

  async orchestrateContent(request: ContentRequest): Promise<LearningContent> {
    console.log('Starting content orchestration for:', request);
    
    const content: LearningContent = {
      facts: [],
      activities: [],
      quizzes: [],
      experiments: [],
      videos: []
    };

    // Generate content in parallel using different AI providers
    const promises = [];

    if (request.content_types.includes('facts')) {
      promises.push(
        this.generateFacts(request.topic, request.category, request.difficulty_level, request.language)
          .then(facts => content.facts = facts)
      );
    }

    if (request.content_types.includes('activities')) {
      promises.push(
        this.generateActivities(request.topic, request.category, request.difficulty_level, request.language)
          .then(activities => content.activities = activities)
      );
    }

    if (request.content_types.includes('quizzes')) {
      promises.push(
        this.generateQuizzes(request.topic, request.category, request.difficulty_level, request.language)
          .then(quizzes => content.quizzes = quizzes)
      );
    }

    if (request.content_types.includes('experiments')) {
      promises.push(
        this.generateExperiments(request.topic, request.category, request.difficulty_level, request.language)
          .then(experiments => content.experiments = experiments)
      );
    }

    if (request.content_types.includes('videos')) {
      promises.push(
        this.generateVideoScripts(request.topic, request.category, request.difficulty_level, request.language)
          .then(videos => content.videos = videos)
      );
    }

    await Promise.all(promises);
    
    // Store generated content in database
    await this.storeGeneratedContent(request, content);

    return content;
  }

  async storeGeneratedContent(request: ContentRequest, content: LearningContent) {
    try {
      // Store facts
      for (const fact of content.facts) {
        await this.supabase.from('bee_facts').insert({
          title: fact.title,
          content: fact.content,
          category: request.category,
          difficulty_level: request.difficulty_level,
          fun_fact: fact.fun_fact || false,
          image_url: null // Could be populated later with generated images
        });
      }

      console.log(`Stored ${content.facts.length} facts, ${content.activities.length} activities, ${content.quizzes.length} quizzes, ${content.experiments.length} experiments, ${content.videos.length} videos`);
    } catch (error) {
      console.error('Error storing content:', error);
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request: ContentRequest = await req.json();
    console.log('Learning content orchestration request:', request);

    const orchestrator = new LearningOrchestrator();
    const content = await orchestrator.orchestrateContent(request);

    return new Response(JSON.stringify({
      success: true,
      content,
      generated_at: new Date().toISOString(),
      topic: request.topic,
      category: request.category
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in learning content orchestrator:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});