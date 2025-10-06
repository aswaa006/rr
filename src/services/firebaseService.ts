// src/services/firebaseService.ts
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  DocumentData 
} from "firebase/firestore";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  UploadResult 
} from "firebase/storage";
import { db, storage } from "../firebase";

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
  submittedAt: any; // Firestore timestamp
  updatedAt: any; // Firestore timestamp
}

// Upload file to Firebase Storage and return download URL
export const uploadFileToStorage = async (
  file: File, 
  path: string
): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const uploadResult: UploadResult = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(uploadResult.ref);
    return downloadURL;
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
  return `drivers/licenses/${sanitizedPhone}_${timestamp}.${fileExtension}`;
};

// Save driver registration to Firestore
export const saveDriverRegistration = async (
  data: DriverRegistrationData
): Promise<string> => {
  try {
    // Upload license file first
    const licenseFilePath = generateLicenseFilePath(data.phone, data.licenseFile.name);
    const licenseFileUrl = await uploadFileToStorage(data.licenseFile, licenseFilePath);

    // Prepare document data
    const driverData: Omit<DriverDocument, 'id'> = {
      name: data.name,
      phone: data.phone,
      vehicleType: data.vehicleType,
      vehicleNumber: data.vehicleNumber,
      agreed: data.agreed,
      licenseFileUrl,
      status: 'pending',
      submittedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Add document to Firestore
    const docRef = await addDoc(collection(db, "drivers"), driverData);
    
    console.log("Driver registration saved with ID:", docRef.id);
    return docRef.id;
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

// Get driver registration by ID (for future use)
export const getDriverRegistration = async (id: string): Promise<DriverDocument | null> => {
  try {
    // This would require additional Firestore imports and implementation
    // For now, we'll just return null as it's not needed for the current task
    console.log("getDriverRegistration not implemented yet");
    return null;
  } catch (error) {
    console.error("Error getting driver registration:", error);
    return null;
  }
};
