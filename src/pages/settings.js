import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../static/profileSettings.css';

const ProfileSettings = () => {
    const id = 1;
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isChanged, setIsChanged] = useState(false);
    const [settings, setSettings] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        bio: '',
        notificationsEnabled: true,
        darkMode: false
    });

    useEffect(() => {
        if (!id) {
            setError('Profile ID is missing');
            setLoading(false);
            return;
        }

        const mockProfileData = {
            id: id,
            username: `user${id}`,
            email: `user${id}@example.com`,
            createdAt: '2023-01-15T08:20:00Z'
        };

        // Simulate API call with timeout
        const timer = setTimeout(() => {
            setProfileData(mockProfileData);
            setSettings({
                username: mockProfileData.username,
                email: mockProfileData.email,
                firstName: mockProfileData.firstName,
                lastName: mockProfileData.lastName,
                bio: mockProfileData.bio,
                notificationsEnabled: mockProfileData.notificationsEnabled,
                darkMode: mockProfileData.darkMode
            });
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [id]);

    const handleSettingsChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setIsChanged(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setIsChanged(false);
            alert('Profile updated successfully');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCancel = () => {
        if (profileData) {
            setSettings({
                username: profileData.username,
                email: profileData.email,
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                bio: profileData.bio,
                notificationsEnabled: profileData.notificationsEnabled,
                darkMode: profileData.darkMode
            });
            setIsChanged(false);
            setError(null);
        }
    };

    if (loading) {
        return <div className="profile-settings">Loading...</div>;
    }

    if (error) {
        return <div className="profile-settings">Error: {error}</div>;
    }

    return (
        <div className="profile-settings">

            <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-group-profile">
                    <label>Username</label>
                    <input 
                        type="text" 
                        name="username"
                        value={settings.username}
                        onChange={handleSettingsChange}
                        disabled
                    />
                </div>

                <div className="form-group-profile">
                    <label>Email</label>
                    <input 
                        type="email" 
                        name="email"
                        value={settings.email}
                        onChange={handleSettingsChange}
                    />
                </div>

                <div className="form-actions">
                    <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={handleCancel}
                        disabled={!isChanged}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={!isChanged}
                    >
                        Save Changes
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}
            </form>
        </div>
    );
};

export default ProfileSettings;