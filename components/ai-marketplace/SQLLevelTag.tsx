import React from 'react';

interface SQLLevelTagProps {
  level: string;
}

export default function SQLLevelTag({ level }: SQLLevelTagProps) {
  return (
    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
      SQL Level: {level}
    </span>
  );
}
