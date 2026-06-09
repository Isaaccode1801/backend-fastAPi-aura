import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  label: string;
  title: string;
  description?: string;
  light?: boolean;
  className?: string;
};

export function SectionHeader({
  label,
  title,
  description,
  light = false,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <p
        className={cn(
          "font-display text-xs font-bold uppercase tracking-[0.08em]",
          light ? "text-coesi-cyan" : "text-coesi-red"
        )}
      >
        {label}
      </p>
      <h1 className={cn("text-3xl font-bold sm:text-4xl", light && "text-white")}>{title}</h1>
      {description ? (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed",
            light ? "text-coesi-muted-light" : "text-coesi-muted"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
