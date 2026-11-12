'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, MapPin, Pencil, Phone, Trash2 } from 'lucide-react';

import { SavedAddress } from '@/interface/address';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AddressCardProps {
  address: SavedAddress;
  onEdit: (address: SavedAddress) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) {
  const t = useTranslations('Account.addresses');

  const fullLocation = [
    address.address,
    address.wardName,
    address.districtName,
    address.provinceName,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div
      className={`group flex flex-col justify-between p-5 rounded-2xl border transition-all ${
        address.isDefault
          ? 'border-primary/50 bg-rose-pale/35 shadow-2xs'
          : 'border-outline-variant/35 bg-surface-container-low/45 hover:border-primary/35 hover:bg-surface-container-lowest'
      }`}
    >
      <div className="space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {address.label && (
              <Badge
                variant="secondary"
                className="bg-white/85 text-on-surface border border-outline-variant/40 font-semibold"
              >
                {address.label}
              </Badge>
            )}
            {address.isDefault && (
              <Badge className="bg-primary text-white border-none font-bold">
                <CheckCircle2 className="h-3 w-3" />
                <span>{t('defaultBadge')}</span>
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(address)}
              className="rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 cursor-pointer"
              title={t('edit')}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete(address.id)}
              className="rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 cursor-pointer"
              title={t('delete')}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <div className="font-heading font-bold text-base text-on-surface">
            {address.recipientName}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant">
            <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>{address.phoneNumber}</span>
          </div>
          <div className="flex items-start gap-1.5 text-xs sm:text-sm text-on-surface-variant leading-relaxed pt-0.5">
            <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-1" />
            <span>{fullLocation}</span>
          </div>
        </div>
      </div>

      {!address.isDefault && (
        <div className="pt-4 mt-4 border-t border-outline-variant/25">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onSetDefault(address.id)}
            className="w-full rounded-xl text-xs font-bold border-outline-variant/50 bg-white/70 hover:border-primary/45 hover:text-primary hover:bg-primary/5 cursor-pointer"
          >
            {t('setDefault')}
          </Button>
        </div>
      )}
    </div>
  );
}
