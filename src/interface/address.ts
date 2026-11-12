export interface SavedAddress {
  id: string;
  label?: string;
  recipientName: string;
  phoneNumber: string;
  address: string;
  provinceId: number;
  provinceName: string;
  districtId: number;
  districtName: string;
  wardId: number;
  wardName: string;
  latitude?: number | null;
  longitude?: number | null;
  isDefault: boolean;
}

