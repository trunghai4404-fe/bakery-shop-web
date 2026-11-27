import { z } from 'zod';

export function createCheckoutSchema(t: (key: string) => string) {
  return z
    .object({
      fulfillmentType: z.enum(['Pickup', 'Delivery']),
      storeId: z.number().int().positive(t('validation.storeRequired')),
      customerName: z.string().trim().min(2, t('validation.nameRequired')),
      customerPhone: z
        .string()
        .trim()
        .regex(/^(0|\+84)[0-9]{8,11}$/, t('validation.phoneInvalid')),
      customerEmail: z
        .string()
        .trim()
        .refine(
          (val) => val === '' || z.email().safeParse(val).success,
          t('validation.emailInvalid')
        ),
      shippingMethod: z.string().optional(),
      paymentMethod: z.string().min(1),
      provinceId: z.number(),
      wardId: z.number(),
      address: z.string().trim(),
      latitude: z.number().nullable().optional(),
      longitude: z.number().nullable().optional(),
      note: z.string().max(500, t('validation.noteMax')).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.fulfillmentType !== 'Delivery') return;

      if (!data.provinceId || data.provinceId <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['provinceId'],
          message: t('validation.provinceRequired'),
        });
      }
      if (!data.wardId || data.wardId <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['wardId'],
          message: t('validation.wardRequired'),
        });
      }
      if (!data.address || data.address.trim().length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['address'],
          message: t('validation.addressRequired'),
        });
      }
    });
}

export type CheckoutFormValues = z.infer<ReturnType<typeof createCheckoutSchema>>;
