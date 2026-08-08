import React from 'react';
import { getProgressColor } from '../../../utils/colorUtils';
import './ProgressRing.css';

export const ProgressRing = ({
  progress = 0,
  size = 140,
  strokeWidth = 10,
  color = null,
  children,
  className = ''
}) => {
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedProgress / 100) * circumference;

  // Use percentage threshold color unless explicit color override is provided
  const strokeColor = color || getProgressColor(normalizedProgress);

  return (
    <div className={`dt-progress-ring-wrapper ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="dt-progress-ring-svg">
        {/* Background Track Circle */}
        <circle
          className="dt-progress-ring-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Fill Arc Circle */}
        <circle
          className="dt-progress-ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          stroke={strokeColor}
        />
      </svg>
      <div className="dt-progress-ring-content">
        {children || <span className="dt-progress-ring-percent">{Math.round(normalizedProgress)}%</span>}
      </div>
    </div>
  );
};

export default ProgressRing;
