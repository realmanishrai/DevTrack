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
  ],

  tasks: [
    // --- 17 COMPLETED TASKS (100% Progress) ---
    {
      id: "tsk-001",
      title: "Design System Tokens & Theme Engine",
      description: "Implement dark/light theme variables in theme.css adhering to design-system.md specifications.",
      assigneeId: "usr-102", // Sophia Chen
      priority: "high",
      status: "completed",
      progress: 100,
      dueDate: "2026-08-04",
      createdAt: "2026-08-01T09:00:00Z",
      updatedAt: "2026-08-04T16:20:00Z",
      activityLog: [
        { id: "log-101", user: "Sophia Chen", action: "marked task as completed", timestamp: "Aug 4, 4:20 PM" },
        { id: "log-102", user: "Sophia Chen", action: "updated progress to 100%", timestamp: "Aug 4, 3:15 PM" },
        { id: "log-103", user: "Alex Rivera", action: "created task", timestamp: "Aug 1, 9:00 AM" }
      ]
    },
    {
      id: "tsk-002",
      title: "Sidebar Component Layout & Drawer",
      description: "Build collapsible desktop and mobile responsive navigation sidebar with active link indicators.",
      assigneeId: "usr-101", // Alex Rivera
      priority: "medium",
      status: "completed",
      progress: 100,
      dueDate: "2026-08-05",
      createdAt: "2026-08-01T10:30:00Z",
      updatedAt: "2026-08-05T14:45:00Z",
      activityLog: [
        { id: "log-104", user: "Alex Rivera", action: "completed task", timestamp: "Aug 5, 2:45 PM" },
        { id: "log-105", user: "Alex Rivera", action: "created task", timestamp: "Aug 1, 10:30 AM" }
      ]
    },
    {
      id: "tsk-003",
      title: "PageContainer Shell & Doodle Background",
      description: "Create shared layout wrapper with dynamic page titles, theme toggle, and SVG anti-seam doodle pattern.",
      assigneeId: "usr-101", // Alex Rivera
      priority: "medium",
      status: "completed",
      progress: 100,
      dueDate: "2026-08-06",
      createdAt: "2026-08-02T11:00:00Z",
      updatedAt: "2026-08-06T11:30:00Z",
      activityLog: [
        { id: "log-106", user: "Alex Rivera", action: "completed task", timestamp: "Aug 6, 11:30 AM" },
        { id: "log-107", user: "Alex Rivera", action: "created task", timestamp: "Aug 2, 11:00 AM" }
      ]
    },
    {
      id: "tsk-004",
      title: "Landing Page Hero Section & Value Prop",
      description: "Construct responsive hero banner with preview card mockups and primary call-to-action buttons.",
      assigneeId: "usr-103", // Marcus Vance
      priority: "high",
      status: "completed",
      progress: 100,
      dueDate: "2026-08-05",
      createdAt: "2026-08-02T14:00:00Z",
      updatedAt: "2026-08-05T17:10:00Z",
      activityLog: [
        { id: "log-108", user: "Marcus Vance", action: "completed hero banner build", timestamp: "Aug 5, 5:10 PM" },
        { id: "log-109", user: "Alex Rivera", action: "created task", timestamp: "Aug 2, 2:00 PM" }
      ]
    },
    {
      id: "tsk-005",
      title: "Room Code Display & Copy Mechanism",
      description: "Build room code pill component with clipboard copy functionality and instant toast feedback.",
      assigneeId: "usr-104", // Elena Rostova
      priority: "low",
      status: "completed",
      progress: 100,
      dueDate: "2026-08-06",
      createdAt: "2026-08-03T09:15:00Z",
      updatedAt: "2026-08-06T15:00:00Z",
      activityLog: [
        { id: "log-110", user: "Elena Rostova", action: "verified clipboard API and completed", timestamp: "Aug 6, 3:00 PM" },
        { id: "log-111", user: "Alex Rivera", action: "created task", timestamp: "Aug 3, 9:15 AM" }
      ]
    },
    {
      id: "tsk-006",
      title: "StatCard Component & Dashboard Metric Row",
      description: "Develop reusable StatCard component with color threshold variants (primary, success, warning, danger).",
      assigneeId: "usr-101", // Alex Rivera
      priority: "medium",
      status: "completed",
      progress: 100,
      dueDate: "2026-08-07",
      createdAt: "2026-08-03T10:00:00Z",
      updatedAt: "2026-08-07T12:00:00Z",
      activityLog: [
        { id: "log-112", user: "Alex Rivera", action: "completed StatCard component", timestamp: "Aug 7, 12:00 PM" },
        { id: "log-113", user: "Alex Rivera", action: "created task", timestamp: "Aug 3, 10:00 AM" }
      ]
    },
    {
      id: "tsk-007",
      title: "Circular ProgressRing SVG Component",
      description: "Implement animated circular progress ring component with circumference calculation and inner slot.",
      assigneeId: "usr-102", // Sophia Chen
      priority: "medium",
      status: "completed",
      progress: 100,
      dueDate: "2026-08-07",
      createdAt: "2026-08-03T13:00:00Z",
      updatedAt: "2026-08-07T16:40:00Z",
      activityLog: [
        { id: "log-114", user: "Sophia Chen", action: "completed ProgressRing component", timestamp: "Aug 7, 4:40 PM" },
        { id: "log-115", user: "Alex Rivera", action: "created task", timestamp: "Aug 3, 1:00 PM" }
      ]
    },
    {
      id: "tsk-008",
      title: "Linear ProgressBar with Dynamic Color Rules",
      description: "Build 8px rounded linear progress bar with red (<30%), amber (30-69%), and green (70-100%) thresholds.",
      assigneeId: "usr-102", // Sophia Chen
      priority: "low",
      status: "completed",
      progress: 100,
      dueDate: "2026-08-07",
      createdAt: "2026-08-03T14:30:00Z",
      updatedAt: "2026-08-07T18:00:00Z",
      activityLog: [
        { id: "log-116", user: "Sophia Chen", action: "completed ProgressBar component", timestamp: "Aug 7, 6:00 PM" },
        { id: "log-117", user: "Sophia Chen", action: "created task", timestamp: "Aug 3, 2:30 PM" }
      ]
    },
    {
      id: "tsk-009",
      title: "Avatar & AvatarGroup Component",
      description: "Create user avatar component with image fallback initials and online/offline status dots.",
      assigneeId: "usr-104", // Elena Rostova
      priority: "low",
      status: "completed",
      progress: 100,
      dueDate: "2026-08-08",
      createdAt: "2026-08-04T10:00:00Z",
      updatedAt: "2026-08-08T11:20:00Z",
      activityLog: [
        { id: "log-118", user: "Elena Rostova", action: "completed Avatar component", timestamp: "Aug 8, 11:20 AM" },
        { id: "log-119", user: "Alex Rivera", action: "created task", timestamp: "Aug 4, 10:00 AM" }
      ]
    },
    {
      id: "tsk-010",
      title: "ProfileMenu Dropdown & Logout Flow",
      description: "Build top-right user profile popover with user details, role badge, and session logout trigger.",
      assigneeId: "usr-101", // Alex Rivera
      priority: "medium",
      status: "completed",
      progress: 100,
      dueDate: "2026-08-08",
      createdAt: "2026-08-04T11:30:00Z",
      updatedAt: "2026-08-08T15:10:00Z",
      activityLog: [
        { id: "log-120", user: "Alex Rivera", action: "completed ProfileMenu component", timestamp: "Aug 8, 3:10 PM" },
        { id: "log-121", user: "Alex Rivera", action: "created task", timestamp: "Aug 4, 11:30 AM" }
      ]
    },
    {
      id: "tsk-011",
      title: "MemberCard Roster Grid Component",
      description: "Build team member summary cards displaying task counts, completion rate, and workload indicators.",
      assigneeId: "usr-103", // Marcus Vance
      priority: "medium",
      status: "completed",
      progress: 100,
      dueDate: "2026-08-08",
      createdAt: "2026-08-04T13:00:00Z",
      updatedAt: "2026-08-08T17:30:00Z",
      activityLog: [
        { id: "log-122", user: "Marcus Vance", action: "completed MemberCard", timestamp: "Aug 8, 5:30 PM" },
        { id: "log-123", user: "Alex Rivera", action: "created task", timestamp: "Aug 4, 1:00 PM" }
      ]
    },
    {
      id: "tsk-012",
      title: "ActivityItem Feed Component",
      description: "Create activity timeline items with timestamp formatting, user avatars, and event badge types.",
      assigneeId: "usr-104", // Elena Rostova
      priority: "low",
      status: "completed",
      progress: 100,
      dueDate: "2026-08-09",
      createdAt: "2026-08-05T09:45:00Z",
      updatedAt: "2026-08-09T10:15:00Z",
      activityLog: [
        { id: "log-124", user: "Elena Rostova", action: "completed ActivityItem feed", timestamp: "Aug 9, 10:15 AM" },
        { id: "log-125", user: "Alex Rivera", action: "created task", timestamp: "Aug 5, 9:45 AM" }
      ]
    },
    {
      id: "tsk-013",
      title: "DtButton & DtCard UI Primitives",
      description: "Implement core dashboard button and card UI components with token-driven states and hover elevations.",
      assigneeId: "usr-101", // Alex Rivera
      priority: "high",
      status: "completed",
      progress: 100,
      dueDate: "2026-08-09",
      createdAt: "2026-08-05T11:00:00Z",
      updatedAt: "2026-08-09T13:00:00Z",
      activityLog: [
        { id: "log-126", user: "Alex Rivera", action: "completed button and card components", timestamp: "Aug 9, 1:00 PM" },
        { id: "log-127", user: "Alex Rivera", action: "created task", timestamp: "Aug 5, 11:00 AM" }
      ]
    },
    {
      id: "tsk-014",
      title: "Authentication Form Layouts (Login/Register)",
      description: "Build clean input validation wrappers and authentication forms for email/password user registration.",
      assigneeId: "usr-103", // Marcus Vance
      priority: "high",
      status: "completed",
      progress: 100,
      dueDate: "2026-08-09",
      createdAt: "2026-08-05T14:20:00Z",
      updatedAt: "2026-08-09T18:30:00Z",
      activityLog: [
        { id: "log-128", user: "Marcus Vance", action: "completed auth forms", timestamp: "Aug 9, 6:30 PM" },
        { id: "log-129", user: "Alex Rivera", action: "created task", timestamp: "Aug 5, 2:20 PM" }
      ]
    },
    {
      id: "tsk-015",
      title: "Theme Toggle Floating Mechanism",
      description: "Integrate documentElement data-theme attribute persistence via localStorage for seamless mode switching.",
      assigneeId: "usr-102", // Sophia Chen
      priority: "low",
      status: "completed",
      progress: 100,
      dueDate: "2026-08-10",
      createdAt: "2026-08-06T09:00:00Z",
      updatedAt: "2026-08-10T11:00:00Z",
      activityLog: [
        { id: "log-130", user: "Sophia Chen", action: "completed theme persistence engine", timestamp: "Aug 10, 11:00 AM" },
        { id: "log-131", user: "Sophia Chen", action: "created task", timestamp: "Aug 6, 9:00 AM" }
      ]
    },
    {
      id: "tsk-016",
      title: "Dashboard Overview Page Composition",
      description: "Assemble top RoomCard, Progress summary, StatCards grid, and active team workload sections.",
      assigneeId: "usr-105", // Liam Thorne
      priority: "high",
      status: "completed",
      progress: 100,
      dueDate: "2026-08-10",
      createdAt: "2026-08-06T11:15:00Z",
      updatedAt: "2026-08-10T15:30:00Z",
      activityLog: [
        { id: "log-132", user: "Liam Thorne", action: "assembled and polished Dashboard page", timestamp: "Aug 10, 3:30 PM" },
        { id: "log-133", user: "Alex Rivera", action: "created task", timestamp: "Aug 6, 11:15 AM" }
      ]
    },
    {
      id: "tsk-017",
      title: "Lucide Icon Set Integration",
      description: "Import clean SVG icon wrappers for dashboard navigation, badges, stats, and action triggers.",
      assigneeId: "usr-106", // Maya Lin
      priority: "low",
      status: "completed",
      progress: 100,
      dueDate: "2026-08-10",
      createdAt: "2026-08-06T13:00:00Z",
      updatedAt: "2026-08-10T17:00:00Z",
      activityLog: [
        { id: "log-134", user: "Maya Lin", action: "bundled all SVG outline icons", timestamp: "Aug 10, 5:00 PM" },
        { id: "log-135", user: "Alex Rivera", action: "created task", timestamp: "Aug 6, 1:00 PM" }
      ]
    },

    // --- 5 IN PROGRESS TASKS (1% - 99% Progress) ---
    {
      id: "tsk-018",
      title: "Task Board Filtering & Multi-Search Bar",
      description: "Implement multi-criteria filtering by status, member assignee, priority, and keyword search string.",
      assigneeId: "usr-102", // Sophia Chen
      priority: "high",
      status: "in_progress",
      progress: 75,
      dueDate: "2026-08-13",
      createdAt: "2026-08-08T09:30:00Z",
      updatedAt: "2026-08-11T01:15:00Z",
      activityLog: [
        { id: "log-136", user: "Sophia Chen", action: "updated progress to 75%", timestamp: "Today at 1:15 AM" },
        { id: "log-137", user: "Sophia Chen", action: "connected priority filter logic", timestamp: "Yesterday at 4:30 PM" },
        { id: "log-138", user: "Alex Rivera", action: "created task", timestamp: "Aug 8, 9:30 AM" }
      ]
    },
    {
      id: "tsk-019",
      title: "Task Row Action Dropdown & Role Security",
      description: "Add per-task action menus restricting deletion and reassignment to leaders while members update status.",
      assigneeId: "usr-103", // Marcus Vance
      priority: "high",
      status: "in_progress",
      progress: 60,
      dueDate: "2026-08-14",
      createdAt: "2026-08-08T11:00:00Z",
      updatedAt: "2026-08-10T18:40:00Z",
      activityLog: [
        { id: "log-139", user: "Marcus Vance", action: "updated progress to 60%", timestamp: "Aug 10, 6:40 PM" },
        { id: "log-140", user: "Marcus Vance", action: "added role restriction gate", timestamp: "Aug 9, 2:10 PM" },
        { id: "log-141", user: "Alex Rivera", action: "created task", timestamp: "Aug 8, 11:00 AM" }
      ]
    },
    {
      id: "tsk-020",
      title: "Add & Edit Task Modal Form with Validation",
      description: "Create dual-mode modal component supporting task creation for leaders and full field editing.",
      assigneeId: "usr-104", // Elena Rostova
      priority: "medium",
      status: "in_progress",
      progress: 45,
      dueDate: "2026-08-14",
      createdAt: "2026-08-08T13:15:00Z",
      updatedAt: "2026-08-10T16:00:00Z",
      activityLog: [
        { id: "log-142", user: "Elena Rostova", action: "updated progress to 45%", timestamp: "Aug 10, 4:00 PM" },
        { id: "log-143", user: "Alex Rivera", action: "created task", timestamp: "Aug 8, 1:15 PM" }
      ]
    },
    {
      id: "tsk-021",
      title: "Task Detail View with Activity Timeline",
      description: "Display complete task metadata, interactive progress slider, and scoped revision history logs.",
      assigneeId: "usr-105", // Liam Thorne
      priority: "medium",
      status: "in_progress",
      progress: 30,
      dueDate: "2026-08-15",
      createdAt: "2026-08-09T10:00:00Z",
      updatedAt: "2026-08-10T14:20:00Z",
      activityLog: [
        { id: "log-144", user: "Liam Thorne", action: "updated progress to 30%", timestamp: "Aug 10, 2:20 PM" },
        { id: "log-145", user: "Alex Rivera", action: "created task", timestamp: "Aug 9, 10:00 AM" }
      ]
    },
    {
      id: "tsk-022",
      title: "Responsive Task Table & Pagination Controls",
      description: "Ensure smooth scrolling and pagination handling for high task volume across mobile and desktop devices.",
      assigneeId: "usr-106", // Maya Lin
      priority: "low",
      status: "in_progress",
      progress: 50,
      dueDate: "2026-08-15",
      createdAt: "2026-08-09T14:30:00Z",
      updatedAt: "2026-08-10T19:00:00Z",
      activityLog: [
        { id: "log-146", user: "Maya Lin", action: "updated progress to 50%", timestamp: "Aug 10, 7:00 PM" },
        { id: "log-147", user: "Alex Rivera", action: "created task", timestamp: "Aug 9, 2:30 PM" }
      ]
    },

    // --- 3 NOT STARTED / PENDING TASKS (0% Progress) ---
    {
      id: "tsk-023",
      title: "FastAPI REST API & JWT Auth Integration",
      description: "Wire React frontend services to FastAPI backend endpoints for persistent task CRUD operations.",
      assigneeId: "usr-103", // Marcus Vance
      priority: "high",
      status: "not_started",
      progress: 0,
      dueDate: "2026-08-18",
      createdAt: "2026-08-10T11:00:00Z",
      updatedAt: "2026-08-10T11:00:00Z",
      activityLog: [
        { id: "log-148", user: "Alex Rivera", action: "created task and placed in triage backlog", timestamp: "Aug 10, 11:00 AM" }
      ]
    },
    {
      id: "tsk-024",
      title: "WebSocket Real-Time Progress Broadcasting",
      description: "Broadcast live member task transitions and progress updates using WebSockets to connected peers.",
      assigneeId: "usr-105", // Liam Thorne
      priority: "medium",
      status: "not_started",
      progress: 0,
      dueDate: "2026-08-20",
      createdAt: "2026-08-10T12:30:00Z",
      updatedAt: "2026-08-10T12:30:00Z",
      activityLog: [
        { id: "log-149", user: "Alex Rivera", action: "created task", timestamp: "Aug 10, 12:30 PM" }
      ]
    },
    {
      id: "tsk-025",
      title: "Sprint Burndown & Analytics Export",
      description: "Generate downloadable PDF/CSV sprint velocity reports and cumulative flow diagrams for room owners.",
      assigneeId: "usr-105", // Liam Thorne
      priority: "low",
      status: "not_started",
      progress: 0,
      dueDate: "2026-08-22",
      createdAt: "2026-08-10T15:00:00Z",
      updatedAt: "2026-08-10T15:00:00Z",
      activityLog: [
        { id: "log-150", user: "Alex Rivera", action: "created task", timestamp: "Aug 10, 3:00 PM" }
      ]
    }
  ]
};
