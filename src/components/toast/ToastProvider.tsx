'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ToastProvider = () => (
  <ToastContainer
    position="top-right"
    autoClose={2000}
    theme="light"
    toastStyle={{ minWidth: '600px' }}
    progressClassName="!bg-[#FF8601]"
  />
);
