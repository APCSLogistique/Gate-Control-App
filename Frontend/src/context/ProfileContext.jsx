import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ProfileContext = createContext(null);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const { user } = useAuth();

  // Générer l'URL de l'avatar par défaut basé sur le nom
  const getDefaultAvatar = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&size=200&background=0B5394&color=fff`;
  };

  // État pour la photo de profil
  const [profileImage, setProfileImage] = useState(() => {
    // Essayer de récupérer depuis localStorage
    const stored = localStorage.getItem('profile_image');
    return stored || getDefaultAvatar(user?.name);
  });

  // Mettre à jour l'avatar quand l'utilisateur change
  useEffect(() => {
    if (user?.name) {
      const stored = localStorage.getItem('profile_image');
      if (!stored) {
        setProfileImage(getDefaultAvatar(user.name));
      }
    }
  }, [user?.name]);

  // Mettre à jour la photo de profil
  const updateProfileImage = (newImage) => {
    setProfileImage(newImage);
    localStorage.setItem('profile_image', newImage);
  };

  const value = {
    profileImage,
    updateProfileImage,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};
