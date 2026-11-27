'use client';

import CartDrawer from '@/components/cart/CartDrawer';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { initBasketThunk } from '@/redux/store/slices/cart/cart.action';
import { useEffect, useRef } from 'react';

export default function BasketManager() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id ?? null);
  const authLoading = useAppSelector((state) => state.auth.loading);
  const lastSyncedUserKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    const userKey = userId ? `user:${userId}` : 'guest';
    if (lastSyncedUserKeyRef.current === userKey) return;

    lastSyncedUserKeyRef.current = userKey;
    dispatch(initBasketThunk());
  }, [dispatch, userId, authLoading]);

  return <CartDrawer />;
}

