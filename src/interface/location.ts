export interface Province {
  id: number;
  name: string;
  fullName: string;
  divisionType: string;
  codename: string;
  phoneCode: number | null;
}

export interface District {
  id: number;
  provinceId: number;
  name: string;
  fullName: string;
  divisionType: string;
  codename: string;
}

export interface Ward {
  id: number;
  districtId: number;
  name: string;
  fullName: string;
  divisionType: string;
  codename: string;
}

