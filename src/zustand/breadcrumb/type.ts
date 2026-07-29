export interface CrumbItem {
  name: string
  pathname: string
  subName?: string
  subPathName?: string
  childName?: string
}

export type BreadcrumbState = {
  crumb: CrumbItem
}

export type BreadcrumbActions = {
  setCrumb: (crumb: CrumbItem) => void
}
