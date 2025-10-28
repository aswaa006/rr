// Ride service for handling ride-related API calls

export interface RideRequest {
  id: string;
  studentName: string;
  studentPhone: string;
  fromLocation: string;
  toLocation: string;
  gender: string;
  driverPreference: 'M' | 'F' | 'Any';
  fare: number;
  requestedAt: string;
  expiresAt: string;
  timeRemaining: number;
}

export interface CurrentRide {
  id: string;
  studentName: string;
  studentPhone: string;
  fromLocation: string;
  toLocation: string;
  otp: string;
  status: 'accepted' | 'otp_verified' | 'in_progress' | 'completed';
  acceptedAt: string;
  otpVerifiedAt?: string;
  rideStartedAt?: string;
  rideEndedAt?: string;
}

export interface DriverStats {
  totalRides: number;
  totalEarnings: number;
  completedRides: number;
}

export interface RideHistory {
  id: string;
  driverName: string;
  driverNthRide: number;
  passengerName: string;
  from: string;
  to: string;
  paymentSuccessTime: string;
  rideStartTime: string;
  rideEndTime: string;
  fare: number;
  isPreBooking: boolean;
  status: string;
  date: string;
}

export interface DriverDetails {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleType: string;
  vehicleNumber: string;
  status: string;
  totalRides: number;
  totalEarnings: number;
  isOnline: boolean;
  joinedAt: string;
  lastRideAt?: string;
  averageRating: number;
}

export interface BookingDetails {
  pickup: string;
  drop: string;
  selectedTime: string;
  gender: string;
  driverPreference: string;
  fare: number;
  availableDrivers: number;
}

const API_BASE_URL = 'http://localhost:4000/api';

// Mock data for development
const MOCK_DRIVERS: DriverDetails[] = [
  {
    id: '1',
    name: 'Raj Kumar',
    phone: '9876543210',
    email: 'raj@example.com',
    vehicleType: 'Bike',
    vehicleNumber: 'HR-26-AX-1234',
    status: 'approved',
    totalRides: 45,
    totalEarnings: 1350,
    isOnline: true,
    joinedAt: '2024-01-15',
    lastRideAt: '2024-10-27',
    averageRating: 4.5
  },
  {
    id: '2',
    name: 'Priya Sharma',
    phone: '9876543211',
    email: 'priya@example.com',
    vehicleType: 'Scooter',
    vehicleNumber: 'HR-26-BY-5678',
    status: 'approved',
    totalRides: 32,
    totalEarnings: 960,
    isOnline: true,
    joinedAt: '2024-02-20',
    lastRideAt: '2024-10-27',
    averageRating: 4.8
  },
  {
    id: '3',
    name: 'Amit Singh',
    phone: '9876543212',
    email: 'amit@example.com',
    vehicleType: 'Bike',
    vehicleNumber: 'HR-26-CZ-9012',
    status: 'approved',
    totalRides: 28,
    totalEarnings: 840,
    isOnline: false,
    joinedAt: '2024-03-10',
    lastRideAt: '2024-10-26',
    averageRating: 4.2
  }
];

// Check driver availability
export const checkAvailability = async (bookingDetails: BookingDetails): Promise<{ available: boolean; count: number; drivers: DriverDetails[] }> => {
  try {
    // Try to fetch from API first
    const response = await fetch(`${API_BASE_URL}/rides/drivers`);
    if (response.ok) {
      const drivers = await response.json();
      const onlineDrivers = drivers.filter((driver: DriverDetails) => driver.isOnline);
      
      // Filter by driver preference if specified
      let availableCount = onlineDrivers.length;
      if (bookingDetails.driverPreference && bookingDetails.driverPreference !== "Any") {
        availableCount = onlineDrivers.filter((driver: DriverDetails) => 
          driver.gender === bookingDetails.driverPreference || bookingDetails.driverPreference === "Any"
        ).length;
      }
      
      return {
        available: availableCount > 0,
        count: availableCount,
        drivers: onlineDrivers
      };
    }
  } catch (error) {
    console.warn('API not available, using mock data:', error);
  }
  
  // Fallback to mock data
  const onlineDrivers = MOCK_DRIVERS.filter(driver => driver.isOnline);
  let availableCount = onlineDrivers.length;
  
  if (bookingDetails.driverPreference && bookingDetails.driverPreference !== "Any") {
    availableCount = onlineDrivers.filter(driver => 
      driver.gender === bookingDetails.driverPreference || bookingDetails.driverPreference === "Any"
    ).length;
  }
  
  return {
    available: availableCount > 0,
    count: availableCount,
    drivers: onlineDrivers
  };
};

// Book a ride
export const bookRide = async (bookingDetails: BookingDetails): Promise<{ success: boolean; rideId?: string; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/rides/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pickup: bookingDetails.pickup,
        drop: bookingDetails.drop,
        scheduledTime: bookingDetails.selectedTime,
        gender: bookingDetails.gender,
        driverPreference: bookingDetails.driverPreference,
        fare: bookingDetails.fare
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, rideId: data.rideId };
    } else {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to book ride' };
    }
  } catch (error) {
    console.warn('API not available, using mock booking:', error);
    
    // Mock booking for development
    const mockRideId = `ride_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { success: true, rideId: mockRideId };
  }
};

// Update ride status
export const updateRideStatus = async (rideId: string, status: string, otp?: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/rides/${rideId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, otp }),
    });
    return response.ok;
  } catch (error) {
    console.warn('API not available, using mock update:', error);
    // Mock success for development
    return true;
  }
};

// Get ride details
export const getRideDetails = async (rideId: string): Promise<CurrentRide | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/rides/${rideId}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('API not available, using mock ride details:', error);
  }
  
  // Mock ride details for development
  return {
    id: rideId,
    studentName: 'Demo User',
    studentPhone: '9876543210',
    fromLocation: 'Gate 1',
    toLocation: 'Library',
    otp: '1234',
    status: 'accepted',
    acceptedAt: new Date().toISOString(),
    otpVerifiedAt: new Date().toISOString(),
    rideStartedAt: new Date().toISOString(),
    rideEndedAt: new Date().toISOString()
  };
};

// Get available ride requests for drivers
export const getRideRequests = async (): Promise<RideRequest[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/rides/requests`);
    if (!response.ok) {
      throw new Error('Failed to fetch ride requests');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching ride requests:', error);
    return [];
  }
};

// Accept a ride request
export const acceptRide = async (rideId: string, driverId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/rides/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rideId, driverId }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error accepting ride:', error);
    return false;
  }
};

// Decline a ride request
export const declineRide = async (rideId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/rides/decline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rideId }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error declining ride:', error);
    return false;
  }
};

// Get driver's current ride
export const getCurrentRide = async (driverId: string): Promise<CurrentRide | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/rides/driver/${driverId}/current`);
    if (!response.ok) {
      throw new Error('Failed to fetch current ride');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching current ride:', error);
    return null;
  }
};

// Get driver statistics
export const getDriverStats = async (driverId: string): Promise<DriverStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/rides/driver/${driverId}/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch driver stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching driver stats:', error);
    return { totalRides: 0, totalEarnings: 0, completedRides: 0 };
  }
};

// Update driver online status
export const updateDriverStatus = async (driverId: string, isOnline: boolean): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/rides/driver/${driverId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isOnline }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error updating driver status:', error);
    return false;
  }
};

// Get all ride history for admin
export const getRideHistory = async (type?: 'prebook' | 'normal', date?: string): Promise<RideHistory[]> => {
  try {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (date) params.append('date', date);
    
    const response = await fetch(`${API_BASE_URL}/rides/history?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch ride history');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching ride history:', error);
    return [];
  }
};

// Get all drivers with their details
export const getDriverDetails = async (): Promise<DriverDetails[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/rides/drivers`);
    if (!response.ok) {
      throw new Error('Failed to fetch driver details');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching driver details:', error);
    return MOCK_DRIVERS;
  }
};
