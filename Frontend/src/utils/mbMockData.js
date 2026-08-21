// src/utils/mbMockData.js
// Mock data for the Team Members feature.
// TEMPORARY: replace with real API responses once backend endpoints are confirmed.

export const ROLE_OPTIONS = [
  'Project Admin',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'UI/UX Designer',
  'QA / Tester',
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
  { id: 'usr-101', name: 'Sakshi Verma', username: 'sakshi.verma', avatar: null, role: 'Project Admin', joinedOn: '2024-05-12', status: 'active' },
  { id: 'usr-102', name: 'Rahul Sharma', username: 'rahul.sharma', avatar: null, role: 'Frontend Developer', joinedOn: '2024-05-14', status: 'active' },
  { id: 'usr-103', name: 'Ananya Singh', username: 'ananya.singh', avatar: null, role: 'Backend Developer', joinedOn: '2024-05-15', status: 'active' },
  { id: 'usr-104', name: 'Vikram Patel', username: 'vikram.patel', avatar: null, role: 'Full Stack Developer', joinedOn: '2024-05-16', status: 'active' },
  { id: 'usr-105', name: 'Neha Verma', username: 'neha.verma', avatar: null, role: 'UI/UX Designer', joinedOn: '2024-05-17', status: 'active' },
];

export const mockPendingRequests = [
  { id: 'req-201', name: 'Aditi Sharma', username: 'aditi.sharma', avatar: null, requestedRole: 'Frontend Developer', requestedAt: '2024-05-20T10:00:00Z' },
  { id: 'req-202', name: 'Rohan Kumar', username: 'rohan.kumar', avatar: null, requestedRole: 'Backend Developer', requestedAt: '2024-05-20T07:00:00Z' },
];