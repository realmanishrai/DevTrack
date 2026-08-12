import React, { useState, useMemo } from 'react';
import DtButton from '../../components/ui/DtButton/DtButton';
import TbTaskStats from '../../components/ui/TbTaskStats/TbTaskStats';
import TbFilterBar from '../../components/ui/TbFilterBar/TbFilterBar';
import TbTaskTable from '../../components/ui/TbTaskTable/TbTaskTable';
import TbAddTaskModal from '../../components/modals/TbAddTaskModal/TbAddTaskModal';
import TbTaskDetailModal from '../../components/modals/TbTaskDetailModal/TbTaskDetailModal';
import { PlusIcon } from '../../assets/icons';
import './Tasks.css';

export const Tasks = ({
  data = {},
  onTaskCreate = () => {},
  onTaskUpdate = () => {},
  onTaskDelete = () => {}
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
        const matchesId = task.id?.toLowerCase().includes(query);
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
  const handleCreateTask = (newTaskData) => {
    const taskId = `tsk-${String(tasksList.length + 1).padStart(3, '0')}`;
    const assigneeObj = memberMap[newTaskData.assigneeId] || { name: 'Member' };

    const createdTask = {
      id: taskId,
      title: newTaskData.title,
      description: newTaskData.description,
      assigneeId: newTaskData.assigneeId,
      priority: newTaskData.priority || 'medium',
      status: 'not_started',
      progress: 0,
      dueDate: newTaskData.dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      activityLog: [
        {
          id: `log-${Date.now()}`,
          user: currentUser.name,
          action: `created task and assigned to ${assigneeObj.name}`,
          timestamp: 'Just now'
        }
      ]
    };

    const updatedTasks = [createdTask, ...tasksList];
    setTasksList(updatedTasks);
    onTaskCreate(createdTask);
  };

  // 2. Edit Task
  const handleEditTaskSubmit = (updatedData) => {
    if (!selectedTaskForEdit) return;

    const previousTask = tasksList.find((t) => t.id === selectedTaskForEdit.id);
    const newLog = {
      id: `log-${Date.now()}`,
      user: currentUser.name,
      action: 'updated task details',
      timestamp: 'Just now'
    };

    const updatedTask = {
      ...previousTask,
      ...updatedData,
      updatedAt: new Date().toISOString(),
      activityLog: [newLog, ...(previousTask?.activityLog || [])]
    };

    const updatedTasks = tasksList.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    setTasksList(updatedTasks);
    onTaskUpdate(updatedTask.id, updatedTask);

    if (selectedTaskForDetail?.id === updatedTask.id) {
      setSelectedTaskForDetail(updatedTask);
    }
  };

  // 3. Delete Task (Leader only)
  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasksList.filter((t) => t.id !== taskId);
    setTasksList(updatedTasks);
    onTaskDelete(taskId);
    if (selectedTaskForDetail?.id === taskId) {
      setIsDetailModalOpen(false);
      setSelectedTaskForDetail(null);
    }
  };

  // 4. Update Task (Progress / Status / History)
  const handleUpdateTask = (taskId, fields) => {
    const updatedTasks = tasksList.map((t) => {
      if (t.id === taskId) {
        const updated = { ...t, ...fields, updatedAt: new Date().toISOString() };
        if (selectedTaskForDetail?.id === taskId) {
          setSelectedTaskForDetail(updated);
        }
        return updated;
      }
      return t;
    });

    setTasksList(updatedTasks);
    onTaskUpdate(taskId, fields);
  };

  // 5. Quick Status Change from Row Menu
  const handleQuickStatusChange = (taskId, newStatus, newProgress) => {
    const targetTask = tasksList.find((t) => t.id === taskId);
    if (!targetTask) return;

    const newLog = {
      id: `log-${Date.now()}`,
      user: currentUser.name,
      action: `changed status to ${newStatus.replace('_', ' ')} (${newProgress}%)`,
      timestamp: 'Just now'
    };

    handleUpdateTask(taskId, {
      status: newStatus,
      progress: newProgress,
      activityLog: [newLog, ...(targetTask.activityLog || [])]
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
    </div>
  );
};

export default Tasks;
