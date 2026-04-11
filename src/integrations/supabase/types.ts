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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          avatar: string | null
          budget_band: string | null
          city: string | null
          color_preferences: string | null
          country: string | null
          created_at: string
          id: string
          instagram: string | null
          last_outreach: string | null
          last_purchase: string | null
          name: string
          notes: string | null
          outstanding: number
          preferred_brands: string[] | null
          preferred_categories: string[] | null
          sizes: string | null
          style_notes: string | null
          tier: string
          total_paid: number
          total_spend: number
          updated_at: string
          user_id: string
          whatsapp: string | null
        }
        Insert: {
          avatar?: string | null
          budget_band?: string | null
          city?: string | null
          color_preferences?: string | null
          country?: string | null
          created_at?: string
          id?: string
          instagram?: string | null
          last_outreach?: string | null
          last_purchase?: string | null
          name: string
          notes?: string | null
          outstanding?: number
          preferred_brands?: string[] | null
          preferred_categories?: string[] | null
          sizes?: string | null
          style_notes?: string | null
          tier?: string
          total_paid?: number
          total_spend?: number
          updated_at?: string
          user_id: string
          whatsapp?: string | null
        }
        Update: {
          avatar?: string | null
          budget_band?: string | null
          city?: string | null
          color_preferences?: string | null
          country?: string | null
          created_at?: string
          id?: string
          instagram?: string | null
          last_outreach?: string | null
          last_purchase?: string | null
          name?: string
          notes?: string | null
          outstanding?: number
          preferred_brands?: string[] | null
          preferred_categories?: string[] | null
          sizes?: string | null
          style_notes?: string | null
          tier?: string
          total_paid?: number
          total_spend?: number
          updated_at?: string
          user_id?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          brand: string | null
          client_id: string | null
          id: string
          name: string
          store: string | null
          thumbnail: string | null
          trip_id: string | null
          type: string
          uploaded_at: string
          url: string
          user_id: string
        }
        Insert: {
          brand?: string | null
          client_id?: string | null
          id?: string
          name: string
          store?: string | null
          thumbnail?: string | null
          trip_id?: string | null
          type?: string
          uploaded_at?: string
          url: string
          user_id: string
        }
        Update: {
          brand?: string | null
          client_id?: string | null
          id?: string
          name?: string
          store?: string | null
          thumbnail?: string | null
          trip_id?: string | null
          type?: string
          uploaded_at?: string
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_ups: {
        Row: {
          client_id: string
          completed: boolean
          created_at: string
          due_date: string
          id: string
          note: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          completed?: boolean
          created_at?: string
          due_date: string
          id?: string
          note: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          completed?: boolean
          created_at?: string
          due_date?: string
          id?: string
          note?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_ups_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          amount_paid: number
          brand: string | null
          category: string | null
          client_id: string | null
          cost_price: number
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_requested: boolean
          payment_status: string
          selling_price: number
          store: string | null
          trip_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_paid?: number
          brand?: string | null
          category?: string | null
          client_id?: string | null
          cost_price?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_requested?: boolean
          payment_status?: string
          selling_price?: number
          store?: string | null
          trip_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_paid?: number
          brand?: string | null
          category?: string | null
          client_id?: string | null
          cost_price?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_requested?: boolean
          payment_status?: string
          selling_price?: number
          store?: string | null
          trip_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "items_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      key_dates: {
        Row: {
          client_id: string | null
          created_at: string
          date: string
          id: string
          notes: string | null
          title: string
          trip_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          date: string
          id?: string
          notes?: string | null
          title: string
          trip_id?: string | null
          type?: string
          user_id: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          title?: string
          trip_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "key_dates_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "key_dates_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          client_id: string
          created_at: string
          date: string
          id: string
          item_id: string | null
          method: string | null
          notes: string | null
          trip_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          client_id: string
          created_at?: string
          date?: string
          id?: string
          item_id?: string | null
          method?: string | null
          notes?: string | null
          trip_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          client_id?: string
          created_at?: string
          date?: string
          id?: string
          item_id?: string | null
          method?: string | null
          notes?: string | null
          trip_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_clients: {
        Row: {
          client_id: string
          id: string
          trip_id: string
          user_id: string
        }
        Insert: {
          client_id: string
          id?: string
          trip_id: string
          user_id: string
        }
        Update: {
          client_id?: string
          id?: string
          trip_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_clients_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_clients_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          carrier_notes: string | null
          city: string | null
          created_at: string
          date_end: string | null
          date_start: string | null
          id: string
          name: string
          notes: string | null
          status: string
          stores: string[] | null
          tags: string[] | null
          total_collected: number
          total_cost: number
          total_selling: number
          updated_at: string
          user_id: string
        }
        Insert: {
          carrier_notes?: string | null
          city?: string | null
          created_at?: string
          date_end?: string | null
          date_start?: string | null
          id?: string
          name: string
          notes?: string | null
          status?: string
          stores?: string[] | null
          tags?: string[] | null
          total_collected?: number
          total_cost?: number
          total_selling?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          carrier_notes?: string | null
          city?: string | null
          created_at?: string
          date_end?: string | null
          date_start?: string | null
          id?: string
          name?: string
          notes?: string | null
          status?: string
          stores?: string[] | null
          tags?: string[] | null
          total_collected?: number
          total_cost?: number
          total_selling?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
