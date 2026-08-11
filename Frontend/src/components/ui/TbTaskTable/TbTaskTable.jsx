import React, { useState } from 'react';
import DtCard from '../DtCard/DtCard';
import DtButton from '../DtButton/DtButton';
import TbDropdown from '../TbDropdown/TbDropdown';
import TbTaskRow from '../TbTaskRow/TbTaskRow';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  ListChecksIcon
} from '../../../assets/icons';
import './TbTaskTable.css';

export const TbTaskTable = ({
  tasks = [],
  members = [],
  currentUser = {},
  onViewDetails = () => {},
  onEditTask = () => {},
  onDeleteTask = () => {},
  onQuickStatusChange = () => {},
  onAddTaskClick = () => {},
  onResetFilters = () => {},
  isFilterActive = false,
  className = ''
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const isLeader = currentUser?.role === 'leader';

  // Helper map for member lookup by ID
  const memberMap = members.reduce((acc, m) => {
    acc[m.id] = m;
    return acc;
  }, {});

  // Pagination calculations
  const totalItems = tasks.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  
  // Safe page boundary
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const visibleTasks = tasks.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <DtCard className={`tb-task-table-container ${className}`} padding="none">
      {/* 1. Main Table or Empty State */}
      {tasks.length === 0 ? (
        <div className="tb-task-table__empty-state">
          <div className="tb-task-table__empty-icon-wrap">
            <ListChecksIcon size={36} color="var(--accent-primary)" />
          </div>

          <h3 className="tb-task-table__empty-title">
            {isFilterActive ? 'No Matching Tasks Found' : 'No Tasks Yet'}
          </h3>

          <p className="tb-task-table__empty-desc">
            {isFilterActive
              ? 'No tasks match your current filter and search criteria. Try clearing or modifying your filters.'
              : 'Your room does not have any sprint tasks yet. Get started by creating your team’s first task!'}
          </p>

          <div className="tb-task-table__empty-actions">
            {isFilterActive ? (
              <DtButton variant="outline" size="md" onClick={onResetFilters}>
                Clear All Filters
              </DtButton>
            ) : (
              isLeader && (
                <DtButton
                  variant="primary"
                  size="md"
                  icon={<PlusIcon size={16} />}
                  onClick={onAddTaskClick}
                >
                  Add First Task
                </DtButton>
              )
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="tb-task-table__scroll-wrap">
            <table className="tb-task-table">
              <thead className="tb-task-table__thead">
                <tr className="tb-task-table__head-row">
                  <th className="tb-task-table__th tb-task-table__th--title">Task</th>
                  <th className="tb-task-table__th tb-task-table__th--assignee">Assigned To</th>
                  <th className="tb-task-table__th tb-task-table__th--priority">Priority</th>
                  <th className="tb-task-table__th tb-task-table__th--status">Status</th>
                  <th className="tb-task-table__th tb-task-table__th--progress">Progress</th>
                  <th className="tb-task-table__th tb-task-table__th--due-date">Due Date</th>
                  <th className="tb-task-table__th tb-task-table__th--actions"></th>
                </tr>
              </thead>
              <tbody className="tb-task-table__body">
                {visibleTasks.map((task) => (
                  <TbTaskRow
                    key={task.id}
                    task={task}
                    assignee={memberMap[task.assigneeId]}
                    currentUser={currentUser}
                    onViewDetails={onViewDetails}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                    onQuickStatusChange={onQuickStatusChange}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* 2. Pagination Bar */}
          <div className="tb-task-table__pagination">
            {/* Desktop Pagination Counter */}
            <div className="tb-task-table__pagination-info tb-task-table__desktop-pagination">
              Showing <span className="tb-task-table__pagination-bold">{startIndex + 1}</span>–
              <span className="tb-task-table__pagination-bold">{endIndex}</span> of{' '}
              <span className="tb-task-table__pagination-bold">{totalItems}</span> tasks
            </div>

            <div className="tb-task-table__pagination-controls">
              {/* Desktop Page Size Selector */}
              <div className="tb-task-table__page-size tb-task-table__desktop-pagination">
                <span className="tb-task-table__page-size-label">Per page:</span>
                <TbDropdown
                  options={[
                    { value: 8, label: '8' },
                    { value: 15, label: '15' },
                    { value: 25, label: '25' }
                  ]}
                  value={pageSize}
                  onChange={(val) => {
                    setPageSize(Number(val));
                    setCurrentPage(1);
                  }}
                  size="sm"
                  className="tb-task-table__size-dropdown"
                />
              </div>

              {/* Prev Page Button */}
              <button
                type="button"
                className="tb-task-table__pagination-btn"
                onClick={() => handlePageChange(validCurrentPage - 1)}
                disabled={validCurrentPage <= 1}
                title="Previous Page"
                aria-label="Previous Page"
              >
                <ChevronLeftIcon size={16} />
              </button>

              {/* Mobile "Page X of Y" Label */}
              <span className="tb-task-table__mobile-page-indicator tb-task-table__mobile-pagination">
                Page&nbsp;<span className="tb-task-table__pagination-bold">{validCurrentPage}</span>&nbsp;of&nbsp;<span className="tb-task-table__pagination-bold">{totalPages}</span>
              </span>

              {/* Desktop Page Numbers */}
              <div className="tb-task-table__page-numbers tb-task-table__desktop-pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    className={`tb-task-table__page-num ${pageNum === validCurrentPage ? 'tb-task-table__page-num--active' : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              {/* Next Page Button */}
              <button
                type="button"
                className="tb-task-table__pagination-btn"
                onClick={() => handlePageChange(validCurrentPage + 1)}
                disabled={validCurrentPage >= totalPages}
                title="Next Page"
                aria-label="Next Page"
              >
                <ChevronRightIcon size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </DtCard>
  );
};

export default TbTaskTable;
