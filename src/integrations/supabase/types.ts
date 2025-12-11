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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      community_groups: {
        Row: {
          cover_url: string | null
          created_at: string | null
          deity: Database["public"]["Enums"]["deity"] | null
          description: string | null
          id: string
          members_count: number | null
          name: string
          posts_count: number | null
          region: Database["public"]["Enums"]["indian_state"] | null
        }
        Insert: {
          cover_url?: string | null
          created_at?: string | null
          deity?: Database["public"]["Enums"]["deity"] | null
          description?: string | null
          id?: string
          members_count?: number | null
          name: string
          posts_count?: number | null
          region?: Database["public"]["Enums"]["indian_state"] | null
        }
        Update: {
          cover_url?: string | null
          created_at?: string | null
          deity?: Database["public"]["Enums"]["deity"] | null
          description?: string | null
          id?: string
          members_count?: number | null
          name?: string
          posts_count?: number | null
          region?: Database["public"]["Enums"]["indian_state"] | null
        }
        Relationships: []
      }
      followers: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followers_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "community_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          reel_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          reel_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          reel_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_reel_id_fkey"
            columns: ["reel_id"]
            isOneToOne: false
            referencedRelation: "reels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      music_tracks: {
        Row: {
          artist: string | null
          category: string | null
          cover_url: string | null
          created_at: string | null
          deity: Database["public"]["Enums"]["deity"] | null
          duration: number | null
          file_url: string | null
          id: string
          language: Database["public"]["Enums"]["indian_language"] | null
          play_count: number | null
          region: Database["public"]["Enums"]["indian_state"] | null
          title: string
        }
        Insert: {
          artist?: string | null
          category?: string | null
          cover_url?: string | null
          created_at?: string | null
          deity?: Database["public"]["Enums"]["deity"] | null
          duration?: number | null
          file_url?: string | null
          id?: string
          language?: Database["public"]["Enums"]["indian_language"] | null
          play_count?: number | null
          region?: Database["public"]["Enums"]["indian_state"] | null
          title: string
        }
        Update: {
          artist?: string | null
          category?: string | null
          cover_url?: string | null
          created_at?: string | null
          deity?: Database["public"]["Enums"]["deity"] | null
          duration?: number | null
          file_url?: string | null
          id?: string
          language?: Database["public"]["Enums"]["indian_language"] | null
          play_count?: number | null
          region?: Database["public"]["Enums"]["indian_state"] | null
          title?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          caption: string | null
          comments_count: number | null
          created_at: string | null
          deity: Database["public"]["Enums"]["deity"] | null
          id: string
          language: Database["public"]["Enums"]["indian_language"] | null
          likes_count: number | null
          media_type: Database["public"]["Enums"]["content_type"] | null
          media_url: string | null
          region: Database["public"]["Enums"]["indian_state"] | null
          shares_count: number | null
          user_id: string
        }
        Insert: {
          caption?: string | null
          comments_count?: number | null
          created_at?: string | null
          deity?: Database["public"]["Enums"]["deity"] | null
          id?: string
          language?: Database["public"]["Enums"]["indian_language"] | null
          likes_count?: number | null
          media_type?: Database["public"]["Enums"]["content_type"] | null
          media_url?: string | null
          region?: Database["public"]["Enums"]["indian_state"] | null
          shares_count?: number | null
          user_id: string
        }
        Update: {
          caption?: string | null
          comments_count?: number | null
          created_at?: string | null
          deity?: Database["public"]["Enums"]["deity"] | null
          id?: string
          language?: Database["public"]["Enums"]["indian_language"] | null
          likes_count?: number | null
          media_type?: Database["public"]["Enums"]["content_type"] | null
          media_url?: string | null
          region?: Database["public"]["Enums"]["indian_state"] | null
          shares_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          deity_preference: Database["public"]["Enums"]["deity"] | null
          followers_count: number | null
          following_count: number | null
          full_name: string | null
          id: string
          language: Database["public"]["Enums"]["indian_language"] | null
          posts_count: number | null
          state: Database["public"]["Enums"]["indian_state"] | null
          updated_at: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          deity_preference?: Database["public"]["Enums"]["deity"] | null
          followers_count?: number | null
          following_count?: number | null
          full_name?: string | null
          id?: string
          language?: Database["public"]["Enums"]["indian_language"] | null
          posts_count?: number | null
          state?: Database["public"]["Enums"]["indian_state"] | null
          updated_at?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          deity_preference?: Database["public"]["Enums"]["deity"] | null
          followers_count?: number | null
          following_count?: number | null
          full_name?: string | null
          id?: string
          language?: Database["public"]["Enums"]["indian_language"] | null
          posts_count?: number | null
          state?: Database["public"]["Enums"]["indian_state"] | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      reels: {
        Row: {
          caption: string | null
          comments_count: number | null
          created_at: string | null
          deity: Database["public"]["Enums"]["deity"] | null
          id: string
          language: Database["public"]["Enums"]["indian_language"] | null
          likes_count: number | null
          music_id: string | null
          region: Database["public"]["Enums"]["indian_state"] | null
          thumbnail_url: string | null
          user_id: string
          video_url: string
          views_count: number | null
        }
        Insert: {
          caption?: string | null
          comments_count?: number | null
          created_at?: string | null
          deity?: Database["public"]["Enums"]["deity"] | null
          id?: string
          language?: Database["public"]["Enums"]["indian_language"] | null
          likes_count?: number | null
          music_id?: string | null
          region?: Database["public"]["Enums"]["indian_state"] | null
          thumbnail_url?: string | null
          user_id: string
          video_url: string
          views_count?: number | null
        }
        Update: {
          caption?: string | null
          comments_count?: number | null
          created_at?: string | null
          deity?: Database["public"]["Enums"]["deity"] | null
          id?: string
          language?: Database["public"]["Enums"]["indian_language"] | null
          likes_count?: number | null
          music_id?: string | null
          region?: Database["public"]["Enums"]["indian_state"] | null
          thumbnail_url?: string | null
          user_id?: string
          video_url?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reels_music_id_fkey"
            columns: ["music_id"]
            isOneToOne: false
            referencedRelation: "music_tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reels_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      temples: {
        Row: {
          aarti_timings: Json | null
          address: string | null
          created_at: string | null
          deity: Database["public"]["Enums"]["deity"] | null
          description: string | null
          district: string | null
          festivals: string[] | null
          followers_count: number | null
          id: string
          images: string[] | null
          name: string
          state: Database["public"]["Enums"]["indian_state"]
        }
        Insert: {
          aarti_timings?: Json | null
          address?: string | null
          created_at?: string | null
          deity?: Database["public"]["Enums"]["deity"] | null
          description?: string | null
          district?: string | null
          festivals?: string[] | null
          followers_count?: number | null
          id?: string
          images?: string[] | null
          name: string
          state: Database["public"]["Enums"]["indian_state"]
        }
        Update: {
          aarti_timings?: Json | null
          address?: string | null
          created_at?: string | null
          deity?: Database["public"]["Enums"]["deity"] | null
          description?: string | null
          district?: string | null
          festivals?: string[] | null
          followers_count?: number | null
          id?: string
          images?: string[] | null
          name?: string
          state?: Database["public"]["Enums"]["indian_state"]
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
      content_type: "photo" | "video" | "reel"
      deity:
        | "shiva"
        | "vishnu"
        | "krishna"
        | "ganesh"
        | "murugan"
        | "durga"
        | "lakshmi"
        | "saraswati"
        | "hanuman"
        | "rama"
        | "other"
      indian_language:
        | "tamil"
        | "telugu"
        | "kannada"
        | "malayalam"
        | "marathi"
        | "gujarati"
        | "bengali"
        | "hindi"
        | "punjabi"
        | "odia"
        | "other"
      indian_state:
        | "tamil_nadu"
        | "andhra_pradesh"
        | "telangana"
        | "karnataka"
        | "kerala"
        | "maharashtra"
        | "gujarat"
        | "west_bengal"
        | "uttar_pradesh"
        | "rajasthan"
        | "madhya_pradesh"
        | "bihar"
        | "odisha"
        | "punjab"
        | "haryana"
        | "other"
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
      content_type: ["photo", "video", "reel"],
      deity: [
        "shiva",
        "vishnu",
        "krishna",
        "ganesh",
        "murugan",
        "durga",
        "lakshmi",
        "saraswati",
        "hanuman",
        "rama",
        "other",
      ],
      indian_language: [
        "tamil",
        "telugu",
        "kannada",
        "malayalam",
        "marathi",
        "gujarati",
        "bengali",
        "hindi",
        "punjabi",
        "odia",
        "other",
      ],
      indian_state: [
        "tamil_nadu",
        "andhra_pradesh",
        "telangana",
        "karnataka",
        "kerala",
        "maharashtra",
        "gujarat",
        "west_bengal",
        "uttar_pradesh",
        "rajasthan",
        "madhya_pradesh",
        "bihar",
        "odisha",
        "punjab",
        "haryana",
        "other",
      ],
    },
  },
} as const
