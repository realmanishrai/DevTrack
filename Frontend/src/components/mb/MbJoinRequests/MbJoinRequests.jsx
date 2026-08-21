import React from 'react';
import DtCard from '../../ui/DtCard/DtCard';
import MbJoinRequestRow from '../MbJoinRequestRow/MbJoinRequestRow';
import './MbJoinRequests.css';

export const MbJoinRequests = ({ requests = [], onAccept, onReject }) => {
  return (
    <DtCard className="mb-join-requests">
      <div className="mb-join-requests__header">
        <h2 className="mb-join-requests__title">Pending Join Requests</h2>
        <span className="mb-join-requests__badge">{requests.length}</span>
      </div>

      <div className="mb-join-requests__list">
        {requests.map((request) => (
          <MbJoinRequestRow
            key={request.id}
            request={request}
            onAccept={onAccept}
            onReject={onReject}
          />
        ))}
      </div>
    </DtCard>
  );
};

export default MbJoinRequests;
