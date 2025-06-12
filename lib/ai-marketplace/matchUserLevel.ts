import { SQLLevel } from '@/types/marketplace';

const sqlLevelHierarchy: Record<SQLLevel, number> = {
  free: 0,
  basic: 1,
  normal: 2,
  high: 3,
  vip: 4,
};

export function canAccessService(userLevel: SQLLevel, requiredLevel: SQLLevel): boolean {
  return sqlLevelHierarchy[userLevel] >= sqlLevelHierarchy[requiredLevel];
}

export function getNextLevel(currentLevel: SQLLevel): SQLLevel | null {
  const levels: SQLLevel[] = ['free', 'basic', 'normal', 'high', 'vip'];
  const currentIndex = levels.indexOf(currentLevel);

  if (currentIndex === -1 || currentIndex === levels.length - 1) {
    return null;
  }

  return levels[currentIndex + 1];
}
