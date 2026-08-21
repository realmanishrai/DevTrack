// src/utils/mbMockData.js

// Mock data for the Team Members feature.

// TEMPORARY: replace with real API responses once backend endpoints are confirmed.

export const ROLE_OPTIONS = [
  'Project Admin',
  'Member',
];

export const mockCurrentUser = {
  id: 'usr-101',
  username: 'sakshi.verma',
  name: 'Sakshi Verma',
  role: 'Project Admin',
  isAdmin: true,
};

export const mockMembers = [
  {
    id: 'usr-101',
    name: 'Sakshi Verma',
    username: 'sakshi.verma',
    avatar: null,
    role: 'Project Admin',
    joinedOn: '2026-05-12',
    lastSeen: 'Today, 7:40 PM',
  },
  {
    id: 'usr-102',
    name: 'Rahul Sharma',
    username: 'rahul.sharma',
    avatar: null,
    role: 'Member',
    joinedOn: '2026-06-14',
    lastSeen: 'Today, 7:32 PM',
  },
  {
    id: 'usr-103',
    name: 'Ananya Singh',
    username: 'ananya.singh',
    avatar: null,
    role: 'Member',
    joinedOn: '2026-07-05',
    lastSeen: 'Today, 5:18 PM',
  },
  {
    id: 'usr-104',
    name: 'Vikram Patel',
    username: 'vikram.patel',
    avatar: null,
    role: 'Member',
    joinedOn: '2026-07-22',
    lastSeen: 'Yesterday, 9:14 PM',
  },
  {
    id: 'usr-105',
    name: 'Neha Verma',
    username: 'neha.verma',
    avatar: null,
    role: 'Member',
    joinedOn: '2026-08-03',
    lastSeen: 'Aug 18, 2026',
  },
];

export const mockPendingRequests = [
  {
    id: 'req-201',
    name: 'Aditi Sharma',
    username: 'aditi.sharma',
    avatar: null,
    requestedRole: 'Member',
    requestedAt: '2026-08-21T10:00:00Z',
  },
  {
    id: 'req-202',
    name: 'Rohan Kumar',
    username: 'rohan.kumar',
    avatar: null,
    requestedRole: 'Member',
    requestedAt: '2026-08-20T07:00:00Z',
  },
];