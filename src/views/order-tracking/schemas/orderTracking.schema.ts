import { z } from 'zod';

export function createOrderTrackingSchema(t: (key: string) => string) {
  return z.object({
    orderCode: z
      .string()
      .trim()
      .min(4, t('validation.orderCodeRequired')),
    phoneNumber: z
      .string()
      .trim()
      .regex(/^(0|\+84)[0-9]{8,11}$/, t('validation.phoneInvalid')),
  });
}

export type OrderTrackingFormValues = z.infer<
  ReturnType<typeof createOrderTrackingSchema>
>;
