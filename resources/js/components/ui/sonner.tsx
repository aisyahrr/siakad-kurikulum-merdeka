import { useFlashToast } from '@/hooks/use-flash-toast';
import { useAppearance } from '@/hooks/use-appearance';
import {
    AlertTriangle,
    CheckCircle2,
    Info,
    XCircle,
} from 'lucide-react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

function Toaster({ ...props }: ToasterProps) {
    const { appearance } = useAppearance();

    useFlashToast();

    return (
        <Sonner
            theme={appearance}
            position="bottom-center"
            offset={24}
            mobileOffset={16}
            gap={10}
            closeButton
            className="toaster group"
            icons={{
                success: <CheckCircle2 size={18} className="text-[#087b79]" />,
                info: <Info size={18} className="text-[#17345b]" />,
                warning: <AlertTriangle size={18} className="text-[#b45309]" />,
                error: <XCircle size={18} className="text-[#c0392b]" />,
            }}
            toastOptions={{
                classNames: {
                    toast: 'group !w-[calc(100vw-2rem)] !max-w-sm !rounded-2xl !border !border-[#d8e1e8] !bg-[#e9eef3] !px-4 !py-3.5 !text-[#20282d] !shadow-[6px_6px_14px_#cbd3db,-6px_-6px_14px_#ffffff]',
                    title: '!text-[13px] !font-bold !text-[#17345b]',
                    description: '!text-[11px] !leading-relaxed !text-[#68777c]',
                    icon: '!shrink-0',
                    closeButton:
                        '!border-0 !bg-[#e9eef3] !text-[#68777c] !shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff] transition hover:!text-[#17345b]',
                    success: '!border-l-4 !border-l-[#087b79]',
                    info: '!border-l-4 !border-l-[#17345b]',
                    warning: '!border-l-4 !border-l-[#b45309]',
                    error: '!border-l-4 !border-l-[#c0392b]',
                    actionButton:
                        '!rounded-full !bg-[#17345b] !text-xs !font-bold !text-white',
                    cancelButton:
                        '!rounded-full !bg-[#e9eef3] !text-xs !font-bold !text-[#68777c]',
                },
            }}
            style={{ fontFamily: 'var(--font-body)' }}
            {...props}
        />
    );
}

export { Toaster };
