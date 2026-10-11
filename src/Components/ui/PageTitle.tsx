export function PageTitle({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-[#17345b]">{eyebrow}</span>
        <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-[#20272d] md:text-3xl">{title}</h1>
        <p className="mt-1 text-sm leading-relaxed text-[#4f5d63]">{description}</p>
      </div>
      <div className="flex flex-wrap gap-3">{action}</div>
    </div>
  );
}
