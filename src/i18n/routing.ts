import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
  localePrefix: 'as-needed' // Or 'always' based on preference. 'as-needed' hides prefix for default locale
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
