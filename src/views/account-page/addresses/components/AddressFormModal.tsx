'use client';

import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';

import { SavedAddress } from '@/interface/address';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { showCustomToast } from '@/components/toast/CustomToast';
import { ADDRESS_LABEL_KEYS } from '../constants/address.constants';
import { useLocationOptions } from '../hooks/useLocationOptions';

interface AddressFormModalProps {
  isOpen: boolean;
  editingAddress: SavedAddress | null;
  defaultRecipientName?: string;
  defaultPhone?: string;
  onClose: () => void;
  onSave: (address: SavedAddress) => void;
}

export default function AddressFormModal({
  isOpen,
  editingAddress,
  defaultRecipientName = '',
  defaultPhone = '',
  onClose,
  onSave,
}: AddressFormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6">
        {isOpen && (
          <AddressFormModalBody
            key={editingAddress?.id ?? 'new'}
            editingAddress={editingAddress}
            defaultRecipientName={defaultRecipientName}
            defaultPhone={defaultPhone}
            onClose={onClose}
            onSave={onSave}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function AddressFormModalBody({
  editingAddress,
  defaultRecipientName,
  defaultPhone,
  onClose,
  onSave,
}: Omit<AddressFormModalProps, 'isOpen'>) {
  const t = useTranslations('Account.addresses');

  const [label, setLabel] = useState(editingAddress?.label ?? t('labelHome'));
  const [recipientName, setRecipientName] = useState(
    editingAddress?.recipientName ?? defaultRecipientName ?? ''
  );
  const [phoneNumber, setPhoneNumber] = useState(
    editingAddress?.phoneNumber ?? defaultPhone ?? ''
  );
  const [streetAddress, setStreetAddress] = useState(
    editingAddress?.address ?? ''
  );
  const [provinceId, setProvinceId] = useState<number | null>(
    editingAddress?.provinceId ?? null
  );
  const [districtId, setDistrictId] = useState<number | null>(
    editingAddress?.districtId ?? null
  );
  const [wardId, setWardId] = useState<number | null>(
    editingAddress?.wardId ?? null
  );
  const [isDefault, setIsDefault] = useState(
    editingAddress?.isDefault ?? false
  );

  const {
    provinces,
    loadingProvinces,
    districts,
    loadingDistricts,
    wards,
    loadingWards,
  } = useLocationOptions(provinceId, districtId);

  const provinceNameMap = useMemo(
    () => new Map(provinces.map((p) => [String(p.id), p.fullName || p.name])),
    [provinces]
  );
  const districtNameMap = useMemo(
    () => new Map(districts.map((d) => [String(d.id), d.fullName || d.name])),
    [districts]
  );
  const wardNameMap = useMemo(
    () => new Map(wards.map((w) => [String(w.id), w.fullName || w.name])),
    [wards]
  );

  const handleProvinceChange = (val: string | null) => {
    setProvinceId(val ? Number(val) : null);
    setDistrictId(null);
    setWardId(null);
  };

  const handleDistrictChange = (val: string | null) => {
    setDistrictId(val ? Number(val) : null);
    setWardId(null);
  };

  const handleWardChange = (val: string | null) => {
    setWardId(val ? Number(val) : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientName.trim() || !phoneNumber.trim() || !streetAddress.trim()) {
      showCustomToast({
        message: 'Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ chi tiết.',
        type: 'error',
      });
      return;
    }

    if (!provinceId || !districtId || !wardId) {
      showCustomToast({
        message: 'Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện và Phường/Xã.',
        type: 'error',
      });
      return;
    }

    const selectedProvince = provinces.find((p) => p.id === provinceId);
    const selectedDistrict = districts.find((d) => d.id === districtId);
    const selectedWard = wards.find((w) => w.id === wardId);

    const payload: SavedAddress = {
      id: editingAddress?.id ?? `addr_${Date.now()}`,
      label: label.trim() || undefined,
      recipientName: recipientName.trim(),
      phoneNumber: phoneNumber.trim(),
      address: streetAddress.trim(),
      provinceId,
      provinceName:
        selectedProvince?.fullName ||
        selectedProvince?.name ||
        editingAddress?.provinceName ||
        '',
      districtId,
      districtName:
        selectedDistrict?.fullName ||
        selectedDistrict?.name ||
        editingAddress?.districtName ||
        '',
      wardId,
      wardName:
        selectedWard?.fullName ||
        selectedWard?.name ||
        editingAddress?.wardName ||
        '',
      latitude: editingAddress?.latitude ?? null,
      longitude: editingAddress?.longitude ?? null,
      isDefault,
    };

    onSave(payload);
  };

  const quickLabels = ADDRESS_LABEL_KEYS.map((key) => t(key));

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-heading text-lg font-bold text-on-surface">
          {editingAddress ? t('editTitle') : t('addTitle')}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 mt-1">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            {t('label')}
          </label>
          <div className="flex flex-wrap gap-2">
            {quickLabels.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLabel(item)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  label === item
                    ? 'bg-primary/15 border-primary text-primary'
                    : 'bg-surface-container-low border-outline-variant/40 text-on-surface-variant hover:border-primary/40'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface">
              {t('recipientName')} <span className="text-error">*</span>
            </label>
            <Input
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder={t('recipientPlaceholder')}
              className="h-10 bg-surface-container-low/50 border-outline-variant/60"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface">
              {t('phoneNumber')} <span className="text-error">*</span>
            </label>
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder={t('phonePlaceholder')}
              className="h-10 bg-surface-container-low/50 border-outline-variant/60"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-on-surface">
            {t('province')} <span className="text-error">*</span>
          </label>
          <Select
            value={provinceId ? String(provinceId) : ''}
            onValueChange={handleProvinceChange}
            disabled={loadingProvinces}
          >
            <SelectTrigger className="w-full h-10 bg-surface-container-low/50 border-outline-variant/60">
              <SelectValue
                placeholder={loadingProvinces ? t('loadingLocations') : t('provincePlaceholder')}
              >
                {(val) =>
                  val
                    ? provinceNameMap.get(String(val)) ??
                      editingAddress?.provinceName ??
                      t('provincePlaceholder')
                    : loadingProvinces
                      ? t('loadingLocations')
                      : t('provincePlaceholder')
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-64 bg-surface-container-lowest">
              {provinces.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.fullName || p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface flex items-center gap-1.5">
              <span>{t('district')}</span>
              <span className="text-error">*</span>
              {loadingDistricts && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
            </label>
            <Select
              value={districtId ? String(districtId) : ''}
              onValueChange={handleDistrictChange}
              disabled={!provinceId || loadingDistricts}
            >
              <SelectTrigger className="w-full h-10 bg-surface-container-low/50 border-outline-variant/60">
                <SelectValue placeholder={t('districtPlaceholder')}>
                  {(val) =>
                    val
                      ? districtNameMap.get(String(val)) ??
                        editingAddress?.districtName ??
                        t('districtPlaceholder')
                      : t('districtPlaceholder')
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-64 bg-surface-container-lowest">
                {districts.map((d) => (
                  <SelectItem key={d.id} value={String(d.id)}>
                    {d.fullName || d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface flex items-center gap-1.5">
              <span>{t('ward')}</span>
              <span className="text-error">*</span>
              {loadingWards && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
            </label>
            <Select
              value={wardId ? String(wardId) : ''}
              onValueChange={handleWardChange}
              disabled={!districtId || loadingWards}
            >
              <SelectTrigger className="w-full h-10 bg-surface-container-low/50 border-outline-variant/60">
                <SelectValue placeholder={t('wardPlaceholder')}>
                  {(val) =>
                    val
                      ? wardNameMap.get(String(val)) ??
                        editingAddress?.wardName ??
                        t('wardPlaceholder')
                      : t('wardPlaceholder')
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-64 bg-surface-container-lowest">
                {wards.map((w) => (
                  <SelectItem key={w.id} value={String(w.id)}>
                    {w.fullName || w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-on-surface">
            {t('streetAddress')} <span className="text-error">*</span>
          </label>
          <Input
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            placeholder={t('streetPlaceholder')}
            className="h-10 bg-surface-container-low/50 border-outline-variant/60"
          />
        </div>

        <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
          <Checkbox
            checked={isDefault}
            onCheckedChange={(checked) => setIsDefault(Boolean(checked))}
          />
          <span className="text-sm font-medium text-on-surface">
            {t('isDefault')}
          </span>
        </label>

        <DialogFooter className="mt-4 bg-surface-container-low/60 border-outline-variant/30">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl cursor-pointer"
          >
            {t('cancel')}
          </Button>
          <Button
            type="submit"
            className="rounded-xl bg-primary text-white hover:bg-primary/90 font-bold cursor-pointer"
          >
            {t('save')}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

