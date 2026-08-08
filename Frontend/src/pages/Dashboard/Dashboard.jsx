import React from 'react';
import Card from '../../components/ui/Card/Card';
import Button from '../../components/ui/Button/Button';
import ProgressRing from '../../components/ui/ProgressRing/ProgressRing';
import ProgressBar from '../../components/ui/ProgressBar/ProgressBar';
import StatCard from '../../components/ui/StatCard/StatCard';
import RoomCodeDisplay from '../../components/common/RoomCodeDisplay/RoomCodeDisplay';
import MemberCard from '../../components/common/MemberCard/MemberCard';
import ActivityItem from '../../components/common/ActivityItem/ActivityItem';
import {
  PlusIcon,
  UserPlusIcon,
  TasksIcon,
  ActivityIcon,
  MembersIcon,
  CheckCircleIcon,
  ClockIcon,
  TrendingUpIcon,
  ArrowRightIcon,
  FolderIcon,
  ListChecksIcon,
  AlertCircleIcon
} from '../../assets/icons';
import './Dashboard.css';

export const Dashboard = ({
  data,
  onNavigate = () => {},
  onInviteClick = () => {}
}) => {
  const {
    room = {},
    currentUser = {},
    progressStats = {},
    statCards = [],
    statusSummary = {},
    members = [],
    recentActivities = []
  } = data || {};

  const isLeader = currentUser?.role === 'leader';

  const getStatIcon = (stat) => {
    if (stat.id === 'stat-total-tasks') {
      return <ListChecksIcon size={20} color="currentColor" />;
    }
    if (stat.id === 'stat-completed') {
      return <CheckCircleIcon size={20} color="currentColor" />;
    }
    if (stat.id === 'stat-pending') {
      return <AlertCircleIcon size={20} color="currentColor" />;
    }
    switch (stat.type) {
      case 'info': return <MembersIcon size={20} color="currentColor" />;
      case 'primary': return <ListChecksIcon size={20} color="currentColor" />;
      case 'success': return <CheckCircleIcon size={20} color="currentColor" />;
      case 'warning': return <ClockIcon size={20} color="currentColor" />;
      case 'danger': return <AlertCircleIcon size={20} color="currentColor" />;
      case 'muted': return <FolderIcon size={20} color="currentColor" />;
      default: return <ActivityIcon size={20} color="currentColor" />;
    }
  };

  return (
    <div className="dt-dashboard">
      {/* SECTION 1: Room Information Card & Section 2: Overall Progress */}
      <div className="dt-dashboard__top-grid">
        {/* Room Info Card */}
        <Card className="dt-dashboard__room-card">
          <div className="dt-dashboard__room-header">
            <div className="dt-dashboard__room-title-group">
              <h2 className="dt-dashboard__room-name">{room.name}</h2>
              <p className="dt-dashboard__room-desc">{room.description}</p>
            </div>
          </div>
          <div className="dt-dashboard__room-footer">
            <RoomCodeDisplay
              code={room.code}
              onInviteClick={onInviteClick}
            />
          </div>
        </Card>

        {/* SECTION 2: Overall Project Progress */}
        <Card className="dt-dashboard__progress-card">
          <h3 className="dt-dashboard__section-title">Overall Progress</h3>
          
          <div className="dt-dashboard__progress-body">
            <div className="dt-dashboard__ring-container">
              <ProgressRing progress={progressStats.overallPercentage} size={130} strokeWidth={11}>
                <span className="dt-dashboard__ring-percent">{progressStats.overallPercentage}%</span>
                <span className="dt-dashboard__ring-label">Completed</span>
              </ProgressRing>
            </div>

            <div className="dt-dashboard__progress-details">
              <div className="dt-dashboard__progress-metrics">
                <div className="dt-dashboard__metric">
                  <span className="dt-dashboard__metric-val dt-dashboard__metric-val--success">
                    {progressStats.completedCount}
                  </span>
                  <span className="dt-dashboard__metric-lbl">Completed</span>
                </div>
                <div className="dt-dashboard__metric-divider" />
                <div className="dt-dashboard__metric">
                  <span className="dt-dashboard__metric-val dt-dashboard__metric-val--warning">
                    {progressStats.remainingCount}
                  </span>
                  <span className="dt-dashboard__metric-lbl">Remaining</span>
                </div>
                <div className="dt-dashboard__metric-divider" />
                <div className="dt-dashboard__metric">
                  <span className="dt-dashboard__metric-val">
                    {progressStats.totalCount}
                  </span>
                  <span className="dt-dashboard__metric-lbl">Total Tasks</span>
                </div>
              </div>

              <div className="dt-dashboard__bar-wrapper">
                <ProgressBar progress={progressStats.overallPercentage} height={8} />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* SECTION 4: Project Statistics (Stat Cards Row) */}
      <div className="dt-dashboard__section">
        <div className="dt-dashboard__section-header">
          <h3 className="dt-dashboard__section-title">Project Overview</h3>
          <span className="dt-dashboard__section-subtitle">Real-time room analytics</span>
        </div>
        <div className="dt-dashboard__stats-grid">
          {statCards.map((stat) => (
            <StatCard
              key={stat.id}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              type={stat.type}
              change={stat.change}
              icon={getStatIcon(stat)}
            />
          ))}
        </div>
      </div>

      {/* SECTION 7: Project Status Summary Strip */}
      <Card className="dt-dashboard__summary-strip" padding="compact">
        <div className="dt-dashboard__summary-item">
          <TrendingUpIcon size={18} color="var(--accent-primary)" />
          <span className="dt-dashboard__summary-text">
            Project Completion Rate: <strong>{statusSummary.completionPercentage}%</strong>
          </span>
        </div>
        <div className="dt-dashboard__summary-dot" />
        <div className="dt-dashboard__summary-item">
          <MembersIcon size={18} color="var(--info)" />
          <span className="dt-dashboard__summary-text">
            Active Contributors: <strong>{statusSummary.activeMembersCount} Members</strong>
          </span>
        </div>
        <div className="dt-dashboard__summary-dot" />
        <div className="dt-dashboard__summary-item">
          <ClockIcon size={18} color="var(--warning)" />
          <span className="dt-dashboard__summary-text">
            Tasks Due Soon: <strong>{statusSummary.tasksDueSoonCount} Tasks</strong>
          </span>
        </div>
      </Card>

      {/* SECTION 6: Quick Actions Row */}
      <div className="dt-dashboard__section">
        <div className="dt-dashboard__section-header">
          <h3 className="dt-dashboard__section-title">Quick Actions</h3>
        </div>
        <div className="dt-dashboard__quick-actions">
          {/* Create New Task (Visible ONLY if current user role === 'leader') */}
          {isLeader && (
            <button
              type="button"
              className="dt-quick-action-card dt-quick-action-card--primary"
              onClick={() => onNavigate('tasks')}
            >
              <div className="dt-quick-action-card__icon dt-quick-action-card__icon--primary">
                <PlusIcon size={22} />
              </div>
              <div className="dt-quick-action-card__text">
                <span className="dt-quick-action-card__title">Create New Task</span>
                <span className="dt-quick-action-card__sub">Leader Action</span>
              </div>
            </button>
          )}

          <button
            type="button"
            className="dt-quick-action-card dt-quick-action-card--info"
            onClick={onInviteClick}
          >
            <div className="dt-quick-action-card__icon dt-quick-action-card__icon--info">
              <UserPlusIcon size={22} />
            </div>
            <div className="dt-quick-action-card__text">
              <span className="dt-quick-action-card__title">Invite Member</span>
              <span className="dt-quick-action-card__sub">Share Code</span>
            </div>
          </button>

          <button
            type="button"
            className="dt-quick-action-card dt-quick-action-card--success"
            onClick={() => onNavigate('tasks')}
          >
            <div className="dt-quick-action-card__icon dt-quick-action-card__icon--success">
              <TasksIcon size={22} />
            </div>
            <div className="dt-quick-action-card__text">
              <span className="dt-quick-action-card__title">View All Tasks</span>
              <span className="dt-quick-action-card__sub">Task Board</span>
            </div>
          </button>

          <button
            type="button"
            className="dt-quick-action-card dt-quick-action-card--warning"
            onClick={() => onNavigate('activity')}
          >
            <div className="dt-quick-action-card__icon dt-quick-action-card__icon--warning">
              <ActivityIcon size={22} />
            </div>
            <div className="dt-quick-action-card__text">
              <span className="dt-quick-action-card__title">View Activity Log</span>
              <span className="dt-quick-action-card__sub">Audit Stream</span>
            </div>
          </button>
        </div>
      </div>

      {/* Grid Row: Team Members Overview & Recent Activity */}
      <div className="dt-dashboard__bottom-grid">
        {/* SECTION 3: Team Members Overview */}
        <div className="dt-dashboard__members-section">
          <div className="dt-dashboard__section-header">
            <h3 className="dt-dashboard__section-title">Team Members ({members.length})</h3>
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowRightIcon size={16} />}
              iconPosition="right"
              onClick={() => onNavigate('members')}
            >
              View All
            </Button>
          </div>

          <div className="dt-dashboard__members-grid">
            {members.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>

        {/* SECTION 5: Recent Activity Preview */}
        <Card className="dt-dashboard__activity-card">
          <div className="dt-dashboard__section-header">
            <h3 className="dt-dashboard__section-title">Recent Activity</h3>
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowRightIcon size={16} />}
              iconPosition="right"
              onClick={() => onNavigate('activity')}
            >
              View All
            </Button>
          </div>

          <div className="dt-dashboard__activity-list">
            {recentActivities.slice(0, 5).map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
