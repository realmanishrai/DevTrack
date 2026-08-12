import React from 'react';
import DtCard from '../DtCard/DtCard';
import {
  ListChecksIcon,
  AlertCircleIcon,
  ClockIcon,
  CheckCircleIcon
} from '../../../assets/icons';
import './TbTaskStats.css';

export const TbTaskStats = ({
  tasks = [],
  activeFilter = 'all',
  onStatClick = () => {},
  className = ''
}) => {
  const total = tasks.length;
  const notStarted = tasks.filter((t) => t.status === 'not_started' || t.status === 'pending').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress' || t.status === 'inprogress').length;
  const completed = tasks.filter((t) => t.status === 'completed' || t.status === 'done').length;

  const stats = [
    {
      id: 'all',
      title: 'Total Tasks',
      value: total,
      subtitle: `${total} sprint items`,
      type: 'muted',
      icon: <ListChecksIcon size={20} color="currentColor" />
    },
    {
      id: 'not_started',
      title: 'Not Started',
      value: notStarted,
      subtitle: 'Awaiting execution',
      type: 'danger',
      icon: <AlertCircleIcon size={20} color="currentColor" />
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      value: inProgress,
      subtitle: 'Currently active',
      type: 'warning',
      icon: <ClockIcon size={20} color="currentColor" />
    },
    {
      id: 'completed',
      title: 'Completed',
      value: completed,
      subtitle: `${total > 0 ? Math.round((completed / total) * 100) : 0}% completion rate`,
      type: 'success',
      icon: <CheckCircleIcon size={20} color="currentColor" />
    }
  ];

  return (
    <div className={`tb-task-stats ${className}`}>
      {stats.map((stat) => {
        const isSelected = activeFilter === stat.id;
        return (
          <DtCard
            key={stat.id}
            className={`tb-task-stat-card tb-task-stat-card--${stat.type} ${isSelected ? 'tb-task-stat-card--selected' : ''}`}
            hoverable={false}
            onClick={() => onStatClick(stat.id)}
          >
            <div className="tb-task-stat-card__header">
              <span className="tb-task-stat-card__title">{stat.title}</span>
              <div className={`tb-task-stat-card__icon-box tb-task-stat-card__icon-box--${stat.type}`}>
                {stat.icon}
              </div>
            </div>
            <div className="tb-task-stat-card__body">
              <span className="tb-task-stat-card__value">{stat.value}</span>
              <span className="tb-task-stat-card__subtitle">{stat.subtitle}</span>
            </div>
          </DtCard>
        );
      })}
    </div>
  );
};

export default TbTaskStats;
