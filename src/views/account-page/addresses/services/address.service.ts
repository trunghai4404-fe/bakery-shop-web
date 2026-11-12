import { LocationApi } from '@/actions/location';
import { SavedAddress } from '@/interface/address';
import { District, Province, Ward } from '@/interface/location';
import { getAddressStorageKey } from '../constants/address.constants';

function persistAddresses(userId: string, list: SavedAddress[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(getAddressStorageKey(userId), JSON.stringify(list));
}

export const addressService = {
  getAll: (userId: string): SavedAddress[] => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(getAddressStorageKey(userId));
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  save: (
    userId: string,
    currentList: SavedAddress[],
    saved: SavedAddress
  ): SavedAddress[] => {
    const exists = currentList.some((a) => a.id === saved.id);
    const shouldBeDefault = saved.isDefault || currentList.length === 0;

    let updated = exists
      ? currentList.map((a) =>
          a.id === saved.id ? { ...saved, isDefault: shouldBeDefault } : a
        )
      : [...currentList, { ...saved, isDefault: shouldBeDefault }];

    if (shouldBeDefault) {
      updated = updated.map((a) => ({
        ...a,
        isDefault: a.id === saved.id,
      }));
    }

    persistAddresses(userId, updated);
    return updated;
  },

  remove: (
    userId: string,
    currentList: SavedAddress[],
    id: string
  ): SavedAddress[] => {
    const filtered = currentList.filter((a) => a.id !== id);
    if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
      filtered[0] = { ...filtered[0], isDefault: true };
    }
    persistAddresses(userId, filtered);
    return filtered;
  },

  setDefault: (
    userId: string,
    currentList: SavedAddress[],
    id: string
  ): SavedAddress[] => {
    const updated = currentList.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    persistAddresses(userId, updated);
    return updated;
  },
};

export const locationService = {
  getProvinces: async (): Promise<Province[]> => {
    const res = await LocationApi.getProvinces();
    return Array.isArray(res.data) ? res.data : [];
  },

  getDistricts: async (provinceId: number): Promise<District[]> => {
    const res = await LocationApi.getDistricts(provinceId);
    return Array.isArray(res.data) ? res.data : [];
  },

  getWards: async (districtId: number): Promise<Ward[]> => {
    const res = await LocationApi.getWards({ districtId });
    return Array.isArray(res.data) ? res.data : [];
  },
};

