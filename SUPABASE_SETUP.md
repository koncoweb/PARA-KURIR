# Supabase Authentication Setup Guide

## Overview
This project now includes full Supabase authentication integration with the following features:
- User registration and login
- Role-based access control (master_admin, admin, pic, kurir)
- Profile management
- Courier-specific features
- Admin operations with service role

## Setup Instructions

### 1. Environment Variables
Copy `.env.local` and update with your Supabase credentials:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Database Migration
Run the migration to create necessary tables:

```bash
supabase db push
```

This will create:
- `profiles` table for user profiles
- `courier_profiles` table for courier-specific data
- `daily_packages`, `daily_summaries`, `attendance_records` tables
- Row Level Security policies
- User role enum

### 3. Authentication Features

#### User Roles
- **master_admin**: Full system access
- **admin**: Manage PIC and couriers
- **pic**: Manage couriers in their area
- **kurir**: Courier operations

#### Available Functions
- `signIn(data)` - Email/password login
- `signInWithEmployeeId(employeeId, password)` - Employee ID login
- `signUp(data)` - User registration
- `signOut()` - Logout
- `updateProfile(updates)` - Update user profile
- `updateCourierProfile(updates)` - Update courier profile
- `resetPassword(email)` - Password reset
- `updatePassword(newPassword)` - Change password
- `updateOnlineStatus(isOnline)` - Update courier online status
- `updateLocation(lat, lng)` - Update courier location

### 4. Admin Operations
The `adminClient.ts` provides admin functions using service role:
- Create/delete users
- List all users
- Generate password reset links
- Bypass Row Level Security for admin operations

### 5. Security Notes
- Service role key bypasses RLS - use carefully
- Store service role key securely (server-side only)
- Regular users use anon key with RLS protection
- All sensitive operations require proper authentication

### 6. File Structure
```
src/
├── integrations/supabase/
│   ├── client.ts          # Regular Supabase client
│   ├── adminClient.ts     # Admin client with service role
│   └── types.ts           # Database type definitions
├── services/
│   └── authService.ts     # Authentication service
├── hooks/
│   └── useAuth.tsx        # Authentication hook
└── pages/
    ├── Auth.tsx           # Login/Register page
    ├── Login.tsx          # Simple login page
    └── Dashboard.tsx      # Main dashboard
```

### 7. Usage Example

```tsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, profile, signIn, signOut } = useAuth();
  
  const handleLogin = async () => {
    const result = await signIn({
      email: 'user@example.com',
      password: 'password123'
    });
    
    if (result.error) {
      console.error('Login failed:', result.error.message);
    }
  };
  
  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {profile?.name}!</p>
          <button onClick={signOut}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

## Migration from Mock Data

The following changes were made to integrate real Supabase authentication:

1. **Removed mock user data** from `useAuth.tsx`
2. **Updated authentication functions** to use Supabase
3. **Added proper TypeScript types** for all database tables
4. **Implemented real user sessions** with automatic refresh
5. **Added profile management** with role-based access
6. **Updated all components** to use new auth system

## Troubleshooting

### Common Issues
1. **Environment variables not loaded**: Restart development server
2. **Migration errors**: Check Supabase connection and permissions
3. **Authentication failures**: Verify email confirmation settings
4. **RLS policy errors**: Check user roles and permissions

### Support
For issues with Supabase integration, check:
- Supabase dashboard logs
- Browser console for client-side errors
- Network tab for API request failures