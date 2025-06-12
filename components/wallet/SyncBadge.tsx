import React from 'react';

interface SyncBadgeProps {
  status: 'synced' | 'in-progress' | 'error';
}

export default function SyncBadge({ status }: SyncBadgeProps) {
  let color = 'bg-gray-200 text-gray-700';
  let label = 'Unknown';
  if (status === 'synced') {
    color = 'bg-green-100 text-green-700';
    label = 'Synced';
  } else if (status === 'in-progress') {
    color = 'bg-yellow-100 text-yellow-700';
    label = 'Syncing...';
  } else if (status === 'error') {
    color = 'bg-red-100 text-red-700';
    label = 'Sync Error';
  }
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
      {label}
    </span>
  );
}
