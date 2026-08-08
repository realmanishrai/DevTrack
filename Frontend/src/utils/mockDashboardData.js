export const mockDashboardData = {
  room: {
    id: "rm-8042",
    name: "DevTrack Frontend Alpha",
    code: "DEV-8924-X",
    description: "Collaborative task-tracking frontend application for team sprint execution.",
    createdAt: "2026-08-01T10:00:00Z"
  },

  currentUser: {
    id: "usr-101",
    name: "Alex Rivera",
    email: "alex.rivera@devtrack.io",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    role: "leader"
  },

  progressStats: {
    overallPercentage: 68,
    completedCount: 17,
    remainingCount: 8,
    totalCount: 25,
    lastUpdated: "10 mins ago"
  },

  statCards: [
    {
      id: "stat-members",
      title: "Total Members",
      value: 6,
      subtitle: "2 active now",
      type: "info",
      change: "+1 this week"
    },
    {
      id: "stat-total-tasks",
      title: "Total Tasks",
      value: 25,
      subtitle: "Across 4 epics",
      type: "muted", // Grey border & icon
      change: "25 total"
    },
    {
      id: "stat-completed",
      title: "Completed Tasks",
      value: 17,
      subtitle: "68% completion rate",
      type: "success",
      change: "+3 today"
    },
    {
      id: "stat-in-progress",
      title: "In Progress Tasks",
      value: 5,
      subtitle: "Assigned to 4 members",
      type: "warning",
      change: "Active"
    },
    {
      id: "stat-pending",
      title: "Pending Tasks",
      value: 3,
      subtitle: "Awaiting triage",
      type: "danger", // Red --danger border & icon
      change: "Backlog"
    }
  ],

  statusSummary: {
    completionPercentage: 68,
    activeMembersCount: 5,
    tasksDueSoonCount: 3,
    nextMilestone: "Sprint 2 Demo in 3 days"
  },

  members: [
    {
      id: "usr-101",
      name: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      role: "leader",
      assignedCount: 6,
      completedCount: 5,
      progressPercentage: 83
    },
    {
      id: "usr-102",
      name: "Sophia Chen",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
      role: "member",
      assignedCount: 5,
      completedCount: 4,
      progressPercentage: 80
    },
    {
      id: "usr-103",
      name: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      role: "member",
      assignedCount: 5,
      completedCount: 3,
      progressPercentage: 60
    },
    {
      id: "usr-104",
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      role: "member",
      assignedCount: 4,
      completedCount: 3,
      progressPercentage: 75
    },
    {
      id: "usr-105",
      name: "Liam Thorne",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      role: "member",
      assignedCount: 4,
      completedCount: 1,
      progressPercentage: 25
    },
    {
      id: "usr-106",
      name: "Maya Lin",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      role: "member",
      assignedCount: 2,
      completedCount: 1,
      progressPercentage: 50
    }
  ],

  recentActivities: [
    {
      id: "act-1",
      type: "task_completed",
      title: "Completed task 'Design System Tokens Implementation'",
      user: { name: "Sophia Chen", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80" },
      timestamp: "12 mins ago",
      badgeType: "success"
    },
    {
      id: "act-2",
      type: "task_assigned",
      title: "Assigned 'Setup Dashboard Stat Cards' to Marcus Vance",
      user: { name: "Alex Rivera", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
      timestamp: "45 mins ago",
      badgeType: "info"
    },
    {
      id: "act-3",
      type: "member_joined",
      title: "Maya Lin joined DevTrack Frontend Alpha room",
      user: { name: "Maya Lin", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" },
      timestamp: "2 hours ago",
      badgeType: "primary"
    },
    {
      id: "act-4",
      type: "task_updated",
      title: "Updated task priority on 'FastAPI Authentication Integration'",
      user: { name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
      timestamp: "4 hours ago",
      badgeType: "warning"
    },
    {
      id: "act-5",
      type: "task_completed",
      title: "Completed task 'Sidebar Component Layout & Drawer'",
      user: { name: "Alex Rivera", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
      timestamp: "Yesterday at 4:30 PM",
      badgeType: "success"
    }
  ]
};
