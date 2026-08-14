import React, { useState, useRef } from 'react';
import Avatar from '../Avatar/Avatar';
import ProgressBar from '../ProgressBar/ProgressBar';
import TbStatusBadge from '../TbStatusBadge/TbStatusBadge';
import TbPriorityBadge from '../TbPriorityBadge/TbPriorityBadge';
import TbPopover from '../TbPopover/TbPopover';
import {
  MoreVerticalIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon
} from '../../../assets/icons';
import './TbTaskRow.css';

export const TbTaskRow = ({
  task,
  assignee,
  currentUser = {},
  onViewDetails = () => { },
  onEditTask = () => { },
  onDeleteTask = () => { },
  onQuickStatusChange = () => { },
  className = ''
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTriggerRef, setActiveTriggerRef] = useState(null);
  const desktopTriggerRef = useRef(null);
  const mobileTriggerRef = useRef(null);

  const isLeader = currentUser?.role === 'leader';
  const isAssignee = currentUser?.id === task.assigneeId;

  // Format Due Date
  const formatDueDate = (dateStr) => {
    if (!dateStr) return 'No date';
    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Toggle actions menu for a specific trigger ref
  const toggleMenu = (e, triggerRef) => {
    e.stopPropagation();
    if (menuOpen) {
      setMenuOpen(false);
    } else {
      setActiveTriggerRef(triggerRef);
      setMenuOpen(true);
    }
  };

  const handleRowClick = (e) => {
    // If clicked on action button or popover, don't trigger row click
    if (
      desktopTriggerRef.current?.contains(e.target) ||
      mobileTriggerRef.current?.contains(e.target)
    ) {
      return;
    }
    onViewDetails(task);
  };

  // Shared Action Menu Component
  const renderActionMenu = () => {
    return (
      <TbPopover
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        triggerRef={activeTriggerRef || desktopTriggerRef}
        align="end"
        offset={4}
        estimatedHeight={220}
        zIndex={99999}
        ariaRole="menu"
        ariaLabel="Task actions"
      >
        <div className="tb-task-row__dropdown-menu" role="menu">
          {/* Common: View Details */}
          <button
            type="button"
            className="tb-task-row__dropdown-item"
            role="menuitem"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(false);
              onViewDetails(task);
            }}
          >
            <EyeIcon size={15} color="var(--text-secondary)" />
            <span>View Details</span>
          </button>

          {/* Leader-only: Edit Task */}
          {isLeader && (
            <button
              type="button"
              className="tb-task-row__dropdown-item"
              role="menuitem"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(false);
                onEditTask(task);
              }}
            >
              <EditIcon size={15} color="var(--text-secondary)" />
              <span>Edit Task</span>
            </button>
          )}

          {/* Quick Status / Progress Toggle (Leader or Assigned Member) */}
          {(isLeader || isAssignee) && (
            <>
              <div className="tb-task-row__dropdown-divider" />
              <div className="tb-task-row__dropdown-section-title">Quick Status</div>
              {task.status !== 'completed' && (
                <button
                  type="button"
                  className="tb-task-row__dropdown-item tb-task-row__dropdown-item--success"
                  role="menuitem"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onQuickStatusChange(task.id, 'completed', 100);
                  }}
                >
                  <CheckCircleIcon size={15} color="var(--success)" />
                  <span>Mark Completed</span>
                </button>
              )}
              {task.status !== 'in_progress' && (
                <button
                  type="button"
                  className="tb-task-row__dropdown-item tb-task-row__dropdown-item--warning"
                  role="menuitem"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onQuickStatusChange(task.id, 'in_progress', task.progress === 0 ? 50 : task.progress);
                  }}
                >
                  <ClockIcon size={15} color="var(--warning)" />
                  <span>Set In Progress</span>
                </button>
              )}
            </>
          )}

          {/* Leader-only: Delete Task */}
          {isLeader && (
            <>
              <div className="tb-task-row__dropdown-divider" />
              <button
                type="button"
                className="tb-task-row__dropdown-item tb-task-row__dropdown-item--danger"
                role="menuitem"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onDeleteTask(task.id);
                }}
              >
                <TrashIcon size={15} color="var(--danger)" />
                <span>Delete Task</span>
              </button>
            </>
          )}
        </div>
      </TbPopover>
    );
  };

  return (
    <tr className={`tb-task-row ${className}`} onClick={handleRowClick}>
      {/* ======================================================== */}
      {/* 1. DESKTOP / TABLET TABLE CELLS (Hidden on Mobile)       */}
      {/* ======================================================== */}
      <td className="tb-task-row__cell tb-task-row__cell--title tb-task-row__desktop-only">
        <div className="tb-task-row__title-group">
          <div className="tb-task-row__header-line">
            <span className="tb-task-row__id">{task.id}</span>
            <span className="tb-task-row__title" title={task.title}>
              {task.title}
            </span>
          </div>
          {task.description && (
            <p className="tb-task-row__description" title={task.description}>
              {task.description}
            </p>
          )}
        </div>
      </td>

      <td className="tb-task-row__cell tb-task-row__cell--assignee tb-task-row__desktop-only">
        <div className="tb-task-row__assignee-wrapper" title={assignee?.name || 'Unassigned'}>
          <Avatar
            src={assignee?.avatar}
            name={assignee?.name || 'User'}
            size="sm"
          />
          <span className="tb-task-row__assignee-name">
            {assignee?.name || 'Unassigned'}
          </span>
        </div>
      </td>

      <td className="tb-task-row__cell tb-task-row__cell--priority tb-task-row__desktop-only">
        <TbPriorityBadge priority={task.priority} size="sm" />
      </td>

      <td className="tb-task-row__cell tb-task-row__cell--status tb-task-row__desktop-only">
        <TbStatusBadge status={task.status} size="sm" />
      </td>

      <td className="tb-task-row__cell tb-task-row__cell--progress tb-task-row__desktop-only">
        <div className="tb-task-row__progress-container">
          <ProgressBar progress={task.progress} height={6} showLabel={false} />
          <span className="tb-task-row__progress-text">{task.progress}%</span>
        </div>
      </td>

      <td className="tb-task-row__cell tb-task-row__cell--due-date tb-task-row__desktop-only">
        <div className="tb-task-row__date-wrapper">
          <CalendarIcon size={14} color="var(--text-muted)" />
          <span className="tb-task-row__date-text">{formatDueDate(task.dueDate)}</span>
        </div>
      </td>

      <td
        className="tb-task-row__cell tb-task-row__cell--actions tb-task-row__desktop-only"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tb-task-row__actions-container">
          <button
            ref={desktopTriggerRef}
            type="button"
            className={`tb-task-row__action-trigger ${menuOpen && activeTriggerRef === desktopTriggerRef ? 'tb-task-row__action-trigger--active' : ''}`}
            onClick={(e) => toggleMenu(e, desktopTriggerRef)}
            title="Task actions"
            aria-label="Task actions menu"
            aria-expanded={menuOpen && activeTriggerRef === desktopTriggerRef}
          >
            <MoreVerticalIcon size={18} color="var(--text-secondary)" />
          </button>

          {renderActionMenu()}
        </div>
      </td>

      {/* ======================================================== */}
      {/* 2. MOBILE CARD LAYOUT (Visible only on Mobile <= 768px)  */}
      {/* ======================================================== */}
      <td className="tb-task-row__mobile-cell tb-task-row__mobile-only" colSpan={7}>
        <div className="tb-task-row__mobile-card">
          {/* Card Header: ID, Title, Action Menu */}
          <div className="tb-task-row__mobile-header">
            <div className="tb-task-row__mobile-title-block">
              <span className="tb-task-row__id">{task.id}</span>
              <h4 className="tb-task-row__mobile-title">{task.title}</h4>
            </div>

            {/* Mobile Actions Menu Trigger */}
            <div
              className="tb-task-row__actions-container"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                ref={mobileTriggerRef}
                type="button"
                className={`tb-task-row__action-trigger ${menuOpen && activeTriggerRef === mobileTriggerRef ? 'tb-task-row__action-trigger--active' : ''}`}
                onClick={(e) => toggleMenu(e, mobileTriggerRef)}
                title="Task actions"
                aria-label="Task actions menu"
                aria-expanded={menuOpen && activeTriggerRef === mobileTriggerRef}
              >
                <MoreVerticalIcon size={18} color="var(--text-secondary)" />
              </button>
            </div>
          </div>

          {/* Description Preview */}
          {task.description && (
            <p className="tb-task-row__mobile-desc">{task.description}</p>
          )}

          {/* Labeled Rows Grid / Stack */}
          <div className="tb-task-row__mobile-fields">
            {/* Field 1: Assigned To */}
            <div className="tb-task-row__mobile-row">
              <span className="tb-task-row__mobile-label">Assigned To</span>
              <div className="tb-task-row__mobile-value tb-task-row__mobile-assignee">
                <Avatar
                  src={assignee?.avatar}
                  name={assignee?.name || 'User'}
                  size="xs"
                />
                <span className="tb-task-row__mobile-assignee-name">
                  {assignee?.name || 'Unassigned'}
                </span>
              </div>
            </div>

            {/* Field 2: Priority */}
            <div className="tb-task-row__mobile-row">
              <span className="tb-task-row__mobile-label">Priority</span>
              <div className="tb-task-row__mobile-value">
                <TbPriorityBadge priority={task.priority} size="sm" />
              </div>
            </div>

            {/* Field 3: Status */}
            <div className="tb-task-row__mobile-row">
              <span className="tb-task-row__mobile-label">Status</span>
              <div className="tb-task-row__mobile-value">
                <TbStatusBadge status={task.status} size="sm" />
              </div>
            </div>

            {/* Field 4: Progress */}
            <div className="tb-task-row__mobile-row">
              <span className="tb-task-row__mobile-label">Progress</span>
              <div className="tb-task-row__mobile-value tb-task-row__mobile-progress">
                <div className="tb-task-row__mobile-progress-bar">
                  <ProgressBar progress={task.progress} height={6} showLabel={false} />
                </div>
                <span className="tb-task-row__mobile-progress-text">{task.progress}%</span>
              </div>
            </div>

            {/* Field 5: Due Date */}
            <div className="tb-task-row__mobile-row">
              <span className="tb-task-row__mobile-label">Due Date</span>
              <div className="tb-task-row__mobile-value tb-task-row__mobile-date">
                <CalendarIcon size={14} color="var(--text-muted)" />
                <span>{formatDueDate(task.dueDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default TbTaskRow;
