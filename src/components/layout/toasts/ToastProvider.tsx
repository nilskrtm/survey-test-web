import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { removeToast, selectToasts } from '../../../store/features/passthrough.slice';

export type Toast = {
  id: string;
  message: string;
  timeout: number;
  type: 'info' | 'warning' | 'error' | 'success';
};

type ToastBoxProps = {
  toast: Toast;
};

const ToastBox: (props: ToastBoxProps) => React.JSX.Element = (props) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(removeToast({ id: props.toast.id }));
    }, props.toast.timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  const getTitle: (type: string) => string = (type) => {
    switch (type) {
      case 'info':
        return 'Info';
      case 'warning':
        return 'Warnung';
      case 'error':
        return 'Fehler';
      case 'success':
        return 'Erfolg';
      default:
        return '';
    }
  };

  const getBackgroundColor: (type: string) => string = (type) => {
    switch (type) {
      case 'info':
        return 'bg-purple-200';
      case 'warning':
        return 'bg-orange-200';
      case 'error':
        return 'bg-red-300';
      case 'success':
        return 'bg-green-300';
      default:
        return '';
    }
  };

  const getFontColor: (type: string) => string = (type) => {
    switch (type) {
      case 'info':
        return 'text-purple-700';
      case 'warning':
        return 'text-orange-700';
      case 'error':
        return 'text-red-800';
      case 'success':
        return 'text-green-800';
      default:
        return '';
    }
  };

  return (
    <div
      className={`w-full flex flex-col gap-2 rounded-lg p-2 border border-gray-300 ${getBackgroundColor(
        props.toast.type
      )}`}>
      <span className={`text-base uppercase font-semibold ${getFontColor(props.toast.type)}`}>
        {getTitle(props.toast.type)}
      </span>
      <span className={`text-base ${getFontColor(props.toast.type)}`}>{props.toast.message}</span>
    </div>
  );
};

const ToastProvider: () => React.JSX.Element = () => {
  const toasts = useAppSelector(selectToasts);

  return (
    <div className="fixed z-50 bottom-0 right-0 max-w-sm flex flex-col-reverse items-center justify-start gap-2 m-4">
      {toasts.map((toast) => (
        <ToastBox toast={toast} key={'toast-' + toast.id} />
      ))}
    </div>
  );
};

export default ToastProvider;
