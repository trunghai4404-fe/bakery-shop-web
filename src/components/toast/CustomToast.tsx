import { appImages } from '@/constants/appInfo';
import Image from 'next/image';
import { toast, ToastOptions } from 'react-toastify';
import { CheckCircle2, CircleX } from 'lucide-react';

interface CustomToastProps {
  message: string;
  type: 'success' | 'error';
  options?: ToastOptions;
}

export const showCustomToast = ({ message, type, options }: CustomToastProps) => {
  toast.dismiss();

  const isSuccess = type === 'success';
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  toast(
    <div className={`flex w-fit items-center gap-2 mx-auto min-h-11 px-4 py-2 bg-white rounded-[8px] border ${isSuccess ? 'border-green-200 shadow-[0_4px_12px_rgba(0,0,0,0.08)]' : 'border-[#E5E5E5] mt-8 sm:mt-10'}`}>
      {isSuccess ? (
        <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
      ) : (
        <CircleX className="w-4 h-4 text-[#DC2626] shrink-0" />
      )}
      <span className={`text-sm ${isSuccess ? 'text-[#059669] font-sans' : 'text-[#DC2626]'} font-medium`}>
        {message}
      </span>
    </div>,
    {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: true,
      closeButton: false,
      style: { background: 'transparent', boxShadow: 'none', ...(isSuccess ? { top: isMobile ? '30px' : '60px' } : {}) },
      ...options
    }
  );
};
