import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const PROFILE_OBJECT_KEYS = [
  'alfabetrix_profile',
  'alfabetrixProfile',
  'currentProfile',
  'selectedProfile',
  'userProfile',
  'profile',
];

const PROFILE_ID_KEYS = [
  'alfabetrix_profile_id',
  'profile_id',
  'profileId',
  'user_profile_id',
  'userProfileId',
  'selectedProfileId',
];

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost/alfabetrix/api/v1';

function safeJsonParse(value) {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function normalizeProfile(profile) {
  if (!profile || typeof profile !== 'object') return null;

  const id =
    profile.id ??
    profile.user_profile_id ??
    profile.profile_id ??
    profile.userProfileId ??
    null;

  return {
    ...profile,
    id,
    user_profile_id: profile.user_profile_id ?? id,
    name: profile.name || profile.full_name || profile.username || 'Estudiante',
    role: profile.role || 'student',
  };
}

function getStoredProfile() {
  for (const key of PROFILE_OBJECT_KEYS) {
    const profile = normalizeProfile(safeJsonParse(localStorage.getItem(key)));
    if (profile) return profile;
  }

  for (const key of PROFILE_ID_KEYS) {
    const value = localStorage.getItem(key);
    if (value) {
      return normalizeProfile({
        id: value,
        user_profile_id: value,
        name: 'Estudiante',
      });
    }
  }

  return null;
}

function clearStoredProfile() {
  [...PROFILE_OBJECT_KEYS, ...PROFILE_ID_KEYS].forEach((key) => {
    localStorage.removeItem(key);
  });
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const appPublicSettings = useMemo(
    () => ({
      mode: 'local',
      apiBaseUrl: API_BASE_URL,
      provider: 'mysql_php_api',
    }),
    []
  );

  useEffect(() => {
    checkAppState();

    const handleStorageChange = () => {
      checkUserAuth();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const checkAppState = async () => {
    setIsLoadingPublicSettings(false);
    await checkUserAuth();
  };

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      setAuthError(null);

      const storedProfile = getStoredProfile();

      if (storedProfile) {
        setUser(storedProfile);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error revisando el perfil local:', error);
      setUser(null);
      setIsAuthenticated(false);
      setAuthError({
        type: 'local_profile_error',
        message: error.message || 'No se pudo revisar el perfil local.',
      });
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  const setLocalUser = (profile) => {
    const normalizedProfile = normalizeProfile(profile);

    if (!normalizedProfile) {
      setUser(null);
      setIsAuthenticated(false);
      return;
    }

    localStorage.setItem('alfabetrix_profile', JSON.stringify(normalizedProfile));
    localStorage.setItem('alfabetrix_profile_id', String(normalizedProfile.id));
    setUser(normalizedProfile);
    setIsAuthenticated(true);
  };

  const logout = (shouldRedirect = true) => {
    clearStoredProfile();
    setUser(null);
    setIsAuthenticated(false);

    if (shouldRedirect) {
      window.location.href = '/';
    }
  };

  const navigateToLogin = () => {
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        authChecked,
        logout,
        navigateToLogin,
        checkUserAuth,
        checkAppState,
        setLocalUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
