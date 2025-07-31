export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      bee_facts: {
        Row: {
          category: string
          content: string
          created_at: string
          difficulty_level: number | null
          fun_fact: boolean | null
          id: string
          image_url: string | null
          title: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          difficulty_level?: number | null
          fun_fact?: boolean | null
          id?: string
          image_url?: string | null
          title: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          difficulty_level?: number | null
          fun_fact?: boolean | null
          id?: string
          image_url?: string | null
          title?: string
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
      user_consents: {
        Row: {
          consent_date: string
          consent_given: boolean
          consent_type: string
          consent_version: string | null
          email: string | null
          id: string
          ip_address: unknown | null
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
          ip_address?: unknown | null
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
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
          withdrawn_at?: string | null
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
          email: string
          id: string
          language: string
          updated_at: string
        }
        Insert: {
          age: number
          created_at?: string
          email: string
          id?: string
          language?: string
          updated_at?: string
        }
        Update: {
          age?: number
          created_at?: string
          email?: string
          id?: string
          language?: string
          updated_at?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
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
