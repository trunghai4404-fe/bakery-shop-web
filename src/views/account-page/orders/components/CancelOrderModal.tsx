'use client';

import { showCustomToast } from '@/components/toast/CustomToast';
import { getErrorMessage } from '@/lib/helper';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, X, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { orderService } from '../services/order.service';

interface CancelOrderModalProps {
  orderCode: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancelled: () => void;
}

export default function CancelOrderModal({
  orderCode,
  open,
  onOpenChange,
  onCancelled,
}: CancelOrderModalProps) {
  const t = useTranslations('Account.orders');
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  const handleClose = () => {
    if (isCancelling) return;
    onOpenChange(false);
    setCancelReason('');
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isCancelling) {
        onOpenChange(false);
        setCancelReason('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, isCancelling, onOpenChange]);

  const handleConfirmCancel = async () => {
    const trimmed = cancelReason.trim();
    if (!trimmed) {
      showCustomToast({ message: t('cancelReasonRequired'), type: 'error' });
      return;
    }

    setIsCancelling(true);
    try {
      await orderService.cancelOrder(orderCode, { reason: trimmed });
      showCustomToast({ message: t('cancelSuccess'), type: 'success' });
      setCancelReason('');
      onOpenChange(false);
      onCancelled();
    } catch (err) {
      showCustomToast({
        message: getErrorMessage(err, t('cancelFailed')),
        type: 'error',
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-order-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={handleClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-xs p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl border border-outline-variant/40 bg-white p-5 sm:p-6 shadow-2xl space-y-4"
          >
            <button
              type="button"
              onClick={handleClose}
              disabled={isCancelling}
              aria-label={t('close')}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors cursor-pointer disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-1.5 pr-6">
              <h3
                id="cancel-order-modal-title"
                className="font-heading text-lg font-bold text-on-surface flex items-center gap-2"
              >
                <XCircle className="h-5 w-5 text-red-600 shrink-0" />
                <span>{t('cancelModalTitle')}</span>
              </h3>
              <p className="text-sm text-on-surface-variant">
                {t('cancelModalDesc', { orderCode })}
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-on-surface">
                {t('cancelReasonLabel')} <span className="text-error">*</span>
              </label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder={t('cancelReasonPlaceholder')}
                className="w-full rounded-xl border border-outline-variant/60 bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/45 focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleClose}
                className="rounded-xl border border-outline-variant/60 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-on-surface hover:bg-surface-container-low cursor-pointer disabled:opacity-60"
              >
                {t('close')}
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleConfirmCancel}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-xs sm:text-sm font-bold text-white cursor-pointer disabled:opacity-60"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{t('cancellingOrder')}</span>
                  </>
                ) : (
                  <span>{t('confirmCancelButton')}</span>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
