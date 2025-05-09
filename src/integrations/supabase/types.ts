export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      experts: {
        Row: {
          average_rating: number | null
          created_at: string
          id: string
          name: string
          total_ratings: number | null
        }
        Insert: {
          average_rating?: number | null
          created_at?: string
          id?: string
          name: string
          total_ratings?: number | null
        }
        Update: {
          average_rating?: number | null
          created_at?: string
          id?: string
          name?: string
          total_ratings?: number | null
        }
        Relationships: []
      }
      issue_reports: {
        Row: {
          created_at: string
          details: string | null
          full_name: string
          id: string
          issue_type_id: string
          phone_number: string
          status: string
          tower_id: string
          unit_number: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          full_name: string
          id?: string
          issue_type_id: string
          phone_number: string
          status?: string
          tower_id: string
          unit_number: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          details?: string | null
          full_name?: string
          id?: string
          issue_type_id?: string
          phone_number?: string
          status?: string
          tower_id?: string
          unit_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_reports_issue_type_id_fkey"
            columns: ["issue_type_id"]
            isOneToOne: false
            referencedRelation: "issue_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_reports_tower_id_fkey"
            columns: ["tower_id"]
            isOneToOne: false
            referencedRelation: "towers"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_types: {
        Row: {
          created_at: string
          id: string
          name: string
          requires_details: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          requires_details?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          requires_details?: boolean
        }
        Relationships: []
      }
      manager_tower_access: {
        Row: {
          created_at: string
          id: string
          tower_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tower_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tower_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "manager_tower_access_tower_id_fkey"
            columns: ["tower_id"]
            isOneToOne: false
            referencedRelation: "towers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manager_tower_access_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          name: string | null
          role: Database["public"]["Enums"]["user_role"]
          username: string | null
        }
        Insert: {
          created_at?: string
          id: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          username?: string | null
        }
        Relationships: []
      }
      ratings: {
        Row: {
          comment: string | null
          created_at: string
          expert_id: string
          id: string
          rating: number
        }
        Insert: {
          comment?: string | null
          created_at?: string
          expert_id: string
          id?: string
          rating: number
        }
        Update: {
          comment?: string | null
          created_at?: string
          expert_id?: string
          id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "ratings_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
        ]
      }
      towers: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      user_has_tower_access: {
        Args: { tower_id: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "resident" | "manager" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["resident", "manager", "admin"],
    },
  },
} as const
