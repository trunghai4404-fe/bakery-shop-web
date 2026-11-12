'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin, Plus } from 'lucide-react';

import { User } from '@/interface/auth';
import { SavedAddress } from '@/interface/address';
import { Button } from '@/components/ui/button';
import { showCustomToast } from '@/components/toast/CustomToast';
import AddressCard from './components/AddressCard';
import AddressFormModal from './components/AddressFormModal';
import { addressService } from './services/address.service';

interface AddressesViewProps {
  user: User;
  addresses: SavedAddress[];
  onAddressesChange: (next: SavedAddress[]) => void;
}

export default function AddressesView({
  user,
  addresses,
  onAddressesChange,
}: AddressesViewProps) {
  const t = useTranslations('Account.addresses');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr: SavedAddress) => {
    setEditingAddress(addr);
    setIsModalOpen(true);
  };

  const handleSaveAddress = (saved: SavedAddress) => {
    const updated = addressService.save(user.id, addresses, saved);
    onAddressesChange(updated);
    setIsModalOpen(false);
    setEditingAddress(null);
    showCustomToast({
      message: t('savedSuccess'),
      type: 'success',
    });
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addressService.remove(user.id, addresses, id);
    onAddressesChange(updated);
    showCustomToast({
      message: t('deletedSuccess'),
      type: 'success',
    });
  };

  const handleSetDefault = (id: string) => {
    const updated = addressService.setDefault(user.id, addresses, id);
    onAddressesChange(updated);
    showCustomToast({
      message: t('defaultSuccess'),
      type: 'success',
    });
  };

  return (
    <div className="rounded-3xl border border-primary/15 bg-white p-5 sm:p-7 shadow-[0_4px_24px_rgba(74,53,51,0.05)]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-outline-variant/25 pb-5 mb-6">
        <div>
          <h2 className="font-heading text-xl font-bold text-on-surface">
            {t('title')}
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">
            {t('description')}
          </p>
        </div>

        <Button
          type="button"
          onClick={handleOpenAdd}
          className="h-10 px-4 rounded-xl bg-primary text-white hover:bg-primary/90 font-bold cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>{t('addNew')}</span>
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-12 px-4 rounded-2xl bg-surface-container-low/60 border border-dashed border-outline-variant/60">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
            <MapPin className="h-6 w-6" />
          </div>
          <h3 className="font-heading text-base font-bold text-on-surface">
            {t('emptyTitle')}
          </h3>
          <p className="text-sm text-on-surface-variant max-w-md mt-1 mb-5">
            {t('emptyDesc')}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={handleOpenAdd}
            className="rounded-xl border-primary/40 text-primary hover:bg-primary/10 font-bold cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{t('addNew')}</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteAddress}
              onSetDefault={handleSetDefault}
            />
          ))}

          {/* Interactive Add New Dashed Bento Card */}
          <button
            type="button"
            onClick={handleOpenAdd}
            className="group min-h-42 rounded-2xl border-2 border-dashed border-outline-variant/55 bg-surface-container-low/30 hover:bg-rose-pale/25 hover:border-primary/50 p-5 flex flex-col items-center justify-center text-center transition-all cursor-pointer"
          >
            <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-colors mb-2.5">
              <Plus className="h-5 w-5" />
            </div>
            <span className="font-heading font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
              {t('addCardTitle')}
            </span>
            <span className="text-xs text-on-surface-variant mt-1 max-w-52">
              {t('addCardSubtitle')}
            </span>
          </button>
        </div>
      )}

      <AddressFormModal
        isOpen={isModalOpen}
        editingAddress={editingAddress}
        defaultRecipientName={user.fullName}
        defaultPhone={user.phoneNumber}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAddress(null);
        }}
        onSave={handleSaveAddress}
      />
    </div>
  );
}
