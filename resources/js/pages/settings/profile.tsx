import { Form, Head, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import type { Auth } from '@/types';
import SettingsLayout from '@/layouts/settings/layout';

type PageProps = {
    auth: Auth;
};

export default function Profile() {
    const { auth } = usePage<PageProps>().props;

    return (
        <SettingsLayout>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            {/* Container utama dengan gaya Neumorphic Card yang lembut */}
            <div className="space-y-8 max-w-4xl mx-auto pb-12">
                <div className="rounded-3xl bg-[#E4EBF5] p-8 shadow-[10px_10px_20px_#cbced1,-10px_-10px_20px_#ffffff] border border-white/65">
                    <Heading
                        variant="small"
                        title="Profile"
                        description="Update your name and email address"
                    />

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6 mt-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                                        Name
                                    </Label>

                                    <Input
                                        id="name"
                                        className="mt-1 block w-full rounded-2xl bg-[#E4EBF5] border-0 px-4 py-3 text-[#17345B] shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff] focus-visible:ring-1 focus-visible:ring-[#17345B]"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Full name"
                                    />

                                    <InputError
                                        className="mt-2 text-xs text-red-600 font-medium"
                                        message={errors.name}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                                        Email address
                                    </Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full rounded-2xl bg-[#E4EBF5] border-0 px-4 py-3 text-[#17345B] shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff] focus-visible:ring-1 focus-visible:ring-[#17345B]"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="Email address"
                                    />

                                    <InputError
                                        className="mt-2 text-xs text-red-600 font-medium"
                                        message={errors.email}
                                    />
                                </div>

                                <div className="flex items-center gap-4 pt-2">
                                    {/* Tombol Neumorphic Convex */}
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                        className="rounded-full bg-[#17345B] px-8 py-3 text-xs font-bold text-white shadow-[6px_6px_14px_#c2cbd9,-6px_-6px_14px_#ffffff] transition-all hover:bg-[#10243D] hover:shadow-[inset_3px_3px_6px_#0e2038]"
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                {/* Bagian Delete User */}
                <div className="rounded-3xl bg-[#E4EBF5] p-8 shadow-[10px_10px_20px_#cbced1,-10px_-10px_20px_#ffffff] border border-white/65">
                    <DeleteUser />
                </div>
            </div>
        </SettingsLayout>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};