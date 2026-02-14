'use client';

import { useEffect, useState, useCallback } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

let toastListeners: ((toast: ToastMessage) => void)[] = [];

export function showToast(type: ToastMessage['type'], message: string) {
  const toast: ToastMessage = {
    id: Math.random().toString(36).substring(2),
    type,
    message,
  };
  toastListeners.forEach((listener) => listener(toast));
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: ToastMessage) => {
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }, 4000);
  }, []);

  useEffect(() => {
    toastListeners.push(addToast);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== addToast);
    };
  }, [addToast]);

  if (toasts.length === 0) return null;

  const bgColors = {
    success: 'bg-success',
    error: 'bg-error',
    info: 'bg-primary',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" role="alert">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${bgColors[toast.type]} text-white px-4 py-3 rounded-lg shadow-lg text-sm max-w-sm animate-[slideIn_0.2s_ease-out]`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
