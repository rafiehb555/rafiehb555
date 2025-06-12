export type UserRole = 'admin' | 'shopkeeper' | 'verifier' | 'customer';

export interface Permission {
  action: string;
  resource: string;
}

export const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [{ action: 'manage', resource: 'all' }],
  shopkeeper: [
    { action: 'read', resource: 'products' },
    { action: 'write', resource: 'products' },
    { action: 'read', resource: 'orders' },
    { action: 'write', resource: 'orders' },
    { action: 'read', resource: 'wallet' },
  ],
  verifier: [
    { action: 'read', resource: 'kyc' },
    { action: 'write', resource: 'kyc' },
    { action: 'read', resource: 'documents' },
    { action: 'write', resource: 'documents' },
  ],
  customer: [
    { action: 'read', resource: 'products' },
    { action: 'read', resource: 'orders' },
    { action: 'read', resource: 'wallet' },
    { action: 'write', resource: 'orders' },
  ],
};

export function hasPermission(userRole: UserRole, action: string, resource: string): boolean {
  const permissions = rolePermissions[userRole];
  if (!permissions) return false;

  return permissions.some(
    permission =>
      (permission.action === action || permission.action === 'manage') &&
      (permission.resource === resource || permission.resource === 'all')
  );
}

export function getRolePermissions(userRole: UserRole): Permission[] {
  return rolePermissions[userRole] || [];
}

export function isAdmin(userRole: UserRole): boolean {
  return userRole === 'admin';
}

export function isShopkeeper(userRole: UserRole): boolean {
  return userRole === 'shopkeeper';
}

export function isVerifier(userRole: UserRole): boolean {
  return userRole === 'verifier';
}

export function isCustomer(userRole: UserRole): boolean {
  return userRole === 'customer';
}
