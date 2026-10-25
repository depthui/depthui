import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NAV } from "./nav";
import { DOCS, docPath } from "./docs-registry";

const bySlug = new Map(DOCS.map((d) => [d.id, d]));

/** The grouped component list, used by both the desktop sidebar and the mobile drawer.
 *  Every item is a real link to /components/<slug>. */
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
                  <Link
                    to={docPath(bySlug.get(item.id)!)}
                    onClick={onNavigate}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "block rounded-md px-3 py-2 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-depth-accent lg:py-1.5",
                      isActive
                        ? "bg-depth-accent/10 font-medium text-depth-accent"
                        : "text-depth-muted hover:bg-depth-elevated hover:text-depth-text",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
