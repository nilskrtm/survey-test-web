import { useAppDispatch } from '../../store/hooks';
import { addToast } from '../../store/features/passthrough.slice';
import { Toast } from '../../components/layout/toasts/ToastProvider';

type Toaster = {
  sendToast: (
    type: 'info' | 'warning' | 'error' | 'success',
    message: string,
    timeout?: number
  ) => void;
};

const useToasts: () => Toaster = () => {
  const dispatch = useAppDispatch();

  const sendToast: (
    type: 'info' | 'warning' | 'error' | 'success',
    message: string,
    timeout?: number
  ) => void = (type, message, timeout) => {
    const id = Math.random().toString(36).substring(2, 12);
    const finalTimeout = timeout != undefined ? timeout : 3000;
    const toast: Toast = { id: id, message: message, timeout: finalTimeout, type: type };

    dispatch(addToast({ toast: toast }));
  };

  return {
    sendToast: sendToast
  };
};

export default useToasts;
