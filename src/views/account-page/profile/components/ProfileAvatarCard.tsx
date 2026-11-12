'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Award, Mail, Phone } from 'lucide-react';

import { User } from '@/interface/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ProfileAvatarCardProps {
  user: User;
}

export default function ProfileAvatarCard({ user }: ProfileAvatarCardProps) {
  const t = useTranslations('Account.profile');

  const initials = (user.fullName || user.email || 'U')
    .trim()
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="rounded-2xl bg-linear-to-b from-rose-pale/65 to-surface-container-low border border-outline-variant/30 p-5 flex flex-col items-center text-center">
      <Avatar className="h-22 w-22 rounded-2xl ring-4 ring-white shadow-sm mb-3.5">
        <AvatarImage
          src={user.avatar ?? ''}
          alt={user.fullName}
          className="rounded-2xl object-cover"
        />
        <AvatarFallback className="rounded-2xl bg-primary/15 text-primary font-heading font-bold text-2xl">
          {initials}
        </AvatarFallback>
      </Avatar>

      <h3 className="font-heading text-lg font-bold text-on-surface line-clamp-1">
        {user.fullName}
      </h3>

      <Badge className="mt-1.5 bg-white/85 text-on-primary-container border border-primary/25 font-semibold">
        <Award className="h-3 w-3 text-primary" />
        <span>{t('memberBadge')}</span>
      </Badge>

      <div className="w-full mt-5 pt-4 border-t border-outline-variant/25 space-y-2.5 text-left text-xs">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center gap-2 text-on-surface-variant">
          <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="truncate">
            {user.phoneNumber?.trim() || t('notProvided')}
          </span>
        </div>
      </div>
    </div>
  );
}
