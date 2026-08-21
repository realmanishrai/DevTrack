import React, { useState, useMemo, useEffect } from 'react';
import DtButton from '../../components/ui/DtButton/DtButton';
import TbTaskStats from '../../components/ui/TbTaskStats/TbTaskStats';
import TbFilterBar from '../../components/ui/TbFilterBar/TbFilterBar';
import TbTaskTable from '../../components/ui/TbTaskTable/TbTaskTable';
import TbAddTaskModal from '../../components/modals/TbAddTaskModal/TbAddTaskModal';
import TbTaskDetailModal from '../../components/modals/TbTaskDetailModal/TbTaskDetailModal';
import { PlusIcon, TrashIcon, CloseIcon } from '../../assets/icons';
import './Tasks.css';

export const Tasks = ({
  data = {},
  onTaskCreate = () => { },
  onTaskUpdate = () => { },
  onTaskDelete = () => { }
}) => {
  const {
    room = {},
    currentUser = { id: 'usr-101', name: 'Alex Rivera', role: 'leader' },
    members = [],
    tasks: initialTasks = []
  } = data;

  const isLeader = currentUser?.role === 'leader';

  // Local Task Board State
  const [tasksList, setTasksList] = useState(initialTasks);

  useEffect(() => {
    setTasksList(initialTasks);
  }, [initialTasks]);

  // Search, Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [memberFilter, setMemberFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalMode, setAddModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState(null);

  // Delete Confirmation Modal State
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Helper map for member lookup
  const memberMap = useMemo(() => {
    return members.reduce((acc, m) => {
      acc[m.id] = m;
      return acc;
    }, {});
  }, [members]);

  /* =========================================================================
   * FILTERING & SORTING LOGIC (Combined Multi-Criteria)
   * ========================================================================= */
  const filteredTasks = useMemo(() => {
    return tasksList.filter((task) => {
      // 1. Search Query (matches title or description)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = task.title?.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query);
        const matchesId = String(task.id ?? '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesId) return false;
      }

      // 2. Status Filter
      if (statusFilter !== 'all') {
        const taskStatus = (task.status || 'not_started').toLowerCase().replace(/[\s-]/g, '_');
        if (statusFilter === 'not_started' && taskStatus !== 'not_started' && taskStatus !== 'pending') return false;
        if (statusFilter === 'in_progress' && taskStatus !== 'in_progress' && taskStatus !== 'inprogress') return false;
        if (statusFilter === 'completed' && taskStatus !== 'completed' && taskStatus !== 'done') return false;
      }

      // 3. Member Filter
      if (memberFilter !== 'all') {
        if (task.assigneeId !== memberFilter) return false;
      }

      // 4. Priority Filter
      if (priorityFilter !== 'all') {
        if (task.priority?.toLowerCase() !== priorityFilter.toLowerCase()) return false;
      }

      return true;
    }).sort((a, b) => {
      // Sorting Logic
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case 'due_date':
          return new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31');
        case 'priority': {
          const priorityWeight = { high: 3, medium: 2, low: 1 };
          return (priorityWeight[b.priority?.toLowerCase()] || 0) - (priorityWeight[a.priority?.toLowerCase()] || 0);
        }
        case 'progress_desc':
          return (b.progress || 0) - (a.progress || 0);
        case 'progress_asc':
          return (a.progress || 0) - (b.progress || 0);
        case 'newest':
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });
  }, [tasksList, searchQuery, statusFilter, memberFilter, priorityFilter, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setMemberFilter('all');
    setPriorityFilter('all');
    setSortBy('newest');
  };

  const handleStatCardClick = (statId) => {
    setStatusFilter((prev) => (prev === statId ? 'all' : statId));
  };

  /* =========================================================================
   * TASK CRUD HANDLERS
   * Note: In a production architecture with real endpoints or a global Context,
   * these state operations propagate to Dashboard progress metrics and Activity Log.
   * ========================================================================= */

  // 1. Create Task (Leader only trigger)
  const handleCreateTask = async (newTaskData) => {
    if (onTaskCreate) {
      return await onTaskCreate(newTaskData);
    }
  };

  // 2. Edit Task
  const handleEditTaskSubmit = async (updatedData) => {
    if (!selectedTaskForEdit) return;

    if (onTaskUpdate) {
      const result = await onTaskUpdate(selectedTaskForEdit.id, updatedData);
      if (result && result.success === false) {
        return result;
      }
    }
    return { success: true };
  };

  // 3. Delete Task (Leader only) - Opens confirmation modal
  const handleDeleteTask = (taskId) => {
    const task = tasksList.find((t) => String(t.id) === String(taskId));
    if (task) {
      if (selectedTaskForDetail?.id === taskId) {
        setIsDetailModalOpen(false);
        setSelectedTaskForDetail(null);
      }
      setTaskToDelete(task);
      setDeleteError('');
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    if (isDeleting) return;
    setTaskToDelete(null);
    setDeleteError('');
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);
    setDeleteError('');

    if (onTaskDelete) {
      const result = await onTaskDelete(taskToDelete.id);
      if (result && result.success === false) {
        setDeleteError(result.error || 'Failed to delete task.');
        setIsDeleting(false);
        return;
      }
    }

    setIsDeleting(false);
    setTaskToDelete(null);
  };

  // 4. Update Task (Progress / Status / History)
  const handleUpdateTask = async (taskId, fields) => {
    if (onTaskUpdate) {
      return await onTaskUpdate(taskId, fields);
    }
  };

  // 5. Quick Status Change from Row Menu
  const handleQuickStatusChange = async (taskId, newStatus, newProgress) => {
    return await handleUpdateTask(taskId, {
      status: newStatus,
      progress: newProgress,
    });
  };

  // Open modals helper functions
  const openAddTaskModal = () => {
    setAddModalMode('create');
    setSelectedTaskForEdit(null);
    setIsAddModalOpen(true);
  };

  const openEditTaskModal = (task) => {
    setAddModalMode('edit');
    setSelectedTaskForEdit(task);
    setIsAddModalOpen(true);
  };

  const openDetailModal = (task) => {
    setSelectedTaskForDetail(task);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="dt-tasks-page">
      {/* SECTION 1: Task Board Page Header */}
      <div className="dt-tasks-page__header">
        <div className="dt-tasks-page__header-left">
          <div className="dt-tasks-page__title-badge-row">
            <h1 className="dt-tasks-page__title">Tasks Board</h1>
          </div>
          <p className="dt-tasks-page__subtitle">
            Manage sprint deliverables, track progress, and coordinate workload across team members.
          </p>
        </div>

        <div className="dt-tasks-page__header-right">
          {/* Leader-only Add Task Button */}
          {isLeader && (
            <DtButton
              variant="primary"
              size="md"
              icon={<PlusIcon size={16} />}
              onClick={openAddTaskModal}
            >
              Add Task
            </DtButton>
          )}
        </div>
      </div>

      {/* SECTION 2: Dynamic Task Statistics Row */}
      <section className="dt-tasks-page__section" aria-label="Task Statistics">
        <TbTaskStats
          tasks={tasksList}
          activeFilter={statusFilter}
          onStatClick={handleStatCardClick}
        />
      </section>

      {/* SECTION 3: Multi-Criteria Filter, Search & Sort Bar */}
      <section className="dt-tasks-page__section" aria-label="Filter and Search">
        <TbFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          memberFilter={memberFilter}
          onMemberChange={setMemberFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          members={members}
          totalCount={tasksList.length}
          filteredCount={filteredTasks.length}
          onResetFilters={handleResetFilters}
        />
      </section>

      {/* SECTION 4: Main Task Table List View */}
      <section className="dt-tasks-page__section" aria-label="Tasks List">
        <TbTaskTable
          tasks={filteredTasks}
          members={members}
          currentUser={currentUser}
          onViewDetails={openDetailModal}
          onEditTask={openEditTaskModal}
          onDeleteTask={handleDeleteTask}
          onQuickStatusChange={handleQuickStatusChange}
          onAddTaskClick={openAddTaskModal}
          onResetFilters={handleResetFilters}
          isFilterActive={
            searchQuery.trim() !== '' ||
            statusFilter !== 'all' ||
            memberFilter !== 'all' ||
            priorityFilter !== 'all'
          }
        />
      </section>

      {/* MODAL 1: Add / Edit Task Modal (Leader Trigger) */}
      <TbAddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedTaskForEdit(null);
        }}
        onSubmit={addModalMode === 'create' ? handleCreateTask : handleEditTaskSubmit}
        mode={addModalMode}
        task={selectedTaskForEdit}
        members={members}
      />

      {/* MODAL 2: Task Detail View Modal (Interactive progress updater & history) */}
      <TbTaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTaskForDetail(null);
        }}
        task={selectedTaskForDetail}
        assignee={selectedTaskForDetail ? memberMap[selectedTaskForDetail.assigneeId] : null}
        currentUser={currentUser}
        onEdit={openEditTaskModal}
        onDelete={handleDeleteTask}
        onUpdateTask={handleUpdateTask}
      />

      {/* MODAL 3: Delete Task Confirmation Modal */}
      {taskToDelete && (
        <div
          className="tb-modal-backdrop"
          onClick={cancelDelete}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tb-delete-modal-title"
        >
          <div
            className="tb-modal"
            style={{ maxWidth: '460px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tb-modal__header">
              <div className="tb-modal__title-group">
                <h2
                  id="tb-delete-modal-title"
                  className="tb-modal__title"
                  style={{ color: 'var(--danger)' }}
                >
                  Delete Task?
                </h2>
              </div>
              <button
                type="button"
                className="tb-modal__close-btn"
                onClick={cancelDelete}
                disabled={isDeleting}
                title="Close modal"
                aria-label="Close modal"
              >
                <CloseIcon size={20} color="var(--text-secondary)" />
              </button>
            </div>

            <div className="tb-modal__body" style={{ padding: 'var(--space-5)' }}>
              {deleteError && (
                <div
                  style={{
                    padding: '10px 14px',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    border: '1px solid var(--danger)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--danger)',
                    fontSize: '13px',
                    marginBottom: '16px'
                  }}
                  role="alert"
                >
                  {deleteError}
                </div>
              )}
              <p
                style={{
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                  fontSize: '15px',
                  lineHeight: '1.5'
                }}
              >
                Are you sure you want to delete <strong>"{taskToDelete.title}"</strong>?
              </p>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  margin: 0
                }}
              >
                This action cannot be undone.
              </p>
            </div>

            <div
              className="tb-modal__footer"
              style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}
            >
              <DtButton
                variant="outline"
                size="md"
                onClick={cancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </DtButton>
              <DtButton
                variant="danger"
                size="md"
                onClick={confirmDelete}
                disabled={isDeleting}
                icon={<TrashIcon size={16} />}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </DtButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
