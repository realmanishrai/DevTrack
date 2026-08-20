import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../components/ui/Avatar/Avatar';
import apiRequest, { getCurrentUser } from '../../api';
import './Profile.css';

const Profile = ({ theme }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setError('');

        const userData = await getCurrentUser();

        setUser(userData);
        setFormData({
          firstname: userData.firstname || '',
          lastname: userData.lastname || '',
          username: userData.username || '',
        });
      } catch (err) {
        console.error('Failed to load profile:', err);

        if (err?.status === 401) {
          navigate('/login', { replace: true });
          return;
        }

        setError(
          err?.message || 'Unable to load your profile. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccessMessage('');
    setError('');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccessMessage('');
  };

  const handleCancel = () => {
    if (!user) return;

    setFormData({
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      username: user.username || '',
    });

    setIsEditing(false);
    setError('');
    setSuccessMessage('');
  };

  const handleSave = async (event) => {
    event.preventDefault();

    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const updatedData = {
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
      };

      const currentUsername = user?.username || '';
      const newUsername = formData.username.trim();

      if (newUsername && newUsername !== currentUsername) {
        updatedData.username = newUsername;
      }

      await apiRequest({
        url: '/me',
        method: 'PUT',
        body: updatedData,
      });

      const refreshedUser = await getCurrentUser();

      setUser(refreshedUser);
      setFormData({
        firstname: refreshedUser.firstname || '',
        lastname: refreshedUser.lastname || '',
        username: refreshedUser.username || '',
      });

      setIsEditing(false);
      setSuccessMessage('Profile updated successfully.');
    } catch (err) {
      console.error('Failed to update profile:', err);

      if (err?.status === 401) {
        navigate('/login');
        return;
      }

      setError(
        err?.data?.detail ||
          err?.message ||
          'Unable to update your profile. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const fullName = user
    ? `${user.firstname || ''} ${user.lastname || ''}`.trim() ||
      user.username ||
      'User'
    : 'User';

  if (isLoading) {
    return (
      <div className="dt-profile-page" data-theme={theme}>
        <div className="dt-profile-page__loading">
          <div className="dt-profile-page__spinner" />
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="dt-profile-page" data-theme={theme}>
        <div className="dt-profile-page__error">
          <h2>Unable to load profile</h2>
          <p>{error}</p>

          <button
            type="button"
            className="dt-profile-page__button dt-profile-page__button--secondary"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dt-profile-page" data-theme={theme}>
      <div className="dt-profile-page__container">
        <div className="dt-profile-page__topbar">
          <button
            type="button"
            className="dt-profile-page__back-button"
            onClick={() => navigate(-1)}
          >
            ← Go Back
          </button>

          <h1 className="dt-profile-page__title">Profile</h1>
        </div>

        <section className="dt-profile-page__card">
          <div className="dt-profile-page__identity">
            <Avatar
              name={fullName}
              size="xl"
              status="online"
            />

            <div className="dt-profile-page__identity-info">
              <h2>{fullName}</h2>
              <p className="dt-profile-page__username">
                @{user.username}
              </p>
              <p className="dt-profile-page__email">
                {user.email}
              </p>
            </div>
          </div>

          <div className="dt-profile-page__divider" />

          <div className="dt-profile-page__section-header">
            <div>
              <h2>Personal Information</h2>
              <p>Manage the information associated with your DevTrack profile.</p>
            </div>

            {!isEditing && (
              <button
                type="button"
                className="dt-profile-page__button dt-profile-page__button--secondary"
                onClick={handleEdit}
              >
                Edit Profile
              </button>
            )}
          </div>

          {error && (
            <div className="dt-profile-page__message dt-profile-page__message--error">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="dt-profile-page__message dt-profile-page__message--success">
              {successMessage}
            </div>
          )}

          <form
            className="dt-profile-page__form"
            onSubmit={handleSave}
          >
            <div className="dt-profile-page__field">
              <label htmlFor="firstname">First Name</label>
              <input
                id="firstname"
                name="firstname"
                type="text"
                value={formData.firstname}
                onChange={handleChange}
                disabled={!isEditing || isSaving}
              />
            </div>

            <div className="dt-profile-page__field">
              <label htmlFor="lastname">Last Name</label>
              <input
                id="lastname"
                name="lastname"
                type="text"
                value={formData.lastname}
                onChange={handleChange}
                disabled={!isEditing || isSaving}
              />
            </div>

            <div className="dt-profile-page__field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                disabled={!isEditing || isSaving}
              />
            </div>

            <div className="dt-profile-page__field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={user.email || ''}
                disabled
              />
              <span className="dt-profile-page__field-note">
                Email cannot be changed from your profile.
              </span>
            </div>

            {isEditing && (
              <div className="dt-profile-page__actions">
                <button
                  type="button"
                  className="dt-profile-page__button dt-profile-page__button--secondary"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="dt-profile-page__button dt-profile-page__button--primary"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </section>
      </div>
    </div>
  );
};

export default Profile;