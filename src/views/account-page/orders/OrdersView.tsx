'use client';

import AppPagination from '@/components/ui/app-pagination';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hook/useDebounce';
import { usePathname, useRouter } from '@/i18n/routing';
import { OrderDto, OrderSummaryDto } from '@/interface/order';
import { getErrorMessage } from '@/lib/helper';
import { AlertCircle, Loader2, RefreshCw, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import OrderCard from './components/OrderCard';
import OrderDetailView from './components/OrderDetailView';
import OrderEmptyState from './components/OrderEmptyState';
import OrderStatusTabs from './components/OrderStatusTabs';
import { OrderStatusTab } from './constants/order.constants';
import { orderService } from './services/order.service';

const PAGE_SIZE = 10;

export default function OrdersView() {
  const t = useTranslations('Account.orders');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedOrderCode = searchParams.get('orderCode');

  const [activeStatus, setActiveStatus] = useState<OrderStatusTab>('all');
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 350);
  const [page, setPage] = useState(1);

  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [summary, setSummary] = useState<OrderSummaryDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadNonce, setReloadNonce] = useState(0);

  const requestKey = `${activeStatus}:${debouncedKeyword}:${page}:${reloadNonce}`;
  const [settledKey, setSettledKey] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      orderService.getOrders({
        status: activeStatus,
        keyword: debouncedKeyword,
        page,
        pageSize: PAGE_SIZE,
      }),
      orderService.getOrderSummary(debouncedKeyword),
    ])
      .then(([listRes, summaryRes]) => {
        if (!isMounted) return;
        setOrders(listRes.items);
        setTotalPages(listRes.totalPages);
        setSummary(summaryRes);
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(getErrorMessage(err, t('loadFailed')));
        setOrders([]);
      })
      .finally(() => {
        if (isMounted) setSettledKey(requestKey);
      });

    return () => {
      isMounted = false;
    };
  }, [activeStatus, debouncedKeyword, page, requestKey, t]);

  const handleStatusChange = (status: OrderStatusTab) => {
    setActiveStatus(status);
    setPage(1);
  };

  const handleRetry = useCallback(() => {
    setReloadNonce((prev) => prev + 1);
  }, []);

  const handleSelectOrder = (order: OrderDto) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'orders');
    params.set('orderCode', order.orderCode);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleBackToList = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'orders');
    params.delete('orderCode');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (selectedOrderCode) {
    const initialOrder = orders.find((o) => o.orderCode === selectedOrderCode) ?? null;
    return (
      <OrderDetailView
        key={selectedOrderCode}
        orderCode={selectedOrderCode}
        initialOrder={initialOrder}
        onBack={handleBackToList}
        onOrderUpdated={handleRetry}
      />
    );
  }

  const isLoading = settledKey !== requestKey;

  return (
    <div className="rounded-xl border border-primary/15 bg-white shadow-[0_4px_24px_rgba(74,53,51,0.05)]">
      <div className="flex px-4 py-2 flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-outline-variant/30">
        <h2 className="text-base font-bold text-on-surface">
          {t('title')}
        </h2>

        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 text-on-surface-variant/70 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
            placeholder={t('searchPlaceholder')}
            className="h-8 pl-9 bg-surface-container-low/50 border-outline-variant/60 placeholder:text-on-surface-variant/45 focus-visible:border-primary"
          />
        </div>
      </div>
      <div className='flex flex-col gap-4 p-4'>
        <OrderStatusTabs
          activeStatus={activeStatus}
          summary={summary}
          onChange={handleStatusChange}
        />

        {isLoading && orders.length === 0 ? (
          <div className="flex items-center justify-center gap-2.5 py-14 text-sm text-on-surface-variant">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span>{t('loadingOrders')}</span>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-error/30 bg-error/5 p-6 flex flex-col items-center text-center gap-3">
            <AlertCircle className="h-6 w-6 text-error" />
            <p className="text-sm font-medium text-error">{error}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-1.5 rounded-xl border border-outline-variant/60 bg-white px-4 py-2 text-xs font-semibold text-on-surface hover:border-primary/40 hover:text-primary transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{t('retry')}</span>
            </button>
          </div>
        ) : orders.length === 0 ? (
          <OrderEmptyState />
        ) : (
          <div className="space-y-4">
            <div className={`space-y-3.5 transition-opacity ${isLoading ? 'opacity-60' : ''}`}>
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onSelectOrder={handleSelectOrder}
                />
              ))}
            </div>

            <AppPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              disabled={isLoading}
              className="pt-2"
            />
          </div>
        )}
      </div>
    </div>
  );
}
