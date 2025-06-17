// Admin client with service role for full access
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cpuxuossynzfqmuorvkf.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwdXh1b3NzeW56ZnFtdW9ydmtmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTk3ODczOSwiZXhwIjoyMDY1NTU0NzM5fQ.5olrPeBSoFBsTJeKWvIDCkUF1u-p8nnI0FWA3hCOwSo";

// Admin client with service role - bypasses RLS
export const supabaseAdmin = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Helper functions for admin operations
export const adminAuth = {
  // Create user with custom metadata
  async createUser(email: string, password: string, metadata: any = {}) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: metadata
    });
    return { data, error };
  },

  // Update user metadata
  async updateUser(userId: string, updates: any) {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      updates
    );
    return { data, error };
  },

  // Delete user
  async deleteUser(userId: string) {
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    return { data, error };
  },

  // List all users
  async listUsers(page = 1, perPage = 1000) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage
    });
    return { data, error };
  },

  // Get user by ID
  async getUserById(userId: string) {
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
    return { data, error };
  },

  // Generate password reset link
  async generatePasswordResetLink(email: string) {
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email
    });
    return { data, error };
  },

  // Generate email confirmation link
  async generateEmailConfirmationLink(email: string) {
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email
    });
    return { data, error };
  }
};