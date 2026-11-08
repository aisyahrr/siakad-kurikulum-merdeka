import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import type { ComponentType, ReactNode } from "react";
import { AuthLayout } from "@/layouts/AuthLayout";

const appName = import.meta.env.VITE_APP_NAME || "Jeguk High School";

const pages = import.meta.glob("./pages/**/*.tsx");

const publicPages = ["welcome", "auth/LoginPage"];

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    resolve: async (name) => {
        const path = `./pages/${name}.tsx`;
        const loader = pages[path];

        if (!loader) {
            throw new Error(`Halaman Inertia tidak ditemukan: ${path}`);
        }

        const module = (await loader()) as {
            default: ComponentType & {
                layout?: (page: ReactNode) => ReactNode;
            };
        };

        const page = module.default;

        if (!page.layout && !publicPages.includes(name)) {
            page.layout = (page: ReactNode) => (
                <AuthLayout>{page}</AuthLayout>
            );
        }

        return page;
    },

    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },

    progress: {
        color: "#17345B",
    },
});
