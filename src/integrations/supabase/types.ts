export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      agent_tasks: {
        Row: {
          agent_id: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          input_text: string | null
          intent: string | null
          latency_ms: number | null
          metadata: Json | null
          model_used: string | null
          output_text: string | null
          session_id: string | null
          status: string | null
          tokens_in: number | null
          tokens_out: number | null
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          input_text?: string | null
          intent?: string | null
          latency_ms?: number | null
          metadata?: Json | null
          model_used?: string | null
          output_text?: string | null
          session_id?: string | null
          status?: string | null
          tokens_in?: number | null
          tokens_out?: number | null
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          input_text?: string | null
          intent?: string | null
          latency_ms?: number | null
          metadata?: Json | null
          model_used?: string | null
          output_text?: string | null
          session_id?: string | null
          status?: string | null
          tokens_in?: number | null
          tokens_out?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_tasks_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          capabilities: Json | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          model_preference: string | null
          name: string
          role: string
          system_prompt: string | null
          updated_at: string | null
        }
        Insert: {
          capabilities?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          model_preference?: string | null
          name: string
          role: string
          system_prompt?: string | null
          updated_at?: string | null
        }
        Update: {
          capabilities?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          model_preference?: string | null
          name?: string
          role?: string
          system_prompt?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      bee_facts: {
        Row: {
          age_level: string | null
          category: string
          content: string
          created_at: string
          difficulty_level: number | null
          domain: string | null
          embedding: string | null
          fun_fact: boolean | null
          id: string
          image_url: string | null
          language: string | null
          metadata: Json | null
          name_es: string | null
          source: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          age_level?: string | null
          category: string
          content: string
          created_at?: string
          difficulty_level?: number | null
          domain?: string | null
          embedding?: string | null
          fun_fact?: boolean | null
          id?: string
          image_url?: string | null
          language?: string | null
          metadata?: Json | null
          name_es?: string | null
          source?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          age_level?: string | null
          category?: string
          content?: string
          created_at?: string
          difficulty_level?: number | null
          domain?: string | null
          embedding?: string | null
          fun_fact?: boolean | null
          id?: string
          image_url?: string | null
          language?: string | null
          metadata?: Json | null
          name_es?: string | null
          source?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      bee_learning_progress: {
        Row: {
          completed_lessons: string[] | null
          created_at: string
          id: string
          last_activity: string
          level: number | null
          topic: string
          user_id: string | null
        }
        Insert: {
          completed_lessons?: string[] | null
          created_at?: string
          id?: string
          last_activity?: string
          level?: number | null
          topic: string
          user_id?: string | null
        }
        Update: {
          completed_lessons?: string[] | null
          created_at?: string
          id?: string
          last_activity?: string
          level?: number | null
          topic?: string
          user_id?: string | null
        }
        Relationships: []
      }
      chat_sessions: {
        Row: {
          created_at: string | null
          id: string
          language: string | null
          last_active: string | null
          message_count: number | null
          metadata: Json | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          language?: string | null
          last_active?: string | null
          message_count?: number | null
          metadata?: Json | null
          session_id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          language?: string | null
          last_active?: string | null
          message_count?: number | null
          metadata?: Json | null
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      crawl_jobs: {
        Row: {
          chunks_created: number | null
          completed_at: string | null
          crawl_config: Json | null
          created_at: string | null
          domain: string
          error_msg: string | null
          firecrawl_id: string | null
          id: string
          nodes_created: number | null
          started_at: string | null
          status: string | null
          url: string
        }
        Insert: {
          chunks_created?: number | null
          completed_at?: string | null
          crawl_config?: Json | null
          created_at?: string | null
          domain?: string
          error_msg?: string | null
          firecrawl_id?: string | null
          id?: string
          nodes_created?: number | null
          started_at?: string | null
          status?: string | null
          url: string
        }
        Update: {
          chunks_created?: number | null
          completed_at?: string | null
          crawl_config?: Json | null
          created_at?: string | null
          domain?: string
          error_msg?: string | null
          firecrawl_id?: string | null
          id?: string
          nodes_created?: number | null
          started_at?: string | null
          status?: string | null
          url?: string
        }
        Relationships: []
      }
      feature_usage: {
        Row: {
          created_at: string
          error_count: number | null
          feature_name: string
          first_used_at: string
          id: string
          last_used_at: string
          success_rate: number | null
          total_time_spent_seconds: number | null
          updated_at: string
          usage_count: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          error_count?: number | null
          feature_name: string
          first_used_at?: string
          id?: string
          last_used_at?: string
          success_rate?: number | null
          total_time_spent_seconds?: number | null
          updated_at?: string
          usage_count?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          error_count?: number | null
          feature_name?: string
          first_used_at?: string
          id?: string
          last_used_at?: string
          success_rate?: number | null
          total_time_spent_seconds?: number | null
          updated_at?: string
          usage_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      improvement_insights: {
        Row: {
          affected_user_count: number | null
          created_at: string
          description: string
          generated_at: string
          id: string
          insight_type: string
          priority_score: number | null
          status: string | null
          supporting_data: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          affected_user_count?: number | null
          created_at?: string
          description: string
          generated_at?: string
          id?: string
          insight_type: string
          priority_score?: number | null
          status?: string | null
          supporting_data?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          affected_user_count?: number | null
          created_at?: string
          description?: string
          generated_at?: string
          id?: string
          insight_type?: string
          priority_score?: number | null
          status?: string | null
          supporting_data?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      kg_edges: {
        Row: {
          bidirectional: boolean | null
          created_at: string | null
          id: string
          metadata: Json | null
          relation: string
          relation_es: string | null
          relation_label: string | null
          source_doc: string | null
          source_id: string
          target_id: string
          verified: boolean | null
          weight: number | null
        }
        Insert: {
          bidirectional?: boolean | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          relation: string
          relation_es?: string | null
          relation_label?: string | null
          source_doc?: string | null
          source_id: string
          target_id: string
          verified?: boolean | null
          weight?: number | null
        }
        Update: {
          bidirectional?: boolean | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          relation?: string
          relation_es?: string | null
          relation_label?: string | null
          source_doc?: string | null
          source_id?: string
          target_id?: string
          verified?: boolean | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "kg_edges_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "kg_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kg_edges_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "kg_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      kg_nodes: {
        Row: {
          age_level: string | null
          bf_fact_id: string | null
          created_at: string | null
          description: string | null
          description_es: string | null
          domain: string
          embedding: string | null
          id: string
          image_url: string | null
          kb_chunk_id: string | null
          metadata: Json | null
          name: string
          name_es: string | null
          node_type: string
          source_url: string | null
          tags: string[] | null
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          age_level?: string | null
          bf_fact_id?: string | null
          created_at?: string | null
          description?: string | null
          description_es?: string | null
          domain?: string
          embedding?: string | null
          id?: string
          image_url?: string | null
          kb_chunk_id?: string | null
          metadata?: Json | null
          name: string
          name_es?: string | null
          node_type?: string
          source_url?: string | null
          tags?: string[] | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          age_level?: string | null
          bf_fact_id?: string | null
          created_at?: string | null
          description?: string | null
          description_es?: string | null
          domain?: string
          embedding?: string | null
          id?: string
          image_url?: string | null
          kb_chunk_id?: string | null
          metadata?: Json | null
          name?: string
          name_es?: string | null
          node_type?: string
          source_url?: string | null
          tags?: string[] | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "kg_nodes_bf_fact_id_fkey"
            columns: ["bf_fact_id"]
            isOneToOne: false
            referencedRelation: "bee_facts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kg_nodes_kb_chunk_id_fkey"
            columns: ["kb_chunk_id"]
            isOneToOne: false
            referencedRelation: "mochi_knowledge_base"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_modules: {
        Row: {
          age_max: number | null
          age_min: number | null
          content_pillar: string
          cover_image_url: string | null
          created_at: string | null
          description_en: string | null
          description_es: string | null
          difficulty: number | null
          id: string
          is_published: boolean | null
          learning_targets: Json | null
          module_type: string
          sequence_order: number | null
          slug: string
          tags: string[] | null
          title_en: string
          title_es: string
          updated_at: string | null
        }
        Insert: {
          age_max?: number | null
          age_min?: number | null
          content_pillar: string
          cover_image_url?: string | null
          created_at?: string | null
          description_en?: string | null
          description_es?: string | null
          difficulty?: number | null
          id?: string
          is_published?: boolean | null
          learning_targets?: Json | null
          module_type?: string
          sequence_order?: number | null
          slug: string
          tags?: string[] | null
          title_en: string
          title_es: string
          updated_at?: string | null
        }
        Update: {
          age_max?: number | null
          age_min?: number | null
          content_pillar?: string
          cover_image_url?: string | null
          created_at?: string | null
          description_en?: string | null
          description_es?: string | null
          difficulty?: number | null
          id?: string
          is_published?: boolean | null
          learning_targets?: Json | null
          module_type?: string
          sequence_order?: number | null
          slug?: string
          tags?: string[] | null
          title_en?: string
          title_es?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      learning_sessions: {
        Row: {
          completed_at: string | null
          completion_pct: number | null
          correct_answers: number | null
          device_type: string | null
          id: string
          interactions: number | null
          language: string | null
          metadata: Json | null
          module_id: string | null
          panels_viewed: number | null
          score: number | null
          session_token: string | null
          started_at: string | null
          storycard_id: string | null
          total_questions: number | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          completion_pct?: number | null
          correct_answers?: number | null
          device_type?: string | null
          id?: string
          interactions?: number | null
          language?: string | null
          metadata?: Json | null
          module_id?: string | null
          panels_viewed?: number | null
          score?: number | null
          session_token?: string | null
          started_at?: string | null
          storycard_id?: string | null
          total_questions?: number | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          completion_pct?: number | null
          correct_answers?: number | null
          device_type?: string | null
          id?: string
          interactions?: number | null
          language?: string | null
          metadata?: Json | null
          module_id?: string | null
          panels_viewed?: number | null
          score?: number | null
          session_token?: string | null
          started_at?: string | null
          storycard_id?: string | null
          total_questions?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_sessions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "learning_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_sessions_storycard_id_fkey"
            columns: ["storycard_id"]
            isOneToOne: false
            referencedRelation: "storycards"
            referencedColumns: ["id"]
          },
        ]
      }
      live_metrics: {
        Row: {
          environment: string
          id: string
          metric_name: string
          metric_type: string
          metric_value: Json
          recorded_at: string
        }
        Insert: {
          environment?: string
          id?: string
          metric_name: string
          metric_type: string
          metric_value: Json
          recorded_at?: string
        }
        Update: {
          environment?: string
          id?: string
          metric_name?: string
          metric_type?: string
          metric_value?: Json
          recorded_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          type: string
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          type: string
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      mochi_assets: {
        Row: {
          asset_type: string
          created_at: string
          file_path: string
          file_url: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          updated_at: string
        }
        Insert: {
          asset_type: string
          created_at?: string
          file_path: string
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          updated_at?: string
        }
        Update: {
          asset_type?: string
          created_at?: string
          file_path?: string
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      mochi_integrations: {
        Row: {
          created_at: string
          error_message: string | null
          function_category: string | null
          id: string
          message_length: number | null
          model: string | null
          options: Json | null
          orchestrated: boolean | null
          platform: string
          response_time_ms: number | null
          success: boolean | null
          unified_version: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          function_category?: string | null
          id?: string
          message_length?: number | null
          model?: string | null
          options?: Json | null
          orchestrated?: boolean | null
          platform: string
          response_time_ms?: number | null
          success?: boolean | null
          unified_version?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          function_category?: string | null
          id?: string
          message_length?: number | null
          model?: string | null
          options?: Json | null
          orchestrated?: boolean | null
          platform?: string
          response_time_ms?: number | null
          success?: boolean | null
          unified_version?: string | null
        }
        Relationships: []
      }
      mochi_knowledge_base: {
        Row: {
          age_level: string | null
          category: string
          content: string
          created_at: string | null
          domain: string | null
          embedding: string | null
          id: string
          language: string
          metadata: Json | null
          source: string | null
          subcategory: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          age_level?: string | null
          category?: string
          content: string
          created_at?: string | null
          domain?: string | null
          embedding?: string | null
          id?: string
          language?: string
          metadata?: Json | null
          source?: string | null
          subcategory?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          age_level?: string | null
          category?: string
          content?: string
          created_at?: string | null
          domain?: string | null
          embedding?: string | null
          id?: string
          language?: string
          metadata?: Json | null
          source?: string | null
          subcategory?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      model_routes: {
        Row: {
          agent_name: string
          conditions: Json | null
          created_at: string | null
          id: string
          intent_pattern: string
          is_active: boolean | null
          model: string
          priority: number | null
        }
        Insert: {
          agent_name: string
          conditions?: Json | null
          created_at?: string | null
          id?: string
          intent_pattern: string
          is_active?: boolean | null
          model: string
          priority?: number | null
        }
        Update: {
          agent_name?: string
          conditions?: Json | null
          created_at?: string | null
          id?: string
          intent_pattern?: string
          is_active?: boolean | null
          model?: string
          priority?: number | null
        }
        Relationships: []
      }
      production_deployments: {
        Row: {
          created_at: string
          deployed_by: string | null
          deployment_id: string
          deployment_time_ms: number | null
          environment: string
          error_message: string | null
          health_score: number
          id: string
          services: string[]
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deployed_by?: string | null
          deployment_id: string
          deployment_time_ms?: number | null
          environment?: string
          error_message?: string | null
          health_score?: number
          id?: string
          services?: string[]
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deployed_by?: string | null
          deployment_id?: string
          deployment_time_ms?: number | null
          environment?: string
          error_message?: string | null
          health_score?: number
          id?: string
          services?: string[]
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          email: string
          id: string
          language: string | null
          last_activity: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email: string
          id: string
          language?: string | null
          last_activity?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          language?: string | null
          last_activity?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          age_min: number | null
          correct_answer: string
          correct_answer_es: string | null
          correct_count: number | null
          created_at: string | null
          difficulty: number | null
          explanation_en: string | null
          explanation_es: string | null
          id: string
          image_url: string | null
          module_id: string | null
          options_en: Json | null
          options_es: Json | null
          points: number | null
          question_en: string
          question_es: string
          question_type: string
          storycard_id: string | null
          times_shown: number | null
          vocab_card_id: string | null
        }
        Insert: {
          age_min?: number | null
          correct_answer: string
          correct_answer_es?: string | null
          correct_count?: number | null
          created_at?: string | null
          difficulty?: number | null
          explanation_en?: string | null
          explanation_es?: string | null
          id?: string
          image_url?: string | null
          module_id?: string | null
          options_en?: Json | null
          options_es?: Json | null
          points?: number | null
          question_en: string
          question_es: string
          question_type: string
          storycard_id?: string | null
          times_shown?: number | null
          vocab_card_id?: string | null
        }
        Update: {
          age_min?: number | null
          correct_answer?: string
          correct_answer_es?: string | null
          correct_count?: number | null
          created_at?: string | null
          difficulty?: number | null
          explanation_en?: string | null
          explanation_es?: string | null
          id?: string
          image_url?: string | null
          module_id?: string | null
          options_en?: Json | null
          options_es?: Json | null
          points?: number | null
          question_en?: string
          question_es?: string
          question_type?: string
          storycard_id?: string | null
          times_shown?: number | null
          vocab_card_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "learning_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_questions_storycard_id_fkey"
            columns: ["storycard_id"]
            isOneToOne: false
            referencedRelation: "storycards"
            referencedColumns: ["id"]
          },
        ]
      }
      rag_queries: {
        Row: {
          created_at: string | null
          id: string
          language: string | null
          matched_knowledge_ids: string[] | null
          query_text: string
          response_preview: string | null
          session_id: string | null
          similarity_scores: number[] | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          language?: string | null
          matched_knowledge_ids?: string[] | null
          query_text: string
          response_preview?: string | null
          session_id?: string | null
          similarity_scores?: number[] | null
        }
        Update: {
          created_at?: string | null
          id?: string
          language?: string | null
          matched_knowledge_ids?: string[] | null
          query_text?: string
          response_preview?: string | null
          session_id?: string | null
          similarity_scores?: number[] | null
        }
        Relationships: []
      }
      storycard_panels: {
        Row: {
          audio_url_en: string | null
          audio_url_es: string | null
          created_at: string | null
          display_duration_seconds: number | null
          id: string
          image_prompt: string | null
          image_url: string | null
          interaction_prompt_en: string | null
          interaction_prompt_es: string | null
          interaction_type: string | null
          mochi_action: string | null
          narration_en: string | null
          narration_es: string | null
          panel_number: number
          scene_en: string
          scene_es: string
          storycard_id: string | null
          target_word_en: string | null
          target_word_es: string | null
        }
        Insert: {
          audio_url_en?: string | null
          audio_url_es?: string | null
          created_at?: string | null
          display_duration_seconds?: number | null
          id?: string
          image_prompt?: string | null
          image_url?: string | null
          interaction_prompt_en?: string | null
          interaction_prompt_es?: string | null
          interaction_type?: string | null
          mochi_action?: string | null
          narration_en?: string | null
          narration_es?: string | null
          panel_number: number
          scene_en: string
          scene_es: string
          storycard_id?: string | null
          target_word_en?: string | null
          target_word_es?: string | null
        }
        Update: {
          audio_url_en?: string | null
          audio_url_es?: string | null
          created_at?: string | null
          display_duration_seconds?: number | null
          id?: string
          image_prompt?: string | null
          image_url?: string | null
          interaction_prompt_en?: string | null
          interaction_prompt_es?: string | null
          interaction_type?: string | null
          mochi_action?: string | null
          narration_en?: string | null
          narration_es?: string | null
          panel_number?: number
          scene_en?: string
          scene_es?: string
          storycard_id?: string | null
          target_word_en?: string | null
          target_word_es?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "storycard_panels_storycard_id_fkey"
            columns: ["storycard_id"]
            isOneToOne: false
            referencedRelation: "storycards"
            referencedColumns: ["id"]
          },
        ]
      }
      storycards: {
        Row: {
          audio_url_en: string | null
          audio_url_es: string | null
          completion_rate: number | null
          created_at: string | null
          duration_seconds: number | null
          id: string
          is_published: boolean | null
          learning_objective: string | null
          mochi_says_en: string | null
          mochi_says_es: string | null
          module_id: string | null
          panel_count: number | null
          play_count: number | null
          sequence_order: number | null
          slug: string
          target_words: string[] | null
          target_words_es: string[] | null
          title_en: string
          title_es: string
          updated_at: string | null
        }
        Insert: {
          audio_url_en?: string | null
          audio_url_es?: string | null
          completion_rate?: number | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          is_published?: boolean | null
          learning_objective?: string | null
          mochi_says_en?: string | null
          mochi_says_es?: string | null
          module_id?: string | null
          panel_count?: number | null
          play_count?: number | null
          sequence_order?: number | null
          slug: string
          target_words?: string[] | null
          target_words_es?: string[] | null
          title_en: string
          title_es: string
          updated_at?: string | null
        }
        Update: {
          audio_url_en?: string | null
          audio_url_es?: string | null
          completion_rate?: number | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          is_published?: boolean | null
          learning_objective?: string | null
          mochi_says_en?: string | null
          mochi_says_es?: string | null
          module_id?: string | null
          panel_count?: number | null
          play_count?: number | null
          sequence_order?: number | null
          slug?: string
          target_words?: string[] | null
          target_words_es?: string[] | null
          title_en?: string
          title_es?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "storycards_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "learning_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      system_health: {
        Row: {
          error_message: string | null
          id: string
          last_check: string
          metadata: Json | null
          response_time_ms: number | null
          service_name: string
          status: string
        }
        Insert: {
          error_message?: string | null
          id?: string
          last_check?: string
          metadata?: Json | null
          response_time_ms?: number | null
          service_name: string
          status: string
        }
        Update: {
          error_message?: string | null
          id?: string
          last_check?: string
          metadata?: Json | null
          response_time_ms?: number | null
          service_name?: string
          status?: string
        }
        Relationships: []
      }
      user_behavior_patterns: {
        Row: {
          calculated_at: string
          confidence_score: number | null
          created_at: string
          id: string
          pattern_data: Json
          pattern_type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          calculated_at?: string
          confidence_score?: number | null
          created_at?: string
          id?: string
          pattern_data: Json
          pattern_type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          calculated_at?: string
          confidence_score?: number | null
          created_at?: string
          id?: string
          pattern_data?: Json
          pattern_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_consents: {
        Row: {
          consent_date: string
          consent_given: boolean
          consent_type: string
          consent_version: string | null
          email: string | null
          id: string
          ip_address: unknown
          user_agent: string | null
          user_id: string | null
          withdrawn_at: string | null
        }
        Insert: {
          consent_date?: string
          consent_given?: boolean
          consent_type: string
          consent_version?: string | null
          email?: string | null
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
          withdrawn_at?: string | null
        }
        Update: {
          consent_date?: string
          consent_given?: boolean
          consent_type?: string
          consent_version?: string | null
          email?: string | null
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
          withdrawn_at?: string | null
        }
        Relationships: []
      }
      user_events: {
        Row: {
          created_at: string
          element_class: string | null
          element_id: string | null
          event_name: string
          event_type: string
          id: string
          metadata: Json | null
          page_url: string | null
          session_id: string | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          element_class?: string | null
          element_id?: string | null
          event_name: string
          event_type: string
          id?: string
          metadata?: Json | null
          page_url?: string | null
          session_id?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          element_class?: string | null
          element_id?: string | null
          event_name?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          page_url?: string | null
          session_id?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_personas: {
        Row: {
          calculated_at: string
          characteristics: Json
          created_at: string
          engagement_level: string | null
          id: string
          learning_preferences: Json | null
          lifetime_value_score: number | null
          persona_type: string
          preferred_features: string[] | null
          risk_churn: number | null
          updated_at: string
          usage_frequency: string | null
          user_id: string | null
        }
        Insert: {
          calculated_at?: string
          characteristics: Json
          created_at?: string
          engagement_level?: string | null
          id?: string
          learning_preferences?: Json | null
          lifetime_value_score?: number | null
          persona_type: string
          preferred_features?: string[] | null
          risk_churn?: number | null
          updated_at?: string
          usage_frequency?: string | null
          user_id?: string | null
        }
        Update: {
          calculated_at?: string
          characteristics?: Json
          created_at?: string
          engagement_level?: string | null
          id?: string
          learning_preferences?: Json | null
          lifetime_value_score?: number | null
          persona_type?: string
          preferred_features?: string[] | null
          risk_churn?: number | null
          updated_at?: string
          usage_frequency?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          email_notifications: boolean | null
          id: string
          language_preference: string | null
          marketing_emails: boolean | null
          push_notifications: boolean | null
          theme: string | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          language_preference?: string | null
          marketing_emails?: boolean | null
          push_notifications?: boolean | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          language_preference?: string | null
          marketing_emails?: boolean | null
          push_notifications?: boolean | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_registrations: {
        Row: {
          age: number
          created_at: string
          device_info: Json | null
          email: string
          id: string
          language: string
          referral_source: string | null
          signup_ip: unknown
          updated_at: string
          user_agent: string | null
          utm_params: Json | null
        }
        Insert: {
          age: number
          created_at?: string
          device_info?: Json | null
          email: string
          id?: string
          language?: string
          referral_source?: string | null
          signup_ip?: unknown
          updated_at?: string
          user_agent?: string | null
          utm_params?: Json | null
        }
        Update: {
          age?: number
          created_at?: string
          device_info?: Json | null
          email?: string
          id?: string
          language?: string
          referral_source?: string | null
          signup_ip?: unknown
          updated_at?: string
          user_agent?: string | null
          utm_params?: Json | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          actions_taken: number | null
          browser: string | null
          created_at: string
          device_type: string | null
          duration_seconds: number | null
          ended_at: string | null
          id: string
          os: string | null
          pages_visited: number | null
          screen_resolution: string | null
          session_id: string
          started_at: string
          user_id: string | null
        }
        Insert: {
          actions_taken?: number | null
          browser?: string | null
          created_at?: string
          device_type?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          os?: string | null
          pages_visited?: number | null
          screen_resolution?: string | null
          session_id: string
          started_at?: string
          user_id?: string | null
        }
        Update: {
          actions_taken?: number | null
          browser?: string | null
          created_at?: string
          device_type?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          os?: string | null
          pages_visited?: number | null
          screen_resolution?: string | null
          session_id?: string
          started_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_word_progress: {
        Row: {
          created_at: string | null
          id: string
          last_seen_at: string | null
          mastery_level: number | null
          next_review_at: string | null
          session_token: string | null
          times_correct: number | null
          times_seen: number | null
          updated_at: string | null
          user_id: string | null
          word_en: string
          word_es: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_seen_at?: string | null
          mastery_level?: number | null
          next_review_at?: string | null
          session_token?: string | null
          times_correct?: number | null
          times_seen?: number | null
          updated_at?: string | null
          user_id?: string | null
          word_en: string
          word_es: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_seen_at?: string | null
          mastery_level?: number | null
          next_review_at?: string | null
          session_token?: string | null
          times_correct?: number | null
          times_seen?: number | null
          updated_at?: string | null
          user_id?: string | null
          word_en?: string
          word_es?: string
        }
        Relationships: []
      }
      vector_stores: {
        Row: {
          content_col: string | null
          created_at: string | null
          dimensions: number | null
          embedded_chunks: number | null
          embedding_col: string | null
          id: string
          last_embedded: string | null
          metadata: Json | null
          name: string
          table_name: string
          total_chunks: number | null
          updated_at: string | null
        }
        Insert: {
          content_col?: string | null
          created_at?: string | null
          dimensions?: number | null
          embedded_chunks?: number | null
          embedding_col?: string | null
          id?: string
          last_embedded?: string | null
          metadata?: Json | null
          name: string
          table_name: string
          total_chunks?: number | null
          updated_at?: string | null
        }
        Update: {
          content_col?: string | null
          created_at?: string | null
          dimensions?: number | null
          embedded_chunks?: number | null
          embedding_col?: string | null
          id?: string
          last_embedded?: string | null
          metadata?: Json | null
          name?: string
          table_name?: string
          total_chunks?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vocabulary_cards: {
        Row: {
          age_level: string | null
          audio_url_en: string | null
          audio_url_es: string | null
          category: string
          correct_rate: number | null
          created_at: string | null
          difficulty_level: number | null
          domain: string
          embedding: string | null
          example_en: string | null
          example_es: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          kg_node_id: string | null
          phonetic_en: string | null
          phonetic_es: string | null
          tags: string[] | null
          times_practiced: number | null
          updated_at: string | null
          word_en: string
          word_es: string
        }
        Insert: {
          age_level?: string | null
          audio_url_en?: string | null
          audio_url_es?: string | null
          category?: string
          correct_rate?: number | null
          created_at?: string | null
          difficulty_level?: number | null
          domain?: string
          embedding?: string | null
          example_en?: string | null
          example_es?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          kg_node_id?: string | null
          phonetic_en?: string | null
          phonetic_es?: string | null
          tags?: string[] | null
          times_practiced?: number | null
          updated_at?: string | null
          word_en: string
          word_es: string
        }
        Update: {
          age_level?: string | null
          audio_url_en?: string | null
          audio_url_es?: string | null
          category?: string
          correct_rate?: number | null
          created_at?: string | null
          difficulty_level?: number | null
          domain?: string
          embedding?: string | null
          example_en?: string | null
          example_es?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          kg_node_id?: string | null
          phonetic_en?: string | null
          phonetic_es?: string | null
          tags?: string[] | null
          times_practiced?: number | null
          updated_at?: string | null
          word_en?: string
          word_es?: string
        }
        Relationships: [
          {
            foreignKeyName: "vocabulary_cards_kg_node_id_fkey"
            columns: ["kg_node_id"]
            isOneToOne: false
            referencedRelation: "kg_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_conversations: {
        Row: {
          conversation_data: Json
          created_at: string | null
          id: string
          last_interaction_at: string | null
          session_id: string
          total_duration_seconds: number | null
          total_messages: number | null
          updated_at: string | null
          user_id: string
          voice_settings: Json | null
        }
        Insert: {
          conversation_data?: Json
          created_at?: string | null
          id?: string
          last_interaction_at?: string | null
          session_id: string
          total_duration_seconds?: number | null
          total_messages?: number | null
          updated_at?: string | null
          user_id: string
          voice_settings?: Json | null
        }
        Update: {
          conversation_data?: Json
          created_at?: string | null
          id?: string
          last_interaction_at?: string | null
          session_id?: string
          total_duration_seconds?: number | null
          total_messages?: number | null
          updated_at?: string | null
          user_id?: string
          voice_settings?: Json | null
        }
        Relationships: []
      }
      voice_sessions: {
        Row: {
          created_at: string | null
          duration_seconds: number | null
          elevenlabs_conversation_id: string | null
          id: string
          language: string | null
          metadata: Json | null
          transcript: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          duration_seconds?: number | null
          elevenlabs_conversation_id?: string | null
          id?: string
          language?: string | null
          metadata?: Json | null
          transcript?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          duration_seconds?: number | null
          elevenlabs_conversation_id?: string | null
          id?: string
          language?: string | null
          metadata?: Json | null
          transcript?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      complete_agent_task: {
        Args: {
          p_latency_ms?: number
          p_model_used?: string
          p_output: string
          p_task_id: string
          p_tokens_in?: number
          p_tokens_out?: number
        }
        Returns: undefined
      }
      get_current_user_role: { Args: never; Returns: string }
      get_kg_neighbours: {
        Args: { p_depth?: number; p_node_name: string; p_relation?: string }
        Returns: {
          depth: number
          domain: string
          edge_weight: number
          relation: string
          source_name: string
          target_es: string
          target_name: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      match_bee_facts: {
        Args: {
          filter_age?: string
          filter_difficulty?: number
          filter_domain?: string
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          age_level: string
          category: string
          content: string
          difficulty_level: number
          domain: string
          fun_fact: boolean
          id: string
          similarity: number
          title: string
        }[]
      }
      match_kg_nodes: {
        Args: {
          filter_age?: string
          filter_domain?: string
          filter_type?: string
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          age_level: string
          description: string
          domain: string
          id: string
          name: string
          name_es: string
          node_type: string
          similarity: number
          tags: string[]
        }[]
      }
      match_mochi_knowledge: {
        Args: {
          filter_category?: string
          filter_language?: string
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          category: string
          content: string
          id: string
          language: string
          similarity: number
          tags: string[]
          title: string
        }[]
      }
      match_vocabulary_cards: {
        Args: {
          filter_age?: string
          filter_difficulty?: number
          filter_domain?: string
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          age_level: string
          category: string
          difficulty_level: number
          domain: string
          example_en: string
          example_es: string
          id: string
          phonetic_en: string
          phonetic_es: string
          similarity: number
          word_en: string
          word_es: string
        }[]
      }
      orchestrate_mochi_request: {
        Args: {
          p_input: string
          p_language?: string
          p_session?: string
          p_user_id?: string
        }
        Returns: Json
      }
      track_user_event: {
        Args: {
          p_element_class?: string
          p_element_id?: string
          p_event_name: string
          p_event_type?: string
          p_metadata?: Json
          p_page_url?: string
        }
        Returns: string
      }
      unified_mochi_search: {
        Args: {
          filter_age?: string
          filter_domain?: string
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          age_level: string
          content: string
          domain: string
          extra: Json
          id: string
          language: string
          similarity: number
          source: string
          title: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
