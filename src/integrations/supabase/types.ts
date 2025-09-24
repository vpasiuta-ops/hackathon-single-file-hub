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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          password_hash: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          password_hash: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          password_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          id: string
          recipient_email: string
          sent_at: string
          sent_by: string | null
          status: string
          template_id: string | null
        }
        Insert: {
          id?: string
          recipient_email: string
          sent_at?: string
          sent_by?: string | null
          status?: string
          template_id?: string | null
        }
        Update: {
          id?: string
          recipient_email?: string
          sent_at?: string
          sent_by?: string | null
          status?: string
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_sent_by_fkey"
            columns: ["sent_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          created_at: string
          created_by: string | null
          html_content: string
          id: string
          name: string
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          html_content: string
          id?: string
          name: string
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          html_content?: string
          id?: string
          name?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      hackathon_registrations: {
        Row: {
          hackathon_id: string
          id: string
          registered_at: string
          registered_by: string
          team_id: string
        }
        Insert: {
          hackathon_id: string
          id?: string
          registered_at?: string
          registered_by: string
          team_id: string
        }
        Update: {
          hackathon_id?: string
          id?: string
          registered_at?: string
          registered_by?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hackathon_registrations_hackathon_id_fkey"
            columns: ["hackathon_id"]
            isOneToOne: false
            referencedRelation: "hackathons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hackathon_registrations_registered_by_fkey"
            columns: ["registered_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "hackathon_registrations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      hackathons: {
        Row: {
          created_at: string
          description: string
          end_date: string
          evaluation_criteria: Json | null
          id: string
          jury: Json | null
          max_team_size: number | null
          partner_cases: Json | null
          partners: Json | null
          prize_fund: string | null
          prizes: Json | null
          registration_deadline: string
          rules_and_requirements: string | null
          short_description: string | null
          start_date: string
          status: string | null
          timeline: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          end_date: string
          evaluation_criteria?: Json | null
          id?: string
          jury?: Json | null
          max_team_size?: number | null
          partner_cases?: Json | null
          partners?: Json | null
          prize_fund?: string | null
          prizes?: Json | null
          registration_deadline: string
          rules_and_requirements?: string | null
          short_description?: string | null
          start_date: string
          status?: string | null
          timeline?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          end_date?: string
          evaluation_criteria?: Json | null
          id?: string
          jury?: Json | null
          max_team_size?: number | null
          partner_cases?: Json | null
          partners?: Json | null
          prize_fund?: string | null
          prizes?: Json | null
          registration_deadline?: string
          rules_and_requirements?: string | null
          short_description?: string | null
          start_date?: string
          status?: string | null
          timeline?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          discord: string | null
          email: string | null
          existing_team_name: string | null
          experience_level: string | null
          first_name: string | null
          id: string
          interested_categories: string[] | null
          is_profile_complete: boolean
          last_name: string | null
          location: string | null
          looking_for_roles: string[] | null
          participation_status: string | null
          phone: string | null
          portfolio_url: string | null
          ready_to_lead: boolean | null
          roles: string[] | null
          skills: string[] | null
          team_description: string | null
          technologies: string[] | null
          telegram: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          discord?: string | null
          email?: string | null
          existing_team_name?: string | null
          experience_level?: string | null
          first_name?: string | null
          id?: string
          interested_categories?: string[] | null
          is_profile_complete?: boolean
          last_name?: string | null
          location?: string | null
          looking_for_roles?: string[] | null
          participation_status?: string | null
          phone?: string | null
          portfolio_url?: string | null
          ready_to_lead?: boolean | null
          roles?: string[] | null
          skills?: string[] | null
          team_description?: string | null
          technologies?: string[] | null
          telegram?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          discord?: string | null
          email?: string | null
          existing_team_name?: string | null
          experience_level?: string | null
          first_name?: string | null
          id?: string
          interested_categories?: string[] | null
          is_profile_complete?: boolean
          last_name?: string | null
          location?: string | null
          looking_for_roles?: string[] | null
          participation_status?: string | null
          phone?: string | null
          portfolio_url?: string | null
          ready_to_lead?: boolean | null
          roles?: string[] | null
          skills?: string[] | null
          team_description?: string | null
          technologies?: string[] | null
          telegram?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      registration_tokens: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      team_applications: {
        Row: {
          created_at: string
          id: string
          message: string | null
          status: string
          team_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          status?: string
          team_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          status?: string
          team_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_applications_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          id: string
          joined_at: string
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      teams: {
        Row: {
          captain_id: string
          created_at: string
          description: string
          id: string
          looking_for: string[] | null
          name: string
          status: string | null
          updated_at: string
        }
        Insert: {
          captain_id: string
          created_at?: string
          description: string
          id?: string
          looking_for?: string[] | null
          name: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          captain_id?: string
          created_at?: string
          description?: string
          id?: string
          looking_for?: string[] | null
          name?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_captain_id_fkey"
            columns: ["captain_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
