import React from 'react';

type SQLLevel = 'free' | 'basic' | 'premium' | 'enterprise';

interface SQLBadgeProps {
  level: SQLLevel;
}

const levelColors: Record<SQLLevel, { bg: string; text: string }> = {
  free: { bg: 'bg-gray-100', text: 'text-gray-800' },
  basic: { bg: 'bg-blue-100', text: 'text-blue-800' },
  premium: { bg: 'bg-purple-100', text: 'text-purple-800' },
  enterprise: { bg: 'bg-green-100', text: 'text-green-800' },
};

export default function SQLBadge({ level }: SQLBadgeProps) {
  const colors = levelColors[level];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
    >
      SQL {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
}
