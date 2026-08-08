import React from 'react';
import { getProgressColor } from '../../../utils/colorUtils';
import './ProgressBar.css';

export const ProgressBar = ({
  progress = 0, // 0 - 100
  height = 8,
  showLabel = false,
  labelText = null,
  color = null,
  className = ''
}) => {
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  
  // Use percentage threshold color unless explicit color override is provided
  const fillColor = color || getProgressColor(normalizedProgress);

  const barStyle = {
    width: `${normalizedProgress}%`,
    backgroundColor: fillColor
  };

  return (
    <div className={`dt-progress-wrapper ${className}`}>
      {(showLabel || labelText) && (
        <div className="dt-progress-label">
          {labelText && <span className="dt-progress-label-text">{labelText}</span>}
          <span className="dt-progress-percentage" style={{ color: fillColor }}>
            {Math.round(normalizedProgress)}%
          </span>
        </div>
      )}
      <div className="dt-progress-track" style={{ height: `${height}px` }}>
        <div
          className="dt-progress-fill"
          style={barStyle}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
