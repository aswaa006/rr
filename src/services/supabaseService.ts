// src/services/supabaseService.ts
import { supabase } from '../firebase';
import bcrypt from 'bcryptjs';

// Initialize storage setup
export const initializeStorage = async (): Promise<boolean> => {
  try {
    console.log("Initializing Supabase Storage...");
    
    // Test Supabase connection first
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log("Supabase auth status:", user ? "authenticated" : "anonymous", authError);
    
    // Check if we can access storage
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    console.log("Available buckets:", buckets, bucketsError);
    
    // Check if driver-documents bucket is accessible
    const driverBucketReady = await ensureStorageBucket('driver-documents');
    
    if (!driverBucketReady) {
      console.error("Failed to initialize driver documents bucket");
      console.log("Please ensure the bucket 'driver-documents' exists in your Supabase project");
      console.log("You can create it manually in the Supabase dashboard or run the storage_setup.sql script");
      return false;
    }

    // Set up bucket policies for public access
    await setupStoragePolicies();
    
    console.log("Storage initialization completed successfully");
    return true;
  } catch (error) {
    console.error("Error initializing storage:", error);
    console.log("Make sure your Supabase project is active and the anon key is correct");
    return false;
  }
};

// Set up storage policies for public access
const setupStoragePolicies = async (): Promise<void> => {
  try {
    // Note: Storage policies are typically set up via SQL in Supabase dashboard
    // This is a placeholder for any client-side policy setup if needed
    console.log("Storage policies should be configured in Supabase dashboard");
  } catch (error) {
    console.error("Error setting up storage policies:", error);
  }
};

// Types for driver registration
export interface DriverRegistrationData {
  name: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  licenseFile: File;
  agreed: boolean;
}

export interface DriverDocument extends Omit<DriverRegistrationData, 'licenseFile'> {
  id?: string;
  licenseFileUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  updatedAt: string;
}

// Check if storage bucket exists and is accessible
export const checkStorageBucket = async (bucketName: string): Promise<boolean> => {
  try {
    // Try to list files in the bucket to check if it exists and is accessible
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list('', { limit: 1 });

    if (error) {
      console.error(`Error accessing bucket '${bucketName}':`, error);
      return false;
    }

    console.log(`Bucket '${bucketName}' is accessible`);
    return true;
  } catch (error) {
    console.error(`Error checking bucket '${bucketName}':`, error);
    return false;
  }
};

// Create storage bucket if it doesn't exist (requires admin privileges)
export const ensureStorageBucket = async (bucketName: string): Promise<boolean> => {
  try {
    // First check if bucket is accessible
    const isAccessible = await checkStorageBucket(bucketName);
    if (isAccessible) {
      return true;
    }

    // If not accessible, try to create it (this might fail with anon key)
    console.log(`Attempting to create bucket '${bucketName}'...`);
    const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
      fileSizeLimit: 5242880 // 5MB in bytes
    });

    if (createError) {
      console.error("Error creating bucket:", createError);
      // If creation fails, it might be because bucket already exists or no admin privileges
      // Try to check again
      return await checkStorageBucket(bucketName);
    }

    console.log(`Bucket '${bucketName}' created successfully`);
    return true;
  } catch (error) {
    console.error("Error ensuring bucket exists:", error);
    // Fallback: just try to check if bucket is accessible
    return await checkStorageBucket(bucketName);
  }
};

// Upload file to Supabase Storage and return download URL
export const uploadFileToStorage = async (
  file: File, 
  path: string,
  bucketName: string = 'driver-documents'
): Promise<string> => {
  try {
    // Ensure bucket exists before uploading
    const bucketReady = await ensureStorageBucket(bucketName);
    if (!bucketReady) {
      throw new Error("Failed to create or access storage bucket");
    }

    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("Upload error:", error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(path);

    console.log("File uploaded successfully:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Generate unique file path for license files
export const generateLicenseFilePath = (phone: string, fileName: string): string => {
  const timestamp = Date.now();
  const sanitizedPhone = phone.replace(/[^0-9]/g, '');
  const fileExtension = fileName.split('.').pop();
  return `licenses/${sanitizedPhone}_${timestamp}.${fileExtension}`;
};

// Save driver registration to Supabase
export const saveDriverRegistration = async (
  data: DriverRegistrationData
): Promise<string> => {
  try {
    // Upload license file first
    const licenseFilePath = generateLicenseFilePath(data.phone, data.licenseFile.name);
    const licenseFileUrl = await uploadFileToStorage(data.licenseFile, licenseFilePath);

    // Prepare document data
    const driverData = {
      name: data.name,
      phone: data.phone,
      vehicle_type: data.vehicleType,
      vehicle_number: data.vehicleNumber,
      agreed: data.agreed,
      license_file_url: licenseFileUrl,
      status: 'pending',
    };

    // Add document to Supabase
    const { data: result, error } = await supabase
      .from('drivers')
      .insert(driverData)
      .select()
      .single();
    
    if (error) throw error;
    
    console.log("Driver registration saved with ID:", result.id);
    return result.id;
  } catch (error) {
    console.error("Error saving driver registration:", error);
    throw new Error(`Failed to save registration: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Complete driver registration process
export const submitDriverRegistration = async (
  data: DriverRegistrationData
): Promise<{ success: boolean; documentId?: string; error?: string }> => {
  try {
    // Validate required fields
    if (!data.name || !data.phone || !data.vehicleType || !data.vehicleNumber || !data.licenseFile) {
      throw new Error("All fields are required");
    }

    if (!data.agreed) {
      throw new Error("You must agree to the terms and conditions");
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(data.licenseFile.type)) {
      throw new Error("Please upload a valid image (JPEG, PNG) or PDF file");
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (data.licenseFile.size > maxSize) {
      throw new Error("File size must be less than 5MB");
    }

    // Save registration
    const documentId = await saveDriverRegistration(data);
    
    return {
      success: true,
      documentId,
    };
  } catch (error) {
    console.error("Driver registration error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

// Get driver registration by ID
export const getDriverRegistration = async (id: string): Promise<DriverDocument | null> => {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting driver registration:", error);
    return null;
  }
};

// Get all driver applications (for admin)
export const getAllDriverApplications = async (): Promise<DriverDocument[]> => {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error getting driver applications:", error);
    return [];
  }
};

// Update driver application status (for admin)
export const updateDriverApplicationStatus = async (
  id: string, 
  status: 'approved' | 'rejected'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('drivers')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating driver status:", error);
    return false;
  }
};

// Create a new ride booking
export const createRideBooking = async (rideData: {
  studentId: string;
  pickupLocation: string;
  dropLocation: string;
  scheduledTime: string;
  fare: number;
  isPreBooking: boolean;
}): Promise<{ success: boolean; rideId?: string; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('rides')
      .insert({
        student_id: rideData.studentId,
        pickup_location: rideData.pickupLocation,
        drop_location: rideData.dropLocation,
        scheduled_time: rideData.scheduledTime,
        fare: rideData.fare,
        is_pre_booking: rideData.isPreBooking,
        status: 'requested'
      })
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      rideId: data.id,
    };
  } catch (error) {
    console.error("Error creating ride booking:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create ride booking',
    };
  }
};

// Get user's ride history
export const getUserRideHistory = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('rides')
      .select(`
        *,
        drivers (
          name,
          phone,
          vehicle_type,
          vehicle_number
        )
      `)
      .eq('student_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error getting ride history:", error);
    return [];
  }
};

// Submit feedback
export const submitFeedback = async (feedbackData: {
  userId: string;
  rideId?: string;
  name: string;
  email: string;
  rating: number;
  message: string;
}): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('feedback')
      .insert({
        user_id: feedbackData.userId,
        ride_id: feedbackData.rideId,
        name: feedbackData.name,
        email: feedbackData.email,
        rating: feedbackData.rating,
        message: feedbackData.message
      });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit feedback',
    };
  }
};

// Get available drivers
export const getAvailableDrivers = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .select(`
        *,
        users (
          name,
          photo_url
        )
      `)
      .eq('status', 'approved')
      .eq('is_online', true);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error getting available drivers:", error);
    return [];
  }
};

// ============================
// Students auth (custom table)
// ============================

export interface Student {
  id: string;
  full_name: string;
  email: string;
}

export interface StudentSignupInput {
  fullName: string;
  email: string;
  password: string;
}

export interface StudentLoginResult {
  success: boolean;
  student?: Student;
  accessToken?: string | null;
  error?: string;
}

// Create a student account:
// - Hashes password (bcrypt) and inserts row in students
// - Creates Supabase Auth user with the same credentials to obtain a JWT for RLS
export const studentSignUp = async (
  input: StudentSignupInput
): Promise<StudentLoginResult> => {
  try {
    const email = input.email.trim().toLowerCase();

    // Check if email already exists in table
    const { data: existing, error: existingErr } = await supabase
      .from('students')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingErr) {
      throw existingErr;
    }
    if (existing) {
      return { success: false, error: 'Email already exists' };
    }

    // Create Supabase Auth user to enable RLS using JWT claims
    const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
      email,
      password: input.password,
      options: { emailRedirectTo: window.location.origin }
    });
    if (signUpErr) {
      return { success: false, error: signUpErr.message };
    }

    const authUserId = signUpData.user?.id;
    if (!authUserId) {
      return { success: false, error: 'Failed to create auth user' };
    }

    // Ensure we have a session (some projects require email confirmation and won't auto-sign in)
    // Try to sign in immediately to obtain a JWT for RLS policies
    const { error: signinErr } = await supabase.auth.signInWithPassword({ email, password: input.password });
    if (signinErr) {
      // If sign in fails here, RLS inserts will fail because auth.uid() is not present
      return { success: false, error: `Sign in required before creating profile: ${signinErr.message}` };
    }

    // Preflight: ensure API sees the students table (helps diagnose schema cache or wrong project)
    const { error: preflightErr } = await supabase
      .from('students')
      .select('id')
      .limit(1);
    if (preflightErr) {
      const msg = preflightErr.message || '';
      if (msg.toLowerCase().includes('relation') && msg.toLowerCase().includes('does not exist')) {
        return { success: false, error: 'Table public.students not found by API. Create table and reload schema in Supabase, or check project URL/key.' };
      }
      if (msg.toLowerCase().includes('schema') && msg.toLowerCase().includes('cache')) {
        return { success: false, error: 'API schema cache stale. Run: select pg_notify(\'pgrst\', \"reload schema\"); in Supabase SQL.' };
      }
      return { success: false, error: `Preflight failed: ${msg}` };
    }

    // Hash password for storage in students table
    const passwordHash = await bcrypt.hash(input.password, 10);

    // Insert into students table; use same id as auth user
    const { data: studentRow, error: insertErr } = await supabase
      .from('students')
      .insert({
        id: authUserId,
        full_name: input.fullName,
        email,
        password_hash: passwordHash
      })
      .select('id, full_name, email')
      .single();

    if (insertErr) {
      // Gracefully report duplicate email and permission issues
      const msg = insertErr.message || 'Failed to create student';
      if (msg.toLowerCase().includes('duplicate') || msg.includes('23505')) {
        return { success: false, error: 'Email already exists' };
      }
      if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('rls')) {
        return { success: false, error: 'Permission denied. Ensure you are signed in before creating profile.' };
      }
      return { success: false, error: msg };
    }

    // Get session token if available
    const {
      data: { session }
    } = await supabase.auth.getSession();

    return {
      success: true,
      student: {
        id: studentRow.id,
        full_name: studentRow.full_name,
        email: studentRow.email
      },
      accessToken: session?.access_token ?? null
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Signup failed' };
  }
};

// Login a student using custom table verification (bcrypt) and ensure Supabase Auth session
export const studentLogin = async (
  emailInput: string,
  password: string
): Promise<StudentLoginResult> => {
  try {
    const email = emailInput.trim().toLowerCase();

    // Fetch student by email
    const { data: student, error } = await supabase
      .from('students')
      .select('id, full_name, email, password_hash')
      .eq('email', email)
      .single();

    if (error || !student) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Verify password
    const isValid = await bcrypt.compare(password, student.password_hash);
    if (!isValid) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Ensure an auth session exists for RLS (password must match supabase auth password set at signup)
    const { error: authErr } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (authErr) {
      return { success: false, error: authErr.message };
    }

    const {
      data: { session }
    } = await supabase.auth.getSession();

    return {
      success: true,
      student: {
        id: student.id,
        full_name: student.full_name,
        email: student.email
      },
      accessToken: session?.access_token ?? null
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Login failed' };
  }
};

export const getStudentById = async (id: string): Promise<Student | null> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('id, full_name, email')
      .eq('id', id)
      .single();
    if (error) return null;
    return data as Student;
  } catch {
    return null;
  }
};

// Update driver online status
export const updateDriverOnlineStatus = async (
  driverId: string, 
  isOnline: boolean
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('drivers')
      .update({ 
        is_online: isOnline,
        updated_at: new Date().toISOString()
      })
      .eq('id', driverId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating driver online status:", error);
    return false;
  }
};
