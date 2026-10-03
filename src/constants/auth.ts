export const AUTH_PURPOSE = {
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
  CHANGE_INFO: 'ChangeInfo'
} as const;

export type AuthPurpose = typeof AUTH_PURPOSE[keyof typeof AUTH_PURPOSE];
