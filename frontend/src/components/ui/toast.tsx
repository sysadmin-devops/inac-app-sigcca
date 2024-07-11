import { toast } from 'react-toastify';

export default function Toast(
  message: string,
  toastType?: 'error' | 'success' | 'warning',
  position?:
    | 'top-right'
    | 'top-left'
    | 'top-center'
    | 'bottom-center'
    | 'bottom-left'
    | 'bottom-right'
) {
  const toastOptions = {
    position: position,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  switch (toastType) {
    case 'error':
      toast.error(message, toastOptions);
      break;
    case 'success':
      toast.success(message, toastOptions);
      break;
    case 'warning':
      toast.warning(message, toastOptions);
      break;
    default:
      toast(message, toastOptions);
  }
}
