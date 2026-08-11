import React from 'react';
import TbSearchBar from '../TbSearchBar/TbSearchBar';
import TbDropdown from '../TbDropdown/TbDropdown';
import { CloseIcon } from '../../../assets/icons';
import './TbFilterBar.css';

export const TbFilterBar = ({
  searchQuery = '',
  onSearchChange = () => {},
  statusFilter = 'all',
  onStatusChange = () => {},
  memberFilter = 'all',
  onMemberChange = () => {},
  priorityFilter = 'all',
  onPriorityChange = () => {},
  sortBy = 'newest',
  onSortChange = () => {},
  members = [],
  totalCount = 0,
  filteredCount = 0,
  onResetFilters = () => {},
  className = ''
}) => {
  const isFilterActive =
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    memberFilter !== 'all' ||
    priorityFilter !== 'all' ||
    sortBy !== 'newest';

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'not_started', label: 'Not Started' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const memberOptions = [
    { value: 'all', label: 'All Members' },
    ...members.map((m) => ({
      value: m.id,
      label: m.name,
      badge: m.role === 'leader' ? 'Leader' : null
    }))
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Recently Created' },
    { value: 'oldest', label: 'Oldest Created' },
    { value: 'due_date', label: 'Due Date (Soonest)' },
    { value: 'priority', label: 'Priority (High → Low)' },
    { value: 'progress_desc', label: 'Progress (High → Low)' },
    { value: 'progress_asc', label: 'Progress (Low → High)' },
  ];

  return (
    <div className={`tb-filter-bar ${className}`}>
      {/* Top Search and Reset Actions Row */}
      <div className="tb-filter-bar__search-row">
        <div className="tb-filter-bar__search-wrapper">
          <TbSearchBar
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search tasks by name or description..."
          />
        </div>

        {/* Active Filter Reset Action */}
        {isFilterActive && (
          <button
            type="button"
            className="tb-filter-bar__reset-btn"
            onClick={onResetFilters}
            title="Reset all active filters"
          >
            <CloseIcon size={14} color="currentColor" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Custom Dropdown Filters & Sorting Controls */}
      <div className="tb-filter-bar__controls-row">
        <div className="tb-filter-bar__filters-group">
          {/* Status Dropdown */}
          <TbDropdown
            id="tb-filter-status"
            prefix="Status:"
            options={statusOptions}
            value={statusFilter}
            onChange={onStatusChange}
            size="sm"
            className="tb-filter-bar__dropdown"
          />

          {/* Member Dropdown */}
          <TbDropdown
            id="tb-filter-member"
            prefix="Assignee:"
            options={memberOptions}
            value={memberFilter}
            onChange={onMemberChange}
            size="sm"
            className="tb-filter-bar__dropdown tb-filter-bar__dropdown--member"
          />

          {/* Priority Dropdown */}
          <TbDropdown
            id="tb-filter-priority"
            prefix="Priority:"
            options={priorityOptions}
            value={priorityFilter}
            onChange={onPriorityChange}
            size="sm"
            className="tb-filter-bar__dropdown"
          />
        </div>

        {/* Right side: Sort and Results Counter */}
        <div className="tb-filter-bar__sort-group">
          <TbDropdown
            id="tb-sort-by"
            prefix="Sort by:"
            options={sortOptions}
            value={sortBy}
            onChange={onSortChange}
            size="sm"
            className="tb-filter-bar__dropdown tb-filter-bar__dropdown--sort"
          />

          <div className="tb-filter-bar__counter">
            Showing <span className="tb-filter-bar__counter-highlight">{filteredCount}</span> of {totalCount} tasks
          </div>
        </div>
      </div>
    </div>
  );
};

export default TbFilterBar;
