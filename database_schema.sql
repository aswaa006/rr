-- Campus Hero Rides Database Schema
-- This file contains all the necessary tables for the campus ride-sharing application

-- 1. Users table for authentication and user management
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  photo_url TEXT,
  role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'driver', 'admin')),
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Drivers table for hero registrations
CREATE TABLE drivers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  vehicle_type VARCHAR(100) NOT NULL,
  vehicle_number VARCHAR(50) NOT NULL,
  license_file_url TEXT,
  agreed BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_online BOOLEAN DEFAULT false,
  total_rides INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Rides table for ride bookings and management
CREATE TABLE rides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  pickup_location VARCHAR(255) NOT NULL,
  drop_location VARCHAR(255) NOT NULL,
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_pickup_time TIMESTAMP WITH TIME ZONE,
  actual_drop_time TIMESTAMP WITH TIME ZONE,
  fare DECIMAL(10,2) NOT NULL,
  is_pre_booking BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'requested' CHECK (status IN ('requested', 'accepted', 'in_progress', 'completed', 'cancelled')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Feedback table for user feedback and ratings
CREATE TABLE feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ride_id UUID REFERENCES rides(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Admin table for admin authentication
CREATE TABLE admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Ride locations table for predefined campus locations
CREATE TABLE ride_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default campus locations
INSERT INTO ride_locations (name, description) VALUES
('Main Gate', 'Main entrance of the campus'),
('Library', 'Central library building'),
('Hostel A', 'Hostel block A'),
('Hostel B', 'Hostel block B'),
('Admin Block', 'Administrative building'),
('Canteen', 'Campus canteen'),
('Sports Complex', 'Sports and recreation center'),
('Academic Block', 'Main academic building'),
('Parking Area', 'Student parking area');

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_drivers_phone ON drivers(phone);
CREATE INDEX idx_drivers_is_online ON drivers(is_online);
CREATE INDEX idx_rides_student_id ON rides(student_id);
CREATE INDEX idx_rides_driver_id ON rides(driver_id);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_rides_scheduled_time ON rides(scheduled_time);
CREATE INDEX idx_feedback_user_id ON feedback(user_id);
CREATE INDEX idx_feedback_ride_id ON feedback(ride_id);
CREATE INDEX idx_ride_locations_name ON ride_locations(name);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_locations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can read their own data
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Anyone can create a user (for registration)
CREATE POLICY "Anyone can create user" ON users FOR INSERT WITH CHECK (true);

-- Drivers can read their own data
CREATE POLICY "Drivers can read own data" ON drivers FOR SELECT USING (auth.uid() = user_id);

-- Drivers can update their own data
CREATE POLICY "Drivers can update own data" ON drivers FOR UPDATE USING (auth.uid() = user_id);

-- Anyone can create a driver application
CREATE POLICY "Anyone can create driver" ON drivers FOR INSERT WITH CHECK (true);

-- Users can read their own rides
CREATE POLICY "Users can read own rides" ON rides FOR SELECT USING (auth.uid() = student_id);

-- Drivers can read rides assigned to them
CREATE POLICY "Drivers can read assigned rides" ON rides FOR SELECT USING (auth.uid() = (SELECT user_id FROM drivers WHERE id = driver_id));

-- Users can create rides
CREATE POLICY "Users can create rides" ON rides FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Users can update their own rides
CREATE POLICY "Users can update own rides" ON rides FOR UPDATE USING (auth.uid() = student_id);

-- Drivers can update rides assigned to them
CREATE POLICY "Drivers can update assigned rides" ON rides FOR UPDATE USING (auth.uid() = (SELECT user_id FROM drivers WHERE id = driver_id));

-- Users can read their own feedback
CREATE POLICY "Users can read own feedback" ON feedback FOR SELECT USING (auth.uid() = user_id);

-- Users can create feedback
CREATE POLICY "Users can create feedback" ON feedback FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Anyone can read ride locations
CREATE POLICY "Anyone can read locations" ON ride_locations FOR SELECT USING (true);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rides_updated_at BEFORE UPDATE ON rides FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
