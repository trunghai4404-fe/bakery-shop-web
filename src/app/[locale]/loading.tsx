import ConcentricRingsLoader from '@/components/ui/loading-animation-1';

export default function GlobalLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-9999 flex items-center justify-center backdrop-blur-sm transition-all duration-200"
    >
      <div className="animate-in fade-in zoom-in-95 duration-200">
        <ConcentricRingsLoader size={120} color="#A83B55" showText={false} />
      </div>
    </div>
  );
}

