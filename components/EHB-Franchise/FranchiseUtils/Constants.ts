export const FRANCHISE_CONSTANTS = {
  MAX_SUB_FRANCHISES_PER_MASTER: 25,
  MIN_SQL_FOR_MASTER: 8,
  MIN_SQL_FOR_CORPORATE: 9,
  UPGRADE_COOLDOWN_DAYS: 90,
  COMPLAINT_RESOLUTION_DEADLINE_HOURS: 24,
  MIN_DAILY_ORDERS_FOR_ACTIVE: 5,
  MAX_COMPLAINTS_BEFORE_REVIEW: 10,
  SERVICE_CATEGORIES: {
    GOSELLR: {
      name: 'GoSellr',
      minSQL: 1,
      maxSQL: 10,
    },
    HEALTH: {
      name: 'Health Services',
      minSQL: 7,
      maxSQL: 10,
    },
    LAW: {
      name: 'Legal Services',
      minSQL: 8,
      maxSQL: 10,
    },
    EDUCATION: {
      name: 'Education Services',
      minSQL: 6,
      maxSQL: 10,
    },
    TRAVEL: {
      name: 'Travel Services',
      minSQL: 5,
      maxSQL: 10,
    },
    BOOKS: {
      name: 'Book Services',
      minSQL: 4,
      maxSQL: 10,
    },
  },
  FRANCHISE_MODELS: {
    PRODUCT_SUPPLY: {
      name: 'Product Supply',
      minInventory: 100,
      minCategories: 3,
    },
    DELIVERY_NETWORK: {
      name: 'Delivery Network',
      minDeliveryPartners: 5,
      maxDeliveryTime: 120, // minutes
    },
    SERVICE_MANAGEMENT: {
      name: 'Service Management',
      minServiceProviders: 10,
      minServiceTypes: 5,
    },
  },
} as const;

export const AI_SEARCH_CONSTANTS = {
  MAX_RESULTS: 50,
  MIN_SEARCH_LENGTH: 3,
  SEARCH_DELAY_MS: 300,
  FILTER_OPTIONS: {
    LOCATION: 'location',
    CATEGORY: 'category',
    SQL: 'sql',
    TYPE: 'type',
    STATUS: 'status',
  },
} as const;

export const FRANCHISE_STATUS = {
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  SUSPENDED: 'SUSPENDED',
  UPGRADING: 'UPGRADING',
  REVIEW: 'REVIEW',
} as const;

export const FRANCHISE_TYPES = {
  SUB: 'Sub Franchise',
  MASTER: 'Master Franchise',
  CORPORATE: 'Corporate Franchise',
} as const;
