import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

type FlashPayload = {
    toast?: FlashToast;
    success?: string | null;
    error?: string | null;
    warning?: string | null;
    info?: string | null;
};

function resolveToast(flash: FlashPayload | undefined): FlashToast | undefined {
    if (!flash) {
        return undefined;
    }

    if (flash.toast) {
        return flash.toast;
    }

    if (flash.success) {
        return { type: 'success', message: flash.success };
    }

    if (flash.error) {
        return { type: 'error', message: flash.error };
    }

    if (flash.warning) {
        return { type: 'warning', message: flash.warning };
    }

    if (flash.info) {
        return { type: 'info', message: flash.info };
    }

    return undefined;
}

export function useFlashToast(): void {
    useEffect(() => {
        return router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash as
                | FlashPayload
                | undefined;
            const data = resolveToast(flash);

            if (!data) {
                return;
            }

            toast[data.type](data.message);
        });
    }, []);
}
