import { cn } from "@/lib/utils";
import { NAV } from "./nav";

/** The grouped component list, used by both the desktop sidebar and the mobile drawer. */
export function NavList({
  active,
  onNavigate,
  className,
}: {
  active: string;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <nav aria-label="Components" className={cn("text-sm", className)}>
      {NAV.map((group) => (
        <div key={group.title} className="mb-5">
          <p className="px-3 pb-1.5 font-mono text-[11px] uppercase tracking-widest text-depth-muted">
            {group.title}
          </p>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={onNavigate}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "block rounded-md px-3 py-2 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-depth-accent lg:py-1.5",
                      isActive
                        ? "bg-depth-accent/10 font-medium text-depth-accent"
                        : "text-depth-muted hover:bg-depth-elevated hover:text-depth-text",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
