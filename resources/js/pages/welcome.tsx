import { Head, Link, usePage } from "@inertiajs/react";

type PageProps = {
    auth?: {
        user?: {
            name?: string;
        } | null;
    };
};

const programs = [
    {
        number: "01",
        title: "Academic Excellence",
        description:
            "Kurikulum akademik yang mendorong siswa berpikir kritis, kreatif, dan berprestasi.",
    },
    {
        number: "02",
        title: "Global Perspective",
        description:
            "Membangun wawasan global melalui pembelajaran bahasa dan pengalaman lintas budaya.",
    },
    {
        number: "03",
        title: "Character Building",
        description:
            "Mengembangkan karakter, kepemimpinan, disiplin, dan rasa tanggung jawab.",
    },
];

const facilities = [
    {
        title: "Modern Library",
        category: "LEARNING SPACE",
        image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=900&q=85",
    },
    {
        title: "Science Laboratory",
        category: "RESEARCH & INNOVATION",
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=900&q=85",
    },
    {
        title: "Campus Life",
        category: "STUDENT EXPERIENCE",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900&q=85",
    },
];

export default function Welcome() {
    const { auth } = usePage<PageProps>().props;
    const user = auth?.user;
    const isLoggedIn = Boolean(user);

    const dashboardUrl = user
        ? ({
              admin: "/admin",
              guru: "/guru",
              "wali-kelas": "/wali-kelas",
              siswa: "/siswa",
              "orang-tua": "/orangtua",
          }[user.role] ?? "/login")
        : "/login";

    return (
        <>
            <Head title="Jeguk High School | Excellence Beyond Limits" />

            {/* Background utama menggunakan warna dasar Neumorphic soft off-white */}
            <div className="min-h-screen bg-[#E4EBF5] text-[#172B45] selection:bg-[#D9B66F] selection:text-white">
                {/* NAVBAR */}
                <header className="absolute left-0 right-0 top-0 z-50">
                    <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 lg:px-16">
                        <a href="#" className="flex items-center gap-3 group">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4EBF5] text-[#17345B] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] transition-all group-hover:shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]">
                                <span className="text-xl font-black">J</span>
                            </div>

                            <div>
                                <p className="text-sm font-bold tracking-[0.15em] text-[#17345B]">
                                    JEGUK
                                </p>
                                <p className="text-[9px] tracking-[0.25em] text-[#64748B]">
                                    HIGH SCHOOL
                                </p>
                            </div>
                        </a>

                        <div className="hidden items-center gap-8 text-sm font-semibold text-[#475569] md:flex">
                            <a
                                href="#about"
                                className="transition hover:text-[#17345B]"
                            >
                                About Us
                            </a>
                            <a
                                href="#programs"
                                className="transition hover:text-[#17345B]"
                            >
                                Academics
                            </a>
                            <a
                                href="#facilities"
                                className="transition hover:text-[#17345B]"
                            >
                                Facilities
                            </a>
                            <a
                                href="#admission"
                                className="transition hover:text-[#17345B]"
                            >
                                Admission
                            </a>
                        </div>

                        {/* Neumorphic Button Header */}
                        <Link
                            href={dashboardUrl}
                            className="rounded-full bg-[#E4EBF5] px-7 py-3 text-xs font-bold text-[#17345B] shadow-[6px_6px_12px_#cbced1,-6px_-6px_12px_#ffffff] transition-all hover:shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff]"
                        >
                            Student Portal
                        </Link>
                    </nav>
                </header>

                {/* HERO SECTION */}
                <section className="relative flex min-h-[700px] items-center overflow-hidden bg-[#E4EBF5] lg:min-h-[780px]">
                    <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-16 pt-44 lg:px-16">
                        <div className="grid lg:grid-cols-12 gap-12 items-center">
                            <div className="lg:col-span-7">
                                <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-[#E4EBF5] px-4 py-2 shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff]">
                                    <span className="h-2 w-2 rounded-full bg-[#D9B66F]" />
                                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#9A7B38]">
                                        Welcome to Jeguk High School
                                    </span>
                                </div>

                                <h1 className="text-5xl font-extrabold leading-[1.12] tracking-tight text-[#17345B] sm:text-6xl lg:text-7xl">
                                    Shape Your <br />
                                    <span className="italic text-[#B18A42]">
                                        Own Future.
                                    </span>
                                </h1>

                                <p className="mt-6 max-w-xl text-base leading-8 text-[#64748B] sm:text-lg">
                                    A place where ambition meets opportunity.
                                    Discover your potential, build meaningful
                                    connections, and prepare for a future
                                    without limits.
                                </p>

                                <div className="mt-10 flex flex-wrap gap-5">
                                    {/* Primary Neumorphic Convex Button */}
                                    <a
                                        href="#about"
                                        className="rounded-full bg-[#17345B] px-8 py-4 text-sm font-bold text-white shadow-[6px_6px_14px_#c2cbd9,-6px_-6px_14px_#ffffff] transition-all hover:shadow-[inset_3px_3px_6px_#0e2038,inset_-3px_-3px_6px_#20487e]"
                                    >
                                        Discover Our School
                                    </a>

                                    {/* Secondary Neumorphic Concave Button */}
                                    <Link
                                        href={dashboardUrl}
                                        className="rounded-full bg-[#E4EBF5] px-8 py-4 text-sm font-bold text-[#17345B] shadow-[6px_6px_12px_#cbced1,-6px_-6px_12px_#ffffff] transition-all hover:shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]"
                                    >
                                        Enter Student Portal
                                    </Link>
                                </div>
                            </div>

                            {/* Hero Card Visual with Neumorphic Floating Effect */}
                            <div className="lg:col-span-5">
                                <div className="relative rounded-3xl p-4 bg-[#E4EBF5] shadow-[12px_12px_24px_#cbced1,-12px_-12px_24px_#ffffff]">
                                    <div className="overflow-hidden rounded-2xl shadow-[inset_6px_6px_12px_#cbced1,inset_-6px_-6px_12px_#ffffff]">
                                        <img
                                            src="https://images.unsplash.com/photo-1562774053-701939374585?w=1000&q=90"
                                            alt="Campus Hero"
                                            className="h-[380px] w-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute -bottom-6 -left-6 rounded-2xl bg-[#E4EBF5] p-5 shadow-[10px_10px_20px_#cbced1,-10px_-10px_20px_#ffffff] border border-white/50">
                                        <p className="text-2xl font-black text-[#17345B]">
                                            Excellence
                                        </p>
                                        <p className="text-xs text-[#64748B] font-semibold mt-1">
                                            Beyond Limits
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Bar */}
                        <div className="mt-24 grid grid-cols-1 gap-6 sm:grid-cols-3">
                            {[
                                { num: "01", label: "Excellence in Education" },
                                { num: "02", label: "Future-Ready Learning" },
                                { num: "03", label: "Character & Leadership" },
                            ].map((stat, idx) => (
                                <div
                                    key={idx}
                                    className="rounded-2xl bg-[#E4EBF5] p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] flex items-center gap-5"
                                >
                                    <span className="text-3xl font-black text-[#B18A42]">
                                        {stat.num}
                                    </span>
                                    <span className="text-sm font-bold text-[#17345B]">
                                        {stat.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ABOUT SECTION */}
                <section id="about" className="px-6 py-24 lg:px-16 lg:py-32">
                    <div className="mx-auto grid max-w-[1280px] items-center gap-16 lg:grid-cols-2">
                        <div className="relative rounded-3xl p-4 bg-[#E4EBF5] shadow-[12px_12px_24px_#cbced1,-12px_-12px_24px_#ffffff]">
                            <div className="overflow-hidden rounded-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1000&q=85"
                                    alt="Students learning together"
                                    className="h-[420px] w-full object-cover"
                                />
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B18A42]">
                                About Jeguk
                            </p>

                            <h2 className="mt-4 text-4xl font-bold leading-tight text-[#17345B] md:text-5xl">
                                More Than a School. <br />A Place to Grow.
                            </h2>

                            <p className="mt-6 leading-8 text-[#64748B]">
                                Jeguk High School is a learning community
                                dedicated to academic excellence, personal
                                development, and leadership. We believe every
                                student has the potential to create their own
                                path to success.
                            </p>

                            <p className="mt-4 leading-8 text-[#64748B]">
                                Through an inspiring environment and meaningful
                                learning experiences, we prepare students to
                                face tomorrow with confidence.
                            </p>

                            <a
                                href="#programs"
                                className="mt-8 inline-flex items-center gap-3 text-sm font-bold text-[#17345B] transition hover:translate-x-2"
                            >
                                Explore Our Approach <span>→</span>
                            </a>
                        </div>
                    </div>
                </section>

                {/* PROGRAMS SECTION */}
                <section id="programs" className="px-6 py-24 lg:px-16">
                    <div className="mx-auto max-w-[1280px]">
                        <div className="max-w-2xl">
                            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B18A42]">
                                Our Philosophy
                            </p>
                            <h2 className="mt-4 text-4xl font-bold text-[#17345B] md:text-5xl">
                                Education with Purpose.
                            </h2>
                            <p className="mt-4 leading-7 text-[#64748B]">
                                We create opportunities for students to discover
                                their strengths and develop the skills needed to
                                thrive.
                            </p>
                        </div>

                        <div className="mt-14 grid gap-8 md:grid-cols-3">
                            {programs.map((program) => (
                                <article
                                    key={program.number}
                                    className="group rounded-3xl bg-[#E4EBF5] p-8 shadow-[10px_10px_20px_#cbced1,-10px_-10px_20px_#ffffff] transition-all duration-300 hover:shadow-[inset_6px_6px_12px_#cbced1,inset_-6px_-6px_12px_#ffffff]"
                                >
                                    <p className="text-sm font-bold tracking-widest text-[#B18A42]">
                                        {program.number}
                                    </p>

                                    <div className="my-6 h-px w-full bg-[#cbced1]" />

                                    <h3 className="text-2xl font-bold text-[#17345B]">
                                        {program.title}
                                    </h3>

                                    <p className="mt-4 text-sm leading-7 text-[#64748B]">
                                        {program.description}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FACILITIES SECTION */}
                <section id="facilities" className="px-6 py-24 lg:px-16">
                    <div className="mx-auto max-w-[1280px]">
                        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B18A42]">
                                    Life at Jeguk
                                </p>
                                <h2 className="mt-4 text-4xl font-bold text-[#17345B] md:text-5xl">
                                    Spaces to Discover.
                                </h2>
                            </div>
                            <p className="max-w-md text-sm leading-7 text-[#64748B]">
                                A supportive campus environment where students
                                can learn, collaborate, explore, and grow.
                            </p>
                        </div>

                        <div className="mt-12 grid gap-8 md:grid-cols-3">
                            {facilities.map((facility) => (
                                <article
                                    key={facility.title}
                                    className="group overflow-hidden rounded-3xl bg-[#E4EBF5] p-4 shadow-[10px_10px_20px_#cbced1,-10px_-10px_20px_#ffffff]"
                                >
                                    <div className="overflow-hidden rounded-2xl">
                                        <img
                                            src={facility.image}
                                            alt={facility.title}
                                            className="h-[240px] w-full object-cover transition duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    </div>

                                    <div className="p-4">
                                        <p className="text-[10px] font-bold tracking-[0.2em] text-[#B18A42]">
                                            {facility.category}
                                        </p>
                                        <h3 className="mt-2 text-xl font-bold text-[#17345B]">
                                            {facility.title}
                                        </h3>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ADMISSION CTA */}
                <section id="admission" className="px-6 pb-24 lg:px-16">
                    <div className="mx-auto max-w-[1280px] overflow-hidden rounded-3xl bg-[#E4EBF5] px-8 py-16 text-center md:px-16 shadow-[14px_14px_28px_#cbced1,-14px_-14px_28px_#ffffff] border border-white/60">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B18A42]">
                            Your Journey Starts Here
                        </p>

                        <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-bold text-[#17345B] md:text-5xl">
                            Ready to Write Your Own Story?
                        </h2>

                        <p className="mx-auto mt-4 max-w-xl leading-7 text-[#64748B]">
                            Become part of a community that believes in your
                            potential. Your next chapter begins at Jeguk.
                        </p>

                        <Link
                            href={dashboardUrl}
                            className="mt-8 inline-flex rounded-full bg-[#17345B] px-9 py-4 text-sm font-bold text-white shadow-[6px_6px_14px_#c2cbd9,-6px_-6px_14px_#ffffff] transition-all hover:shadow-[inset_3px_3px_6px_#0e2038,inset_-3px_-3px_6px_#20487e]"
                        >
                            {isLoggedIn
                                ? "Go to Dashboard"
                                : "Access Student Portal"}
                        </Link>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="bg-[#D9E2F0] px-6 py-12 text-[#17345B] lg:px-16 shadow-[inset_0px_8px_16px_#cbced1]">
                    <div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-8 md:flex-row md:items-center">
                        <div>
                            <p className="text-lg font-bold tracking-[0.15em]">
                                JEGUK HIGH SCHOOL
                            </p>
                            <p className="mt-1 text-sm text-[#64748B]">
                                Excellence Beyond Limits.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-6 text-sm font-semibold text-[#64748B]">
                            <a href="#about" className="hover:text-[#17345B]">
                                About
                            </a>
                            <a
                                href="#programs"
                                className="hover:text-[#17345B]"
                            >
                                Academics
                            </a>
                            <a
                                href="#facilities"
                                className="hover:text-[#17345B]"
                            >
                                Facilities
                            </a>
                            <Link
                                href="/login"
                                className="hover:text-[#17345B]"
                            >
                                Login
                            </Link>
                        </div>
                    </div>

                    <div className="mx-auto mt-10 max-w-[1280px] border-t border-[#cbced1] pt-6 text-xs text-[#64748B]">
                        © {new Date().getFullYear()} Jeguk High School. All
                        rights reserved.
                    </div>
                </footer>
            </div>
        </>
    );
}
