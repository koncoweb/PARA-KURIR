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
      approval_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          current_data: Json | null
          id: string
          notes: string | null
          request_data: Json
          request_type: Database["public"]["Enums"]["approval_request_type"]
          requester_id: string
          requester_name: string
          status: Database["public"]["Enums"]["approval_status"]
          target_admin_id: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          current_data?: Json | null
          id?: string
          notes?: string | null
          request_data: Json
          request_type: Database["public"]["Enums"]["approval_request_type"]
          requester_id: string
          requester_name: string
          status?: Database["public"]["Enums"]["approval_status"]
          target_admin_id?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          current_data?: Json | null
          id?: string
          notes?: string | null
          request_data?: Json
          request_type?: Database["public"]["Enums"]["approval_request_type"]
          requester_id?: string
          requester_name?: string
          status?: Database["public"]["Enums"]["approval_status"]
          target_admin_id?: string | null
        }
        Relationships: []
      }
      attendance_records: {
        Row: {
          id: string
          courier_id: string
          date: string
          check_in_time: string | null
          check_out_time: string | null
          check_in_location_lat: number | null
          check_in_location_lng: number | null
          check_out_location_lat: number | null
          check_out_location_lng: number | null
          total_hours: number
          status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          courier_id: string
          date: string
          check_in_time?: string | null
          check_out_time?: string | null
          check_in_location_lat?: number | null
          check_in_location_lng?: number | null
          check_out_location_lat?: number | null
          check_out_location_lng?: number | null
          total_hours?: number
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          courier_id?: string
          date?: string
          check_in_time?: string | null
          check_out_time?: string | null
          check_in_location_lat?: number | null
          check_in_location_lng?: number | null
          check_out_location_lat?: number | null
          check_out_location_lng?: number | null
          total_hours?: number
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_courier_id_fkey"
            columns: ["courier_id"]
            isOneToOne: false
            referencedRelation: "courier_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      courier_profiles: {
        Row: {
          id: string
          employee_id: string
          area: string
          supervisor_id: string | null
          daily_target: number
          performance_rating: number
          last_location_lat: number | null
          last_location_lng: number | null
          last_location_updated: string | null
          is_online: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          employee_id: string
          area: string
          supervisor_id?: string | null
          daily_target?: number
          performance_rating?: number
          last_location_lat?: number | null
          last_location_lng?: number | null
          last_location_updated?: string | null
          is_online?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          area?: string
          supervisor_id?: string | null
          daily_target?: number
          performance_rating?: number
          last_location_lat?: number | null
          last_location_lng?: number | null
          last_location_updated?: string | null
          is_online?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courier_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courier_profiles_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      daily_packages: {
        Row: {
          id: string
          courier_id: string
          tracking_number: string
          recipient_name: string
          recipient_phone: string | null
          address: string
          is_cod: boolean
          cod_amount: number
          status: string
          scan_time: string | null
          delivery_started_at: string | null
          delivered_at: string | null
          delivered_by: string | null
          delivery_photo_url: string | null
          pending_reason: string | null
          returned_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          courier_id: string
          tracking_number: string
          recipient_name: string
          recipient_phone?: string | null
          address: string
          is_cod?: boolean
          cod_amount?: number
          status?: string
          scan_time?: string | null
          delivery_started_at?: string | null
          delivered_at?: string | null
          delivered_by?: string | null
          delivery_photo_url?: string | null
          pending_reason?: string | null
          returned_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          courier_id?: string
          tracking_number?: string
          recipient_name?: string
          recipient_phone?: string | null
          address?: string
          is_cod?: boolean
          cod_amount?: number
          status?: string
          scan_time?: string | null
          delivery_started_at?: string | null
          delivered_at?: string | null
          delivered_by?: string | null
          delivery_photo_url?: string | null
          pending_reason?: string | null
          returned_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_packages_courier_id_fkey"
            columns: ["courier_id"]
            isOneToOne: false
            referencedRelation: "courier_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      daily_summaries: {
        Row: {
          id: string
          courier_id: string
          date: string
          total_packages: number
          cod_packages: number
          non_cod_packages: number
          delivered_packages: number
          pending_packages: number
          returned_packages: number
          total_cod_amount: number
          collected_cod_amount: number
          performance_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          courier_id: string
          date: string
          total_packages?: number
          cod_packages?: number
          non_cod_packages?: number
          delivered_packages?: number
          pending_packages?: number
          returned_packages?: number
          total_cod_amount?: number
          collected_cod_amount?: number
          performance_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          courier_id?: string
          date?: string
          total_packages?: number
          cod_packages?: number
          non_cod_packages?: number
          delivered_packages?: number
          pending_packages?: number
          returned_packages?: number
          total_cod_amount?: number
          collected_cod_amount?: number
          performance_score?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_summaries_courier_id_fkey"
            columns: ["courier_id"]
            isOneToOne: false
            referencedRelation: "courier_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          is_active: boolean
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: Database["public"]["Enums"]["user_role"]
          is_active?: boolean
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          is_active?: boolean
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
      approval_request_type:
        | "create_admin"
        | "edit_admin"
        | "toggle_status"
        | "delete_admin"
        | "import_pic_data"
        | "import_kurir_data"
      approval_status: "pending" | "approved" | "rejected"
      user_role: "master_admin" | "admin" | "pic" | "kurir"
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
      approval_request_type: [
        "create_admin",
        "edit_admin",
        "toggle_status",
        "delete_admin",
        "import_pic_data",
        "import_kurir_data",
      ],
      approval_status: ["pending", "approved", "rejected"],
      user_role: ["master_admin", "admin", "pic", "kurir"],
    },
  },
} as const
