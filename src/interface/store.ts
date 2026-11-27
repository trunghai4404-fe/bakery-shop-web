export interface StoreDto {
  id: number;
  name: string;
  address: string;
  provinceId: number;
  wardId: number;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  email?: string | null;
  openingHours?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  lastModifiedAt?: string | null;
}

export interface StoreListParams {
  search?: string;
  provinceId?: number;
  wardId?: number;
  lat?: number;
  long?: number;
  radiusKm?: number;
  sortBy?: string;
  isDescending?: boolean;
  page?: number;
  pageSize?: number;
}

export interface StoreListResponse {
  items: StoreDto[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
