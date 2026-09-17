import { UserProfile } from '../types';

const PROFILES_KEY = 'fitbod_user_profiles';
const ACTIVE_PROFILE_KEY = 'fitbod_active_profile_id';

export const DEFAULT_PROFILES: UserProfile[] = [
  {
    id: 'default',
    name: 'Sếp (Chính)',
    avatarColor: '#2563eb',
    isMain: true,
    createdAt: new Date().toISOString()
  }
];

export const getProfiles = (): UserProfile[] => {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (!raw) {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(DEFAULT_PROFILES));
      return DEFAULT_PROFILES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_PROFILES;
  } catch (e) {
    return DEFAULT_PROFILES;
  }
};

export const getActiveProfileId = (): string => {
  return localStorage.getItem(ACTIVE_PROFILE_KEY) || 'default';
};

export const getActiveProfile = (): UserProfile => {
  const profiles = getProfiles();
  const activeId = getActiveProfileId();
  return profiles.find(p => p.id === activeId) || profiles[0] || DEFAULT_PROFILES[0];
};

export const getScopedKey = (baseKey: string, profileId: string = getActiveProfileId()): string => {
  if (profileId === 'default') {
    return baseKey;
  }
  const cleanKey = baseKey.startsWith('fitbod_') ? baseKey.substring(7) : baseKey;
  return 'fitbod_p_' + profileId + '_' + cleanKey;
};

export const getProfileItem = (baseKey: string): string | null => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return null;
  return localStorage.getItem(getScopedKey(baseKey));
};

export const setProfileItem = (baseKey: string, value: string): void => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  localStorage.setItem(getScopedKey(baseKey), value);
};

export const removeProfileItem = (baseKey: string): void => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  localStorage.removeItem(getScopedKey(baseKey));
};

export const createProfile = (name: string, avatarColor?: string): UserProfile => {
  const profiles = getProfiles();
  const newId = 'user_' + Date.now().toString(36);
  const colors = ['#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];
  const chosenColor = avatarColor || colors[profiles.length % colors.length];

  const newProfile: UserProfile = {
    id: newId,
    name: name.trim() || ('Hồ Sơ ' + (profiles.length + 1)),
    avatarColor: chosenColor,
    isMain: false,
    createdAt: new Date().toISOString()
  };

  const updatedProfiles = [...profiles, newProfile];
  localStorage.setItem(PROFILES_KEY, JSON.stringify(updatedProfiles));
  return newProfile;
};

export const switchProfile = (profileId: string): void => {
  localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
  window.location.reload();
};

export const updateProfileName = (profileId: string, newName: string): void => {
  const profiles = getProfiles();
  const updated = profiles.map(p => p.id === profileId ? { ...p, name: newName.trim() || p.name } : p);
  localStorage.setItem(PROFILES_KEY, JSON.stringify(updated));
};

export const deleteProfile = (profileId: string): boolean => {
  if (profileId === 'default') return false;

  const profiles = getProfiles();
  const updated = profiles.filter(p => p.id !== profileId);
  localStorage.setItem(PROFILES_KEY, JSON.stringify(updated));

  const prefix = 'fitbod_p_' + profileId + '_';
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(prefix)) {
      keysToRemove.push(k);
    }
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));

  if (getActiveProfileId() === profileId) {
    localStorage.setItem(ACTIVE_PROFILE_KEY, 'default');
    window.location.reload();
  }
  return true;
};
