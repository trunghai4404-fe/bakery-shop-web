'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import {
  Loader2,
  Mail,
  Pencil,
  Phone,
  Save,
  User as UserIcon,
  X,
} from 'lucide-react';

import { User } from '@/interface/auth';
import { useAppDispatch } from '@/redux/store/hooks';
import { showCustomToast } from '@/components/toast/CustomToast';
import { getErrorMessage } from '@/lib/helper';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProfileAvatarCard from './components/ProfileAvatarCard';
import {
  createProfileSchema,
  GENDER_OPTIONS,
  ProfileFormValues,
} from './constants/profile.constants';
import { profileService } from './services/profile.service';

interface ProfileViewProps {
  user: User;
}

export default function ProfileView({ user }: ProfileViewProps) {
  const t = useTranslations('Account.profile');
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const profileSchema = createProfileSchema((key) => t(key));

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user.fullName ?? '',
      phoneNumber: user.phoneNumber ?? '',
      sex: user.sex ?? 'Other',
    },
  });

  useEffect(() => {
    reset({
      fullName: user.fullName ?? '',
      phoneNumber: user.phoneNumber ?? '',
      sex: user.sex ?? 'Other',
    });
  }, [user, reset]);

  const currentSex = useWatch({ control, name: 'sex' });

  const handleCancelEdit = () => {
    reset({
      fullName: user.fullName ?? '',
      phoneNumber: user.phoneNumber ?? '',
      sex: user.sex ?? 'Other',
    });
    setIsEditing(false);
  };

  const onSubmit = async (values: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      await profileService.updateProfile(dispatch, {
        fullName: values.fullName,
        phoneNumber: values.phoneNumber || undefined,
        sex: values.sex,
      });
      showCustomToast({
        message: t('updateSuccess'),
        type: 'success',
      });
      setIsEditing(false);
    } catch (error) {
      showCustomToast({
        message: getErrorMessage(error),
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayGenderLabel =
    GENDER_OPTIONS.find((opt) => opt.value === (user.sex || 'Other'))
      ?.labelKey ?? 'sexOther';

  return (
    <div className="rounded-3xl border border-primary/15 bg-white p-5 sm:p-7 shadow-[0_4px_24px_rgba(74,53,51,0.05)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/25 pb-5 mb-6">
        <div>
          <h2 className="font-heading text-xl font-bold text-on-surface">
            {t('title')}
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">
            {t('description')}
          </p>
        </div>

        {!isEditing && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="h-9 px-4 rounded-xl border-primary/35 text-primary hover:bg-primary/10 font-bold cursor-pointer self-start sm:self-auto"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span>{t('edit')}</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-4">
          <ProfileAvatarCard user={user} />
        </div>

        <div className="md:col-span-8">
          {!isEditing ? (
            <div className="rounded-2xl border border-outline-variant/25 bg-surface-container-low/45 divide-y divide-outline-variant/20">
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
                  <UserIcon className="h-3.5 w-3.5 text-primary" />
                  {t('fullName')}
                </span>
                <span className="text-sm font-semibold text-on-surface">
                  {user.fullName || t('notProvided')}
                </span>
              </div>

              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  {t('email')}
                </span>
                <span className="text-sm font-semibold text-on-surface">
                  {user.email}
                </span>
              </div>

              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  {t('phoneNumber')}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    user.phoneNumber?.trim()
                      ? 'text-on-surface'
                      : 'text-on-surface-variant/70 italic'
                  }`}
                >
                  {user.phoneNumber?.trim() || t('notProvided')}
                </span>
              </div>

              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  {t('sex')}
                </span>
                <span className="text-sm font-semibold text-on-surface">
                  {t(displayGenderLabel)}
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-primary" />
                  <span>{t('fullName')}</span>
                </label>
                <Input
                  {...register('fullName')}
                  placeholder={t('fullNamePlaceholder')}
                  className="h-10 bg-surface-container-low/60 border-outline-variant/50 focus-visible:border-primary focus-visible:ring-primary/20"
                  aria-invalid={!!errors.fullName}
                />
                {errors.fullName && (
                  <p className="text-xs text-error font-medium">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>{t('email')}</span>
                </label>
                <Input
                  value={user.email ?? ''}
                  disabled
                  className="h-10 bg-surface-container/60 border-outline-variant/35 text-on-surface-variant cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{t('phoneNumber')}</span>
                </label>
                <Input
                  {...register('phoneNumber')}
                  placeholder={t('phonePlaceholder')}
                  className="h-10 bg-surface-container-low/60 border-outline-variant/50 focus-visible:border-primary focus-visible:ring-primary/20"
                  aria-invalid={!!errors.phoneNumber}
                />
                {errors.phoneNumber && (
                  <p className="text-xs text-error font-medium">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface block">
                  {t('sex')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {GENDER_OPTIONS.map((option) => {
                    const isSelected = currentSex === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setValue('sex', option.value, { shouldDirty: true })
                        }
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-primary/15 border-primary text-primary'
                            : 'bg-surface-container-low border-outline-variant/40 text-on-surface-variant hover:border-primary/40'
                        }`}
                      >
                        {t(option.labelKey)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  className="h-10 px-5 rounded-xl bg-primary text-white hover:bg-primary/90 font-bold cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{t('saving')}</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>{t('save')}</span>
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                  className="h-10 px-4 rounded-xl border-outline-variant/60 font-semibold cursor-pointer"
                >
                  <X className="h-4 w-4" />
                  <span>{t('cancel')}</span>
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
