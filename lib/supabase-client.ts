"use client"

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  subscription_tier: "free" | "pro" | "enterprise"
  queries_used: number
  queries_limit: number
}

export interface Document {
  id: string
  user_id: string
  name: string
  type: string
  file_path?: string
  size: number
  upload_date: string
  status: "processing" | "processed" | "failed"
  chunk_count: number
  created_at: string
}

export interface QueryLog {
  id: string
  user_id: string
  question: string
  response: string
  sources: string[]
  response_time: number
  created_at: string
}

// Auth helpers
export const authHelpers = {
  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    return { data, error }
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return { data, error }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    return { user, error }
  },

  async getProfile(userId: string) {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()
    return { data, error }
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select().single()
    return { data, error }
  },
}

// Document operations
export const documentOperations = {
  async uploadDocument(userId: string, document: Omit<Document, "id" | "user_id" | "created_at">) {
    const { data, error } = await supabase
      .from("documents")
      .insert({ ...document, user_id: userId })
      .select()
      .single()
    return { data, error }
  },

  async getUserDocuments(userId: string) {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
    return { data, error }
  },

  async deleteDocument(documentId: string, userId: string) {
    const { error } = await supabase.from("documents").delete().eq("id", documentId).eq("user_id", userId)
    return { error }
  },

  async updateDocumentStatus(documentId: string, status: Document["status"], chunkCount?: number) {
    const updates: any = { status }
    if (chunkCount !== undefined) {
      updates.chunk_count = chunkCount
    }

    const { data, error } = await supabase.from("documents").update(updates).eq("id", documentId).select().single()
    return { data, error }
  },
}

// Query operations
export const queryOperations = {
  async logQuery(userId: string, queryLog: Omit<QueryLog, "id" | "user_id" | "created_at">) {
    const { data, error } = await supabase
      .from("query_logs")
      .insert({ ...queryLog, user_id: userId })
      .select()
      .single()
    return { data, error }
  },

  async getUserQueries(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from("query_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)
    return { data, error }
  },

  async getQueryStats(userId: string) {
    const { data, error } = await supabase.from("query_logs").select("id").eq("user_id", userId)

    return {
      data: { count: data?.length || 0 },
      error,
    }
  },
}
