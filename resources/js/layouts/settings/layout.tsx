import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Header } from '@/components/navigation/Header';
import { useState } from 'react';

export default function SettingsLayout({ children }: PropsWithChildren) {
    const [open, setOpen] = useState(false);

    return (
        <div className="h-screen overflow-hidden bg-[#e9eef3] text-[#20282d]">
            <Sidebar
                isOpen={open}
                onClose={() => setOpen(false)}
            />

            <div className="flex h-screen min-w-0 flex-col md:pl-[210px]">
                <div className="z-30 shrink-0">
                    <Header
                        onOpenSidebar={() => setOpen(true)}
                    />
                </div>

                <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="mx-auto w-full px-5 pb-16 pt-2 md:px-8 xl:px-12">
                        <div className="px-4 py-6">
                            <Heading
                                title="Settings"
                                description="Manage your profile and account settings"
                            />

                            <div className="flex flex-col lg:flex-row lg:space-x-12 mt-6">
                                <div className="flex-1 md:max-w-2xl">
                                    <section className="max-w-xl space-y-12">
                                        {children}
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
