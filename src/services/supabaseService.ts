// src/services/supabaseService.ts
import { supabase } from '../firebase';

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
