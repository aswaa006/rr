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

const API_BASE_URL = 'http://localhost:4000/api';

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
    console.error('Error updating ride status:', error);
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
    return [];
  }
};
