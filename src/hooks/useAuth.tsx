
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { authService, type AuthUser, type SignUpData, type SignInData } from '@/services/authService';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type CourierProfile = Database['public']['Tables']['courier_profiles']['Row'];
type UserRole = Database['public']['Enums']['user_role'];

// Extended profile interface that includes optional courier profile
interface ExtendedProfile extends Profile {
  courierProfile?: CourierProfile;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: ExtendedProfile | null;
  courierProfile: CourierProfile | null;
  loading: boolean;
  signIn: (data: SignInData) => Promise<{ error: any }>;
  signInWithEmployeeId: (employeeId: string, password: string) => Promise<{ error: any }>;
  signUp: (data: SignUpData) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>;
  updateCourierProfile: (updates: Partial<CourierProfile>) => Promise<boolean>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  updateOnlineStatus: (isOnline: boolean) => Promise<{ error: any }>;
  updateLocation: (lat: number, lng: number) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);



export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
  const [courierProfile, setCourierProfile] = useState<CourierProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    authService.getSession().then(({ session, profile: userProfile, error }) => {
      if (error) {
        console.error('Error getting session:', error);
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (userProfile) {
        setProfile(userProfile);
        if (userProfile.courierProfile) {
          setCourierProfile(userProfile.courierProfile);
        }
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const userProfile = await authService.getUserProfile(session.user.id);
          if (userProfile) {
            setProfile(userProfile);
            if (userProfile.courierProfile) {
              setCourierProfile(userProfile.courierProfile);
            }
          }
        } else {
          setProfile(null);
          setCourierProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (data: SignInData) => {
    try {
      const result = await authService.signIn(data);
      
      if (result.error) {
        toast.error(result.error.message || 'Login failed');
        return { error: result.error };
      }
      
      if (result.profile) {
        setProfile(result.profile);
        if (result.profile.courierProfile) {
          setCourierProfile(result.profile.courierProfile);
        }
      }
      
      toast.success('Login successful');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      return { error };
    }
  };

  const signInWithEmployeeId = async (employeeId: string, password: string) => {
    try {
      const result = await authService.signInWithEmployeeId(employeeId, password);
      
      if (result.error) {
        toast.error(result.error.message || 'Login failed');
        return { error: result.error };
      }
      
      if (result.profile) {
        setProfile(result.profile);
        if (result.profile.courierProfile) {
          setCourierProfile(result.profile.courierProfile);
        }
      }
      
      toast.success('Login successful');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      return { error };
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      const result = await authService.signUp(data);
      
      if (result.error) {
        toast.error(result.error.message || 'Registration failed');
        return { error: result.error };
      }
      
      toast.success('Registration successful! Please check your email for verification.');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setProfile(null);
      setCourierProfile(null);
      setUser(null);
      setSession(null);
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return false;
    
    try {
      const result = await authService.updateProfile(user.id, updates);
      
      if (result.error) {
        toast.error(result.error.message || 'Profile update failed');
        return false;
      }
      
      if (result.data && profile) {
        setProfile({ ...profile, ...result.data });
      }
      
      toast.success('Profile updated successfully');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Profile update failed');
      return false;
    }
  };

  const updateCourierProfile = async (updates: Partial<CourierProfile>) => {
    if (!user) return false;
    
    try {
      const result = await authService.updateCourierProfile(user.id, updates);
      
      if (result.error) {
        toast.error(result.error.message || 'Courier profile update failed');
        return false;
      }
      
      if (result.data && courierProfile) {
        setCourierProfile({ ...courierProfile, ...result.data });
      }
      
      toast.success('Courier profile updated successfully');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Courier profile update failed');
      return false;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const result = await authService.resetPassword(email);
      
      if (result.error) {
        toast.error(result.error.message || 'Password reset failed');
        return { error: result.error };
      }
      
      toast.success('Password reset email sent');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Password reset failed');
      return { error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const result = await authService.updatePassword(newPassword);
      
      if (result.error) {
        toast.error(result.error.message || 'Password update failed');
        return { error: result.error };
      }
      
      toast.success('Password updated successfully');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Password update failed');
      return { error };
    }
  };

  const updateOnlineStatus = async (isOnline: boolean) => {
    if (!user) return { error: { message: 'User not authenticated' } };
    
    try {
      const result = await authService.updateOnlineStatus(user.id, isOnline);
      
      if (result.error) {
        return { error: result.error };
      }
      
      // Update local state
      if (courierProfile) {
        setCourierProfile({ ...courierProfile, is_online: isOnline });
      }
      
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const updateLocation = async (lat: number, lng: number) => {
    if (!user) return { error: { message: 'User not authenticated' } };
    
    try {
      const result = await authService.updateLocation(user.id, lat, lng);
      
      if (result.error) {
        return { error: result.error };
      }
      
      // Update local state
      if (courierProfile) {
        setCourierProfile({ 
          ...courierProfile, 
          last_location_lat: lat,
          last_location_lng: lng,
          last_location_updated: new Date().toISOString()
        });
      }
      
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      courierProfile,
      loading,
      signIn,
      signInWithEmployeeId,
      signUp,
      signOut,
      updateProfile,
      updateCourierProfile,
      resetPassword,
      updatePassword,
      updateOnlineStatus,
      updateLocation
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
