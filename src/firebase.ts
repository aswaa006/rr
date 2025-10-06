// src/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gzwztlnwiyaeqqpamkde.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6d3p0bG53aXlhZXFxcGFta2RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3MjYxODEsImV4cCI6MjA3NTMwMjE4MX0.25jJKzcn1FU4rkI93183dtyPjr0D126ej-B4OYRSJu8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For backward compatibility, export as auth and db
export const auth = supabase.auth;
export const db = supabase;

export const loginWithGoogle = async (role: "user" | "driver") => {
  try {
    console.log("Starting Google authentication...");
    const { data, error } = await auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/book-ride`
      }
    });

    if (error) throw error;

    // Get user data after successful authentication
    const { data: { user } } = await auth.getUser();
    
    if (user) {
      const userData = { 
        email: user.email, 
        name: user.user_metadata?.full_name || user.email?.split('@')[0], 
        photo: user.user_metadata?.avatar_url, 
        role 
      };

      // Save or update user in database
      const { error: upsertError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          name: userData.name,
          photo_url: userData.photo,
          role: role === 'driver' ? 'driver' : 'student'
        });

      if (upsertError) {
        console.error("Error saving user to database:", upsertError);
      }

      localStorage.setItem("user", JSON.stringify(userData));
      console.log("User data saved to localStorage");
    }
  } catch (err: any) {
    console.error("Google Auth Error:", err);
    
    // Show specific error messages
    if (err.message?.includes('popup_closed_by_user')) {
      alert('Sign-in was cancelled. Please try again.');
    } else if (err.message?.includes('popup_blocked')) {
      alert('Popup was blocked by browser. Please allow popups and try again.');
    } else {
      alert(`Authentication failed: ${err.message || 'Unknown error'}`);
    }
  }
};

export const logout = async () => {
  await auth.signOut();
  localStorage.removeItem("user");
  window.location.href = "/";
};
