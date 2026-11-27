'use client';

import { BasketItemDto } from '@/interface/basket';
import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface CartWarningsBannerProps {
  hasWarnings: boolean;
  items: BasketItemDto[];
  className?: string;
}

export default function CartWarningsBanner({
  hasWarnings,
  items,
  className = '',
}: CartWarningsBannerProps) {
  const t = useTranslations('Cart');

  const itemWarnings = items.flatMap((item) =>
    (item.warnings ?? []).map((warning, idx) => ({
      key: `${item.productId}-${item.variantId}-${warning.code}-${idx}`,
      productName: item.productName,
      variantName: item.variantName,
      code: warning.code,
      message: warning.message,
    }))
  );

  if (!hasWarnings && itemWarnings.length === 0) {
    return null;
  }

  return (
    <div
      role="alert"
      className={`rounded-xl border border-amber-300/80 bg-amber-50/90 px-4 py-3 text-amber-950 ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
        <div className="space-y-1 text-xs sm:text-sm">
          <p className="font-semibold text-amber-900">{t('warningsTitle')}</p>
          {itemWarnings.length > 0 ? (
            <ul className="list-disc space-y-0.5 pl-4 text-amber-800">
              {itemWarnings.map((warning) => (
                <li key={warning.key}>
                  <span className="font-medium">
                    {warning.productName}
                    {warning.variantName ? ` (${warning.variantName})` : ''}:
                  </span>{' '}
                  {warning.message}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-amber-800">{t('warningsFallback')}</p>
          )}
        </div>
      </div>
    </div>
  );
}

