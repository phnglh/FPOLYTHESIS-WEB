import { toast, ToastOptions } from 'react-toastify'

export const useAppToast = () => {
  const success = (msg: string, options?: ToastOptions) =>
    toast.success(msg, options)
  const error = (msg: string, options?: ToastOptions) =>
    toast.error(msg, options)
  const info = (msg: string, options?: ToastOptions) => toast.info(msg, options)
  const warning = (msg: string, options?: ToastOptions) =>
    toast.warning(msg, options)
  return { success, error, info, warning }
}
