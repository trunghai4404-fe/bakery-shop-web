export const ADDRESS_QUERY_STALE_TIME = 1000 * 60 * 60;

export const ADDRESS_LABEL_KEYS = [
  'labelHome',
  'labelWork',
  'labelOther',
] as const;

export const getAddressStorageKey = (userId: string) =>
  `bakery_user_addresses_${userId}`;

