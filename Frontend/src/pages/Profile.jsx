import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Edit2,
  Key,
  Shield,
  CheckCircle,
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { profileImage, updateProfileImage } = useProfile();

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);

  // Profile data state
  const [profileData, setProfileData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@apcs.com',
    phone: '+213 555 123 456',
    address: 'Algiers, Algeria',
    company: user?.role === 'carrier' ? 'Transport Co.' : 'APCS Terminal',
    position: user?.role === 'admin' ? 'System Administrator' : user?.role === 'operator' ? 'Terminal Operator' : 'Logistics Manager',
    joinDate: '2024-01-15',
  });

  // Photo preview state
  const [previewImage, setPreviewImage] = useState(profileImage);

  // Handle photo change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form changes
  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save changes
  const handleSave = () => {
    // TODO: API call to save profile

    // Update profile image globally
    updateProfileImage(previewImage);

    alert('Profile updated successfully!');
    setIsEditing(false);
  };

  // Cancel changes
  const handleCancel = () => {
    setPreviewImage(profileImage);
    setIsEditing(false);
  };

  // Get role badge
  const getRoleBadge = () => {
    switch (user?.role) {
      case 'admin':
        return { label: 'Administrator', color: 'bg-purple-100 text-purple-800 border-purple-300' };
      case 'operator':
        return { label: 'Operator', color: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'carrier':
        return { label: 'Carrier', color: 'bg-green-100 text-green-800 border-green-300' };
      default:
        return { label: 'User', color: 'bg-gray-100 text-gray-800 border-gray-300' };
    }
  };

  const roleBadge = getRoleBadge();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-deep-ocean flex items-center gap-3">
            <User size={32} />
            My Profile
          </h1>
          <p className="text-gray-500 mt-1">Manage your personal information</p>
        </div>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="btn-primary flex items-center gap-2">
            <Edit2 size={18} />
            Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={handleCancel} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleSave} className="btn-primary flex items-center gap-2">
              <Save size={18} />
              Save
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Photo and Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Photo */}
          <div className="card">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <img
                  src={previewImage}
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover border-4 border-apcs-blue shadow-lg"
                />
                {isEditing && (
                  <label
                    htmlFor="profile-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Camera size={32} className="text-white" />
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <h2 className="text-2xl font-bold text-deep-ocean mt-4">{profileData.name}</h2>
              <p className="text-gray-600">{profileData.position}</p>

              {/* Role Badge */}
              <div className={`mt-3 px-4 py-2 rounded-full border-2 font-semibold ${roleBadge.color}`}>
                <div className="flex items-center gap-2">
                  <Shield size={16} />
                  {roleBadge.label}
                </div>
              </div>

              {/* Status */}
              <div className="mt-4 flex items-center gap-2 text-status-success">
                <CheckCircle size={18} />
                <span className="text-sm font-medium">Active Account</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="card">
            <h3 className="text-xl font-bold text-deep-ocean mb-4 flex items-center gap-2">
              <User size={22} />
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-apcs-blue ${
                      isEditing ? 'bg-white' : 'bg-gray-50'
                    }`}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-apcs-blue ${
                      isEditing ? 'bg-white' : 'bg-gray-50'
                    }`}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-apcs-blue ${
                      isEditing ? 'bg-white' : 'bg-gray-50'
                    }`}
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-apcs-blue ${
                      isEditing ? 'bg-white' : 'bg-gray-50'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="card">
            <h3 className="text-xl font-bold text-deep-ocean mb-4 flex items-center gap-2">
              <Key size={22} />
              Security
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-800">Password</p>
                  <p className="text-sm text-gray-600">Last changed 30 days ago</p>
                </div>
                <button className="btn-secondary text-sm">
                  Change Password
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-800">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600">Secure your account with 2FA</p>
                </div>
                <button className="btn-secondary text-sm">
                  Enable
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
