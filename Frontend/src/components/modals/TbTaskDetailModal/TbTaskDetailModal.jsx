import React, { useState } from 'react';
import Avatar from '../../ui/Avatar/Avatar';
import ProgressBar from '../../ui/ProgressBar/ProgressBar';
import TbStatusBadge from '../../ui/TbStatusBadge/TbStatusBadge';
import TbPriorityBadge from '../../ui/TbPriorityBadge/TbPriorityBadge';
import DtButton from '../../ui/DtButton/DtButton';
import {
  CloseIcon,
  CalendarIcon,
  ClockIcon,
  EditIcon,
  TrashIcon,
  ActivityIcon
} from '../../../assets/icons';
import './TbTaskDetailModal.css';

export const TbTaskDetailModal = ({
  isOpen = false,
  onClose = () => {},
  task = null,
  assignee = null,
  currentUser = {},
  onEdit = () => {},
  onDelete = () => {},
  onUpdateTask = () => {}
}) => {
  const [currentProgress, setCurrentProgress] = useState(task?.progress || 0);

  // Sync internal state when task changes
  React.useEffect(() => {
    if (task) {
      setCurrentProgress(task.progress || 0);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const isLeader = currentUser?.role === 'leader';
  const isAssignee = currentUser?.id === task.assigneeId;
  const canUpdate = isLeader || isAssignee;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not set';
    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const handleProgressChange = (newProgress) => {
    const p = Math.min(100, Math.max(0, Number(newProgress) || 0));
    setCurrentProgress(p);

    let newStatus = task.status;
    if (p === 100) newStatus = 'completed';
    else if (p === 0) newStatus = 'not_started';
    else newStatus = 'in_progress';

    const newLog = {
      id: `log-${Date.now()}`,
      user: currentUser?.name || 'User',
      action: `updated progress to ${p}%`,
      timestamp: 'Just now'
    };

    onUpdateTask(task.id, {
      progress: p,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      activityLog: [newLog, ...(task.activityLog || [])]
    });
  };

  const handleStatusChange = (newStatus) => {
    let newProgress = currentProgress;
    if (newStatus === 'completed') newProgress = 100;
    else if (newStatus === 'not_started') newProgress = 0;
    else if (newStatus === 'in_progress' && (currentProgress === 0 || currentProgress === 100)) {
      newProgress = 50;
    }

    setCurrentProgress(newProgress);

    const newLog = {
      id: `log-${Date.now()}`,
      user: currentUser?.name || 'User',
      action: `changed status to ${newStatus.replace('_', ' ')}`,
      timestamp: 'Just now'
    };

    onUpdateTask(task.id, {
      status: newStatus,
      progress: newProgress,
      updatedAt: new Date().toISOString(),
      activityLog: [newLog, ...(task.activityLog || [])]
    });
  };

  return (
    <div className="tb-detail-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="tb-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Header */}
        <div className="tb-detail-modal__header">
          <div className="tb-detail-modal__header-left">
            <span className="tb-detail-modal__id">{task.id}</span>
            <div className="tb-detail-modal__badges">
              <TbPriorityBadge priority={task.priority} size="md" />
              <TbStatusBadge status={task.status} size="md" />
            </div>
          </div>

          <button
            type="button"
            className="tb-detail-modal__close-btn"
            onClick={onClose}
            title="Close modal"
            aria-label="Close modal"
          >
            <CloseIcon size={20} color="var(--text-secondary)" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="tb-detail-modal__body">
          {/* 1. Title & Description */}
          <div className="tb-detail-modal__section">
            <h2 className="tb-detail-modal__title">{task.title}</h2>
            <p className="tb-detail-modal__desc">
              {task.description || 'No detailed description provided for this sprint task.'}
            </p>
          </div>

          {/* 2. Metadata Grid: Assignee, Due Date, Dates */}
          <div className="tb-detail-modal__meta-grid">
            {/* Assignee Card */}
            <div className="tb-detail-modal__meta-card">
              <span className="tb-detail-modal__meta-label">Assigned Member</span>
              <div className="tb-detail-modal__assignee">
                <Avatar
                  src={assignee?.avatar}
                  name={assignee?.name || 'User'}
                  size="md"
                />
                <div className="tb-detail-modal__assignee-info">
                  <span className="tb-detail-modal__assignee-name">
                    {assignee?.name || 'Unassigned'}
                  </span>
                  <span className="tb-detail-modal__assignee-role">
                    {assignee?.role === 'leader' ? 'Sprint Leader' : 'Team Member'}
                  </span>
                </div>
              </div>
            </div>

            {/* Dates Card */}
            <div className="tb-detail-modal__meta-card">
              <span className="tb-detail-modal__meta-label">Timeline Schedule</span>
              <div className="tb-detail-modal__dates-list">
                <div className="tb-detail-modal__date-item">
                  <CalendarIcon size={15} color="var(--text-muted)" />
                  <span className="tb-detail-modal__date-text">
                    Due: <strong>{formatDate(task.dueDate)}</strong>
                  </span>
                </div>
                <div className="tb-detail-modal__date-item">
                  <ClockIcon size={15} color="var(--text-muted)" />
                  <span className="tb-detail-modal__date-text">
                    Created: {formatDate(task.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Progress & Status Interactive Section */}
          <div className="tb-detail-modal__section tb-detail-modal__section--progress">
            <div className="tb-detail-modal__section-header">
              <h3 className="tb-detail-modal__section-title">Sprint Deliverable Progress</h3>
              <span className="tb-detail-modal__progress-percentage">
                {currentProgress}%
              </span>
            </div>

            <ProgressBar progress={currentProgress} height={10} showLabel={false} />

            {canUpdate ? (
              <div className="tb-detail-modal__progress-controls">
                <div className="tb-detail-modal__slider-wrap">
                  <label htmlFor="tb-detail-slider" className="tb-detail-modal__slider-label">
                    Adjust Progress:
                  </label>
                  <input
                    id="tb-detail-slider"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    className="tb-detail-modal__slider"
                    value={currentProgress}
                    onChange={(e) => handleProgressChange(e.target.value)}
                  />
                </div>

                <div className="tb-detail-modal__quick-status-buttons">
                  <button
                    type="button"
                    className={`tb-detail-modal__status-pill ${task.status === 'not_started' ? 'tb-detail-modal__status-pill--active-danger' : ''}`}
                    onClick={() => handleStatusChange('not_started')}
                  >
                    Not Started (0%)
                  </button>
                  <button
                    type="button"
                    className={`tb-detail-modal__status-pill ${task.status === 'in_progress' ? 'tb-detail-modal__status-pill--active-warning' : ''}`}
                    onClick={() => handleStatusChange('in_progress')}
                  >
                    In Progress
                  </button>
                  <button
                    type="button"
                    className={`tb-detail-modal__status-pill ${task.status === 'completed' ? 'tb-detail-modal__status-pill--active-success' : ''}`}
                    onClick={() => handleStatusChange('completed')}
                  >
                    Completed (100%)
                  </button>
                </div>
              </div>
            ) : (
              <p className="tb-detail-modal__readonly-hint">
                You are viewing this task in read-only mode. Only the task assignee or sprint leaders can update progress.
              </p>
            )}
          </div>

          {/* 4. Task-Specific Activity / History Log */}
          <div className="tb-detail-modal__section">
            <div className="tb-detail-modal__section-header">
              <h3 className="tb-detail-modal__section-title">
                <ActivityIcon size={16} color="var(--accent-primary)" />
                Task Activity History
              </h3>
            </div>

            <div className="tb-detail-modal__activity-timeline">
              {task.activityLog && task.activityLog.length > 0 ? (
                task.activityLog.map((log) => (
                  <div key={log.id} className="tb-detail-modal__activity-item">
                    <div className="tb-detail-modal__activity-dot" />
                    <div className="tb-detail-modal__activity-content">
                      <p className="tb-detail-modal__activity-text">
                        <strong>{log.user}</strong> {log.action}
                      </p>
                      <span className="tb-detail-modal__activity-time">{log.timestamp}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="tb-detail-modal__activity-empty">No logged activity recorded for this task.</div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="tb-detail-modal__footer">
          <div className="tb-detail-modal__footer-left">
            {isLeader && (
              <DtButton
                variant="danger"
                size="md"
                icon={<TrashIcon size={16} />}
                onClick={() => {
                  onClose();
                  onDelete(task.id);
                }}
              >
                Delete Task
              </DtButton>
            )}
          </div>

          <div className="tb-detail-modal__footer-right">
            {isLeader && (
              <DtButton
                variant="outline"
                size="md"
                icon={<EditIcon size={16} />}
                onClick={() => {
                  onClose();
                  onEdit(task);
                }}
              >
                Edit Task
              </DtButton>
            )}
            <DtButton variant="primary" size="md" onClick={onClose}>
              Done
            </DtButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TbTaskDetailModal;
