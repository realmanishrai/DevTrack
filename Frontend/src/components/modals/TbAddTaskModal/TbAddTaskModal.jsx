import React, { useState, useEffect } from 'react';
import DtButton from '../../ui/DtButton/DtButton';
import TbDropdown from '../../ui/TbDropdown/TbDropdown';
import TbDatePicker from '../../ui/TbDatePicker/TbDatePicker';
import { CloseIcon, PlusIcon, EditIcon } from '../../../assets/icons';
import './TbAddTaskModal.css';

export const TbAddTaskModal = ({
  isOpen = false,
  onClose = () => {},
  onSubmit = () => {},
  mode = 'create', // 'create' | 'edit'
  task = null,
  members = []
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigneeId: members[0]?.id || 'usr-101',
    priority: 'medium',
    status: 'not_started',
    progress: 0,
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && task) {
        setFormData({
          title: task.title || '',
          description: task.description || '',
          assigneeId: task.assigneeId || (members[0]?.id || 'usr-101'),
          priority: task.priority || 'medium',
          status: task.status || 'not_started',
          progress: task.progress || 0,
          dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
        });
      } else {
        setFormData({
          title: '',
          description: '',
          assigneeId: members[0]?.id || 'usr-101',
          priority: 'medium',
          status: 'not_started',
          progress: 0,
          dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, task, members]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Progress & Status Auto-Sync Logic
      if (field === 'progress') {
        const numVal = Math.min(100, Math.max(0, Number(value) || 0));
        updated.progress = numVal;
        if (numVal === 100) {
          updated.status = 'completed';
        } else if (numVal === 0) {
          updated.status = 'not_started';
        } else {
          updated.status = 'in_progress';
        }
      } else if (field === 'status') {
        if (value === 'completed') {
          updated.progress = 100;
        } else if (value === 'not_started') {
          updated.progress = 0;
        } else if (value === 'in_progress' && (prev.progress === 0 || prev.progress === 100)) {
          updated.progress = 50;
        }
      }

      return updated;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim()
    });
    onClose();
  };

  const memberDropdownOptions = members.map((m) => ({
    value: m.id,
    label: m.name,
    badge: m.role === 'leader' ? 'Leader' : null
  }));

  const priorityDropdownOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
  ];

  const statusDropdownOptions = [
    { value: 'not_started', label: 'Not Started (0%)' },
    { value: 'in_progress', label: 'In Progress (1–99%)' },
    { value: 'completed', label: 'Completed (100%)' },
  ];

  const isEdit = mode === 'edit';

  return (
    <div className="tb-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="tb-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="tb-modal__header">
          <div className="tb-modal__title-group">
            <h2 className="tb-modal__title">
              {isEdit ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p className="tb-modal__subtitle">
              {isEdit
                ? 'Update sprint task specifications, priority, or member assignment.'
                : 'Define sprint deliverable parameters and assign to team members.'}
            </p>
          </div>

          <button
            type="button"
            className="tb-modal__close-btn"
            onClick={onClose}
            title="Close modal"
            aria-label="Close modal"
          >
            <CloseIcon size={20} color="var(--text-secondary)" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="tb-modal__form">
          <div className="tb-modal__body">
            {/* Field 1: Task Title */}
            <div className="tb-modal__field">
              <label className="tb-modal__label" htmlFor="tb-form-title">
                Task Title <span className="tb-modal__required">*</span>
              </label>
              <input
                id="tb-form-title"
                type="text"
                className={`tb-modal__input ${errors.title ? 'tb-modal__input--error' : ''}`}
                placeholder="e.g. Implement WebSocket Real-Time Broadcasting"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                autoFocus
              />
              {errors.title && <span className="tb-modal__error-msg">{errors.title}</span>}
            </div>

            {/* Field 2: Description */}
            <div className="tb-modal__field">
              <label className="tb-modal__label" htmlFor="tb-form-desc">
                Description & Scope
              </label>
              <textarea
                id="tb-form-desc"
                rows={3}
                className="tb-modal__textarea"
                placeholder="Describe acceptance criteria, components affected, or sprint goals..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>

            {/* Row: Assignee & Priority */}
            <div className="tb-modal__grid-2">
              {/* Field 3: Assignee (Custom TbDropdown) */}
              <div className="tb-modal__field">
                <TbDropdown
                  id="tb-form-assignee"
                  label="Assign To"
                  options={memberDropdownOptions}
                  value={formData.assigneeId}
                  onChange={(val) => handleChange('assigneeId', val)}
                  fullWidth
                />
              </div>

              {/* Field 4: Priority (Custom TbDropdown) */}
              <div className="tb-modal__field">
                <TbDropdown
                  id="tb-form-priority"
                  label="Priority Level"
                  options={priorityDropdownOptions}
                  value={formData.priority}
                  onChange={(val) => handleChange('priority', val)}
                  fullWidth
                />
              </div>
            </div>

            {/* Row: Due Date & Status */}
            <div className="tb-modal__grid-2">
              {/* Field 5: Due Date (Custom TbDatePicker) */}
              <div className="tb-modal__field">
                <TbDatePicker
                  id="tb-form-due-date"
                  label="Due Date"
                  value={formData.dueDate}
                  onChange={(val) => handleChange('dueDate', val)}
                />
              </div>

              {/* Field 6: Status (Custom TbDropdown in edit mode) */}
              {isEdit ? (
                <div className="tb-modal__field">
                  <TbDropdown
                    id="tb-form-status"
                    label="Status"
                    options={statusDropdownOptions}
                    value={formData.status}
                    onChange={(val) => handleChange('status', val)}
                    fullWidth
                  />
                </div>
              ) : (
                <div className="tb-modal__field">
                  <label className="tb-modal__label">Initial Status</label>
                  <div className="tb-modal__static-pill">Not Started (0% progress)</div>
                </div>
              )}
            </div>

            {/* Field 7 (Edit mode only): Progress Slider */}
            {isEdit && (
              <div className="tb-modal__field">
                <div className="tb-modal__progress-header">
                  <label className="tb-modal__label" htmlFor="tb-form-progress">
                    Completion Progress
                  </label>
                  <span className="tb-modal__progress-val">{formData.progress}%</span>
                </div>
                <input
                  id="tb-form-progress"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  className="tb-modal__slider"
                  value={formData.progress}
                  onChange={(e) => handleChange('progress', e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="tb-modal__footer">
            <DtButton variant="outline" size="md" onClick={onClose}>
              Cancel
            </DtButton>
            <DtButton
              type="submit"
              variant="primary"
              size="md"
              icon={isEdit ? <EditIcon size={16} /> : <PlusIcon size={16} />}
            >
              {isEdit ? 'Save Changes' : 'Create Task'}
            </DtButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TbAddTaskModal;
