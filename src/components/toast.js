
import { toast } from 'sonner';

export const toastNotify = (type, message, position, autoClose, theme) => {
    switch (type) {
        case 'info':
            toast.info(message || 'Something When Wrong', {
                position: position || 'bottom-left',
                autoClose: autoClose || 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: theme || "colored",
            });
            break;
        case 'sucess':
            toast.success(message || 'Something When Wrong', {
                position: position || 'bottom-left',
                autoClose: autoClose || 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: theme || "colored",
            });
            break;
        case 'warning':
            toast.warn(message || 'Something When Wrong', {
                position: position || 'bottom-left',
                autoClose: autoClose || 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: theme || "colored",
            });
            break;
        case 'error':
            toast.error(message || 'Something When Wrong', {
                position: position || 'bottom-left',
                autoClose: autoClose || 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: theme || "colored",
            });
            break;
        case 'default':
            toast(message || 'Something When Wrong', {
                position: position || 'bottom-left',
                autoClose: autoClose || 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: theme || "colored",
            });
            break;
        default:
            break;
    }
}