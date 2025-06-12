import { Intent } from './intentRouter';

interface ServiceMap {
  route: string;
  filters: Record<string, any>;
  actions: Record<string, any>;
  discounts: {
    loyalty: number;
    sql: number;
  };
}

export async function getServiceMap(intent: Intent): Promise<ServiceMap> {
  const baseMap: ServiceMap = {
    route: '/',
    filters: {},
    actions: {},
    discounts: {
      loyalty: 0,
      sql: 0,
    },
  };

  switch (intent.type) {
    case 'education':
      return {
        ...baseMap,
        route: '/edr',
        filters: {
          page: 'tutors',
          ...intent.filters,
        },
        actions: {
          ...intent.actions,
          modal: intent.actions?.book ? 'booking' : undefined,
        },
        discounts: {
          loyalty: 1.1, // 1.1% for coin lock
          sql: 0.5, // 0.5% for SQL level
        },
      };

    case 'health':
      return {
        ...baseMap,
        route: '/emo',
        filters: {
          page: 'doctors',
          ...intent.filters,
        },
        actions: {
          ...intent.actions,
          modal: intent.actions?.book ? 'appointment' : undefined,
        },
        discounts: {
          loyalty: 1.2, // 1.2% for coin lock
          sql: 0.8, // 0.8% for SQL level
        },
      };

    case 'shopping':
      return {
        ...baseMap,
        route: '/gosellr',
        filters: {
          page: 'products',
          ...intent.filters,
        },
        actions: {
          ...intent.actions,
          modal: intent.actions?.book ? 'cart' : undefined,
        },
        discounts: {
          loyalty: 1.5, // 1.5% for coin lock
          sql: 1.0, // 1.0% for SQL level
        },
      };

    case 'wallet':
      return {
        ...baseMap,
        route: '/wallet',
        filters: {
          page: 'overview',
        },
        actions: {
          ...intent.actions,
        },
        discounts: {
          loyalty: 0,
          sql: 0,
        },
      };

    case 'franchise':
      return {
        ...baseMap,
        route: '/franchise',
        filters: {
          page: 'apply',
        },
        actions: {
          ...intent.actions,
          modal: intent.actions?.apply ? 'application' : undefined,
        },
        discounts: {
          loyalty: 0,
          sql: 0,
        },
      };

    default:
      return baseMap;
  }
}
