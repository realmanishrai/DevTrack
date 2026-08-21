/**
 * Task Data Adapter
 *
 * Normalizes backend task responses (snake_case) to the frontend UI model (camelCase)
 * and computes dynamic progress statistics and card metrics for the Dashboard.
 *
 * Backend GET /dashboard/{room_code}/tasks schema:
 * [
 *   {
 *     id: number,
 *     title: string,
 *     description: string,
 *     status: string,
 *     progress: number,
 *     priority: string,
 *     created_by: number,
 *     due_date: string (YYYY-MM-DD),
 *     created_at: string (ISO),
 *     updated_at: string (ISO),
 *     assignee_ids: number[]
 *   }
 * ]
 */

export const mapBackendTaskToUi = (backendTask) => {
  if (!backendTask) return null;

  const assigneeIds = Array.isArray(backendTask.assignee_ids)
    ? backendTask.assignee_ids
    : [];

  return {
    id: String(backendTask.id),
    rawId: backendTask.id,
    title: backendTask.title || 'Untitled Task',
    description: backendTask.description || '',
    status: backendTask.status || 'not_started',
    progress: typeof backendTask.progress === 'number' ? backendTask.progress : 0,
    priority: backendTask.priority || 'medium',
    createdBy: backendTask.created_by,
    dueDate: backendTask.due_date || null,
    createdAt: backendTask.created_at || null,
    updatedAt: backendTask.updated_at || null,
    assigneeIds,
    assigneeId: assigneeIds.length > 0 ? String(assigneeIds[0]) : null,
    activityLog: [],
  };
};

export const mapBackendTasksListToUi = (backendTasks) => {
  if (!Array.isArray(backendTasks)) {
    return [];
  }
  return backendTasks.map(mapBackendTaskToUi).filter(Boolean);
};

export const computeDashboardStatsFromTasks = (tasks = [], members = []) => {
  const totalCount = tasks.length;
  const completedTasks = tasks.filter(
    (t) => (t.status || '').toLowerCase() === 'completed'
  );
  const completedCount = completedTasks.length;
  const remainingCount = totalCount - completedCount;

  const inProgressTasks = tasks.filter(
    (t) => (t.status || '').toLowerCase() === 'in_progress'
  );
  const inProgressCount = inProgressTasks.length;

  const pendingTasks = tasks.filter((t) => {
    const s = (t.status || '').toLowerCase();
    return s === 'not_started' || s === 'pending';
  });
  const pendingCount = pendingTasks.length;

  const overallPercentage =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const progressStats = {
    overallPercentage,
    completedCount,
    remainingCount,
    totalCount,
    lastUpdated: 'Just now',
  };

  const statCards = [
    {
      id: 'stat-members',
      title: 'Total Members',
      value: members.length || 0,
      subtitle: `${members.length || 0} active`,
      type: 'info',
      change: 'Team',
    },
    {
      id: 'stat-total-tasks',
      title: 'Total Tasks',
      value: totalCount,
      subtitle: 'Sprint tasks',
      type: 'muted',
      change: `${totalCount} total`,
    },
    {
      id: 'stat-completed',
      title: 'Completed Tasks',
      value: completedCount,
      subtitle: `${totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}% completion rate`,
      type: 'success',
      change: `+${completedCount} done`,
    },
    {
      id: 'stat-in-progress',
      title: 'In Progress Tasks',
      value: inProgressCount,
      subtitle: 'Currently active',
      type: 'warning',
      change: 'Active',
    },
    {
      id: 'stat-pending',
      title: 'Pending Tasks',
      value: pendingCount,
      subtitle: 'Awaiting execution',
      type: 'danger',
      change: 'Backlog',
    },
  ];

  // Count tasks due soon (within 7 days and not completed)
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const tasksDueSoonCount = tasks.filter((t) => {
    if ((t.status || '').toLowerCase() === 'completed' || !t.dueDate) return false;
    const due = new Date(t.dueDate);
    return !isNaN(due.getTime()) && due >= now && due <= sevenDaysFromNow;
  }).length;

  const statusSummary = {
    completionPercentage: overallPercentage,
    activeMembersCount: members.length || 0,
    tasksDueSoonCount,
    nextMilestone:
      totalCount > 0
        ? `${completedCount} of ${totalCount} tasks finished`
        : 'No tasks scheduled',
  };

  return {
    progressStats,
    statCards,
    statusSummary,
  };
};
