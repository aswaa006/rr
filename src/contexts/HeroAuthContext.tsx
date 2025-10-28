import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Hero {
  id: string;
  name: string;
  email: string;
  phone?: string;
  licenseNumber?: string;
  vehicleNumber?: string;
  rating?: number;
  totalRides?: number;
  isOnline?: boolean;
  token?: string | null;
  verified?: boolean;
}

interface HeroAuthContextType {
  hero: Hero | null;
  login: (heroData: Hero) => void;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: () => boolean;
  getCurrentHero: () => Hero | null;
  updateHero: (updates: Partial<Hero>) => void;
}

const HeroAuthContext = createContext<HeroAuthContextType | undefined>(undefined);

export const useHeroAuth = () => {
  const context = useContext(HeroAuthContext);
  if (context === undefined) {
    throw new Error('useHeroAuth must be used within a HeroAuthProvider');
  }
  return context;
};

interface HeroAuthProviderProps {
  children: ReactNode;
}

export const HeroAuthProvider: React.FC<HeroAuthProviderProps> = ({ children }) => {
  const [hero, setHero] = useState<Hero | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const heroData = localStorage.getItem('hero');
    const token = localStorage.getItem('heroToken');

    if (heroData && token) {
      try {
        const parsedHero = JSON.parse(heroData);
        if (parsedHero.token === token) {
          setHero(parsedHero);
        } else {
          localStorage.removeItem('hero');
          localStorage.removeItem('heroToken');
        }
      } catch (error) {
        console.error('Error parsing hero data from localStorage:', error);
        localStorage.removeItem('hero');
        localStorage.removeItem('heroToken');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (heroData: Hero) => {
    const token = heroData.token || `hero_jwt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const heroWithToken = { ...heroData, token };

    setHero(heroWithToken);
    localStorage.setItem('hero', JSON.stringify(heroWithToken));
    localStorage.setItem('heroToken', token);
  };

  const logout = () => {
    setHero(null);
    localStorage.removeItem('hero');
    localStorage.removeItem('heroToken');
  };

  const isAuthenticated = (): boolean => {
    return hero !== null && hero.token !== null;
  };

  const getCurrentHero = (): Hero | null => {
    return hero;
  };

  const updateHero = (updates: Partial<Hero>) => {
    if (hero) {
      const updatedHero = { ...hero, ...updates };
      setHero(updatedHero);
      localStorage.setItem('hero', JSON.stringify(updatedHero));
    }
  };

  const value: HeroAuthContextType = {
    hero,
    login,
    logout,
    isLoading,
    isAuthenticated,
    getCurrentHero,
    updateHero,
  };

  return (
    <HeroAuthContext.Provider value={value}>
      {children}
    </HeroAuthContext.Provider>
  );
};
