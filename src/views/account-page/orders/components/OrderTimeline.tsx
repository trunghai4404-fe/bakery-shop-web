'use client';

import { FulfillmentType } from '@/interface/basket';
import { OrderStatus } from '@/interface/order';
import {
  CheckCircle2,
  ChefHat,
  Clock,
  Package,
  PackageCheck,
  Truck,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  DELIVERY_ORDER_STEPS,
  ORDER_API_STATUS_TO_TAB,
  PICKUP_ORDER_STEPS,
} from '../constants/order.constants';

interface OrderTimelineProps {
  status: OrderStatus;
  fulfillmentType: FulfillmentType | string;
}

function getStepIcon(status: OrderStatus) {
  switch (status) {
    case 'Pending':
      return Clock;
    case 'Confirmed':
      return CheckCircle2;
    case 'Preparing':
      return ChefHat;
    case 'ReadyForPickup':
      return PackageCheck;
    case 'Shipping':
      return Truck;
    case 'Completed':
      return Package;
    default:
      return Clock;
  }
}

export default function OrderTimeline({
  status,
  fulfillmentType,
}: OrderTimelineProps) {
  const t = useTranslations('Account.orders');

  const steps =
    fulfillmentType === 'Pickup' ? PICKUP_ORDER_STEPS : DELIVERY_ORDER_STEPS;
  const activeStepIndex = steps.indexOf(status);

  const getStepLabel = (step: OrderStatus) => {
    const tab = ORDER_API_STATUS_TO_TAB[step];
    return tab ? t(`status.${tab}`) : step;
  };

  return (
    <div className="py-2">
      <div className="flex items-start justify-between">
        {steps.map((step, index) => {
          const Icon = getStepIcon(step);
          const isReached = activeStepIndex >= index;
          const isCurrent = activeStepIndex === index;
          const isLeftLineActive = activeStepIndex >= index;
          const isRightLineActive = activeStepIndex > index;

          return (
            <div
              key={step}
              className="relative flex-1 flex flex-col items-center"
            >
              {index > 0 && (
                <div
                  className={`pointer-events-none absolute z-0 top-5 left-0 right-[calc(50%+20px)] h-0.5 transition-colors ${
                    isLeftLineActive ? 'bg-primary' : 'bg-outline-variant/35'
                  }`}
                />
              )}

              {index < steps.length - 1 && (
                <div
                  className={`pointer-events-none absolute z-0 top-5 left-[calc(50%+20px)] right-0 h-0.5 transition-colors ${
                    isRightLineActive ? 'bg-primary' : 'bg-outline-variant/35'
                  }`}
                />
              )}

              <div className="relative z-10 flex items-center justify-center">
                {isCurrent && (
                  <span className="pointer-events-none absolute inset-0 rounded-full bg-primary/35 animate-ping" />
                )}
                <div
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                    isCurrent
                      ? 'border-primary bg-primary text-white ring-4 ring-primary/15'
                      : isReached
                        ? 'border-primary bg-white text-primary'
                        : 'border-outline-variant/45 bg-white text-on-surface-variant/40'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>

              <span
                className={`mt-2 px-1 text-center text-[11px] sm:text-xs leading-tight transition-colors ${
                  isCurrent
                    ? 'font-bold text-primary'
                    : isReached
                      ? 'font-semibold text-on-surface'
                      : 'font-medium text-on-surface-variant/45'
                }`}
              >
                {getStepLabel(step)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
