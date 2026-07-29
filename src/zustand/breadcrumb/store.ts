import { create } from 'zustand'
import { BreadcrumbActions, BreadcrumbState } from './type'

const initState: BreadcrumbState = {
  crumb: {
    name: '',
    pathname: '',
  }
}

export const useBreadcrumbStore = create<BreadcrumbState & BreadcrumbActions>(
  (set) => ({
    ...initState,
    setCrumb: (crumb) => set(() => ({ crumb }))
  })
)

export const selectBreadcrumb = (state: BreadcrumbState & BreadcrumbActions) =>
  state
