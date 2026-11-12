import { z } from 'zod';

export const GENDER_OPTIONS = [
  { value: 'Male', labelKey: 'sexMale' },
  { value: 'Female', labelKey: 'sexFemale' },
  { value: 'Other', labelKey: 'sexOther' },
] as const;

export const createProfileSchema = (t: (key: string) => string) =>
  z.object({
    fullName: z
      .string()
      .trim()
      .min(1, { message: t('fullNameRequired') })
      .min(2, { message: t('fullNameMin') }),
    phoneNumber: z
      .string()
      .trim()
      .refine((val) => val === '' || /^(0|\+84)[0-9]{8,10}$/.test(val), {
        message: t('phoneInvalid'),
      }),
    sex: z.string().optional(),
  });

export type ProfileFormValues = z.infer<ReturnType<typeof createProfileSchema>>;

