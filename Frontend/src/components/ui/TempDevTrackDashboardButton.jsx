// TODO-REMOVE: temporary DevTrack dashboard shortcut - remove before merge
// This file is temporary and should be deleted before merging to main.

import { useNavigate } from 'react-router-dom';
import './TempDevTrackDashboardButton.css';

export default function TempDevTrackDashboardButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/dashboard');
  };

  return (
    <button
      type="button"
      className="tempDevtrackNav_dashboard_btn"
      onClick={handleClick}
      title="Temporary Dev shortcut to /dashboard"
    >
      <span className="tempDevtrackNav_badge">DEV</span>
      <span>Dashboard &rarr;</span>
    </button>
  );
}
