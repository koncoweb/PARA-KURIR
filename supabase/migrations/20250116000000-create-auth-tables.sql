-- Create user roles enum
CREATE TYPE user_role AS ENUM (
  'master_admin',
  'admin', 
  'pic',
  'kurir'
);

-- Create profiles table for all users
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'kurir',
  is_active BOOLEAN DEFAULT true,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courier_profiles table for courier-specific data
CREATE TABLE courier_profiles (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  employee_id TEXT UNIQUE NOT NULL,
  area TEXT NOT NULL,
  supervisor_id UUID REFERENCES profiles(id),
  daily_target INTEGER DEFAULT 0,
  performance_rating DECIMAL(3,2) DEFAULT 0.00,
  last_location_lat DECIMAL(10,8),
  last_location_lng DECIMAL(11,8),
  last_location_updated TIMESTAMP WITH TIME ZONE,
  is_online BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_packages table
CREATE TABLE daily_packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  courier_id UUID REFERENCES courier_profiles(id) ON DELETE CASCADE NOT NULL,
  tracking_number TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  recipient_phone TEXT,
  address TEXT NOT NULL,
  is_cod BOOLEAN DEFAULT false,
  cod_amount DECIMAL(12,2) DEFAULT 0.00,
  status TEXT DEFAULT 'input' CHECK (status IN ('input', 'scanned', 'in_delivery', 'delivered', 'pending', 'returned')),
  scan_time TIMESTAMP WITH TIME ZONE,
  delivery_started_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  delivered_by TEXT,
  delivery_photo_url TEXT,
  pending_reason TEXT,
  returned_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_summaries table
CREATE TABLE daily_summaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  courier_id UUID REFERENCES courier_profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  total_packages INTEGER DEFAULT 0,
  cod_packages INTEGER DEFAULT 0,
  non_cod_packages INTEGER DEFAULT 0,
  delivered_packages INTEGER DEFAULT 0,
  pending_packages INTEGER DEFAULT 0,
  returned_packages INTEGER DEFAULT 0,
  total_cod_amount DECIMAL(12,2) DEFAULT 0.00,
  collected_cod_amount DECIMAL(12,2) DEFAULT 0.00,
  performance_score DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(courier_id, date)
);

-- Create attendance_records table
CREATE TABLE attendance_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  courier_id UUID REFERENCES courier_profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  check_in_time TIMESTAMP WITH TIME ZONE,
  check_out_time TIMESTAMP WITH TIME ZONE,
  check_in_location_lat DECIMAL(10,8),
  check_in_location_lng DECIMAL(11,8),
  check_out_location_lat DECIMAL(10,8),
  check_out_location_lng DECIMAL(11,8),
  total_hours DECIMAL(4,2) DEFAULT 0.00,
  status TEXT DEFAULT 'absent' CHECK (status IN ('present', 'absent', 'late', 'early_leave')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(courier_id, date)
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_courier_profiles_employee_id ON courier_profiles(employee_id);
CREATE INDEX idx_courier_profiles_area ON courier_profiles(area);
CREATE INDEX idx_daily_packages_courier_id ON daily_packages(courier_id);
CREATE INDEX idx_daily_packages_status ON daily_packages(status);
CREATE INDEX idx_daily_packages_tracking_number ON daily_packages(tracking_number);
CREATE INDEX idx_daily_summaries_courier_date ON daily_summaries(courier_id, date);
CREATE INDEX idx_attendance_records_courier_date ON attendance_records(courier_id, date);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courier_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('master_admin', 'admin', 'pic')
    )
  );

CREATE POLICY "Admins can insert profiles" ON profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('master_admin', 'admin')
    )
  );

CREATE POLICY "Admins can update profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('master_admin', 'admin')
    )
  );

-- Create RLS policies for courier_profiles
CREATE POLICY "Couriers can view their own profile" ON courier_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Couriers can update their own profile" ON courier_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all courier profiles" ON courier_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('master_admin', 'admin', 'pic')
    )
  );

-- Create RLS policies for daily_packages
CREATE POLICY "Couriers can manage their own packages" ON daily_packages
  FOR ALL USING (courier_id = auth.uid());

CREATE POLICY "Admins can view all packages" ON daily_packages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('master_admin', 'admin', 'pic')
    )
  );

-- Create RLS policies for daily_summaries
CREATE POLICY "Couriers can view their own summaries" ON daily_summaries
  FOR SELECT USING (courier_id = auth.uid());

CREATE POLICY "System can insert summaries" ON daily_summaries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update summaries" ON daily_summaries
  FOR UPDATE USING (true);

CREATE POLICY "Admins can view all summaries" ON daily_summaries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('master_admin', 'admin', 'pic')
    )
  );

-- Create RLS policies for attendance_records
CREATE POLICY "Couriers can manage their own attendance" ON attendance_records
  FOR ALL USING (courier_id = auth.uid());

CREATE POLICY "Admins can view all attendance" ON attendance_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('master_admin', 'admin', 'pic')
    )
  );

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'kurir')::user_role
  );
  
  -- If role is kurir, also create courier_profile
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'kurir') = 'kurir' THEN
    INSERT INTO public.courier_profiles (id, employee_id, area)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'employee_id', 'EMP' || EXTRACT(EPOCH FROM NOW())::TEXT),
      COALESCE(NEW.raw_user_meta_data->>'area', 'Default Area')
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courier_profiles_updated_at
  BEFORE UPDATE ON courier_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_packages_updated_at
  BEFORE UPDATE ON daily_packages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_summaries_updated_at
  BEFORE UPDATE ON daily_summaries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attendance_records_updated_at
  BEFORE UPDATE ON attendance_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();