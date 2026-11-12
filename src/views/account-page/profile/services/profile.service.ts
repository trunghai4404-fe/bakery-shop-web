import { UpdateProfile } from '@/interface/auth';
import { AppDispatch } from '@/redux/store/stores';
import { updateUserProfile } from '@/redux/store/slices/auth/auth.action';

export const profileService = {
  updateProfile: async (dispatch: AppDispatch, payload: UpdateProfile) => {
    return dispatch(updateUserProfile(payload));
  },
};
