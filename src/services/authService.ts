import { supabase } from '@/integrations/supabase/client';
import { supabaseAdmin, adminAuth } from '@/integrations/supabase/adminClient';
import type { Database } from '@/integrations/supabase/types';
import type { User, Session } from '@supabase/supabase-js';

type UserRole = Database['public']['Enums']['user_role'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type CourierProfile = Database['public']['Tables']['courier_profiles']['Row'];

export interface AuthUser extends User {
  profile?: Profile;
  courierProfile?: CourierProfile;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone?: string;
  employee_id?: string;
  area?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

class AuthService {
  // Sign up new user
  async signUp(data: SignUpData) {
    try {
      const { email, password, name, role, phone, employee_id, area } = data;
      
      // Create user with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            phone,
            employee_id,
            area
          }
        }
      });

      if (authError) {
        throw authError;
      }

      return { user: authData.user, session: authData.session, error: null };
    } catch (error: any) {
      return { user: null, session: null, error };
    }
  }

  // Sign in user
  async signIn(data: SignInData) {
    try {
      const { email, password } = data;
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        throw authError;
      }

      // Get user profile
      const profile = await this.getUserProfile(authData.user.id);
      
      return { 
        user: authData.user, 
        session: authData.session, 
        profile,
        error: null 
      };
    } catch (error: any) {
      return { user: null, session: null, profile: null, error };
    }
  }

  // Sign in with employee ID (for couriers)
  async signInWithEmployeeId(employeeId: string, password: string) {
    try {
      // First, get the user by employee_id
      const { data: courierData, error: courierError } = await supabase
        .from('courier_profiles')
        .select(`
          id,
          employee_id,
          profiles!courier_profiles_id_fkey(
            id,
            email,
            name,
            role
          )
        `)
        .eq('employee_id', employeeId)
        .single();

      if (courierError || !courierData) {
        throw new Error('Employee ID not found');
      }

      // Sign in with email and password
      const email = courierData.profiles.email;
      return await this.signIn({ email, password });
    } catch (error: any) {
      return { user: null, session: null, profile: null, error };
    }
  }

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  }

  // Get current session
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (session?.user) {
        const profile = await this.getUserProfile(session.user.id);
        return { session, profile, error: null };
      }
      
      return { session, profile: null, error: null };
    } catch (error: any) {
      return { session: null, profile: null, error };
    }
  }

  // Get user profile
  async getUserProfile(userId: string) {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // If user is a courier, also get courier profile
      if (profile.role === 'kurir') {
        const { data: courierProfile, error: courierError } = await supabase
          .from('courier_profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (!courierError && courierProfile) {
          return { ...profile, courierProfile };
        }
      }

      return profile;
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  // Update user profile
  async updateProfile(userId: string, updates: Partial<Profile>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }

  // Update courier profile
  async updateCourierProfile(userId: string, updates: Partial<CourierProfile>) {
    try {
      const { data, error } = await supabase
        .from('courier_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }

  // Reset password
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  }

  // Update password
  async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  }

  // Admin functions (requires service role)
  async createUserAsAdmin(userData: SignUpData) {
    try {
      const { email, password, name, role, phone, employee_id, area } = userData;
      
      // Create user with admin client
      const { data: authData, error: authError } = await adminAuth.createUser(
        email,
        password,
        {
          name,
          role,
          phone,
          employee_id,
          area
        }
      );

      if (authError || !authData.user) {
        throw authError;
      }

      return { user: authData.user, error: null };
    } catch (error: any) {
      return { user: null, error };
    }
  }

  async deleteUserAsAdmin(userId: string) {
    try {
      // Delete user with admin client
      const { error } = await adminAuth.deleteUser(userId);
      if (error) throw error;
      
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  }

  async listUsersAsAdmin(page = 1, perPage = 50) {
    try {
      const { data, error } = await adminAuth.listUsers(page, perPage);
      if (error) throw error;
      
      return { users: data?.users || [], error: null };
    } catch (error: any) {
      return { users: [], error };
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  // Update user online status (for couriers)
  async updateOnlineStatus(userId: string, isOnline: boolean) {
    try {
      const { error } = await supabase
        .from('courier_profiles')
        .update({ 
          is_online: isOnline,
          last_location_updated: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  }

  // Update user location (for couriers)
  async updateLocation(userId: string, lat: number, lng: number) {
    try {
      const { error } = await supabase
        .from('courier_profiles')
        .update({ 
          last_location_lat: lat,
          last_location_lng: lng,
          last_location_updated: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  }
}

export const authService = new AuthService();
export default authService;