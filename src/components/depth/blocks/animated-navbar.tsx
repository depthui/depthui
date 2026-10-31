import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * AnimatedNavbar — a floating pill navbar.
 *  - a highlight pill glides between items as you hover (shared layoutId)
 *  - items with `links` open a dropdown that swings down in 3D
 *  - elevates once the page scrolls
 *  - below `md` it collapses into a hamburger with an accordion menu
 * Closes on Esc and outside click. Add `sticky top-4` via className to pin it.
 */
export interface NavbarLink {
  label: string;
  description?: string;
  href: string;
  icon?: ReactNode;
}

export interface NavbarItem {
  label: string;
  /** Plain link. Ignored when `links` is set. */
  href?: string;
  /** Dropdown links. */
  links?: NavbarLink[];
  /** Optional promo panel shown beside the dropdown links. */
  featured?: ReactNode;
}

export interface AnimatedNavbarProps {
  /** Brand mark or name shown at the left of the bar. */
  logo: ReactNode;
  /** Navigation links, optionally with dropdown sub-items. */
  items: NavbarItem[];
  /** Right side: theme toggle, sign in, call to action... */
  actions?: ReactNode;
  /** Extra classes added to the outer element. */
  className?: string;
}

const itemClass =
  "relative rounded-full px-4 py-2 text-sm text-depth-muted outline-none transition-colors hover:text-depth-text focus-visible:text-depth-text focus-visible:ring-2 focus-visible:ring-depth-accent";

export function AnimatedNavbar({ logo, items, actions, className }: AnimatedNavbarProps) {
  const uid = useId();
  const reduced = !!useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  const [hovered, setHovered] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSub, setMobileSub] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(null);
        setMobileOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const spring = reduced
    ? ({ duration: 0 } as const)
    : ({ type: "spring", stiffness: 420, damping: 34 } as const);

  const panelItem = open !== null ? items[open] : undefined;
  const panelLinks = panelItem?.links;

  return (
    <div
      ref={rootRef}
      onPointerLeave={(e) => {
        if (e.pointerType === "touch") return;
        setHovered(null);
        setOpen(null);
      }}
      className={cn("relative z-40 mx-auto w-full max-w-4xl", className)}
    >
      {/* the bar */}
      <div
        className={cn(
          "flex items-center justify-between gap-2 rounded-full border border-depth-border bg-depth-surface/80 py-2 pl-5 pr-2 backdrop-blur-md transition-shadow duration-300",
          scrolled && "shadow-[0_14px_40px_-16px_var(--depth-shadow)]",
        )}
      >
        <div className="shrink-0">{logo}</div>

        <nav aria-label="Main" className="hidden items-center md:flex">
          {items.map((item, i) => {
            const hasMenu = !!item.links?.length;
            const highlight = hovered === i && (
              <motion.span
                layoutId={`${uid}-hl`}
                transition={spring}
                className="absolute inset-0 rounded-full bg-depth-elevated"
              />
            );
            const label = <span className="relative z-10">{label_(item.label, hasMenu, open === i)}</span>;

            return hasMenu ? (
              <button
                key={item.label}
                type="button"
                aria-expanded={open === i}
                aria-haspopup="true"
                aria-controls={`${uid}-menu`}
                onPointerEnter={(e) => {
                  setHovered(i);
                  if (e.pointerType !== "touch") setOpen(i);
                }}
                onClick={() => setOpen((o) => (o === i ? null : i))}
                className={cn(itemClass, open === i && "text-depth-text")}
              >
                {highlight}
                {label}
              </button>
            ) : (
              <a
                key={item.label}
                href={item.href ?? "#"}
                onPointerEnter={() => {
                  setHovered(i);
                  setOpen(null);
                }}
                className={itemClass}
              >
                {highlight}
                {label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">{actions}</div>
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-depth-border bg-depth-surface text-depth-text outline-none hover:border-depth-accent focus-visible:ring-2 focus-visible:ring-depth-accent md:hidden"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d={mobileOpen ? "M6 6l12 12M18 6L6 18" : "M4 8h16M4 16h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* desktop dropdown */}
      <div
        className={cn(
          "absolute left-1/2 top-full z-50 hidden w-[min(42rem,92vw)] -translate-x-1/2 pt-3 md:block",
          panelLinks ? "pointer-events-auto" : "pointer-events-none",
        )}
        style={{ perspective: 1100 }}
      >
        <AnimatePresence>
          {panelLinks && (
            <motion.div
              key="panel"
              id={`${uid}-menu`}
              initial={{ opacity: 0, rotateX: reduced ? 0 : -14, y: -6 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0, rotateX: reduced ? 0 : -10, y: -4 }}
              transition={{ duration: reduced ? 0 : 0.22, ease: "easeOut" }}
              style={{ transformOrigin: "top center" }}
              className="overflow-hidden rounded-2xl border border-depth-border bg-depth-surface shadow-[0_30px_60px_-30px_var(--depth-shadow)]"
            >
              <motion.div
                key={open}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduced ? 0 : 0.18 }}
                className={cn("grid gap-1 p-2", panelItem?.featured && "md:grid-cols-[1fr_13rem]")}
              >
                <div className="grid gap-1 sm:grid-cols-2">
                  {panelLinks.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      onClick={() => setOpen(null)}
                      className="group flex items-start gap-3 rounded-xl p-3 outline-none transition-colors hover:bg-depth-elevated focus-visible:bg-depth-elevated focus-visible:ring-2 focus-visible:ring-depth-accent"
                    >
                      {l.icon && (
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-depth-border bg-depth-surface text-depth-accent transition-transform duration-200 group-hover:-translate-y-0.5 [&>svg]:h-4 [&>svg]:w-4">
                          {l.icon}
                        </span>
                      )}
                      <span>
                        <span className="block text-sm font-medium">{l.label}</span>
                        {l.description && (
                          <span className="mt-0.5 block text-xs leading-snug text-depth-muted">
                            {l.description}
                          </span>
                        )}
                      </span>
                    </a>
                  ))}
                </div>
                {panelItem?.featured && (
                  <div className="rounded-xl bg-gradient-to-br from-depth-accent/15 to-depth-accent-2/10 p-4">
                    {panelItem.featured}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile"
            initial={{ opacity: 0, y: reduced ? 0 : -8, scale: reduced ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduced ? 0 : -8, scale: reduced ? 1 : 0.98 }}
            transition={{ duration: reduced ? 0 : 0.2, ease: "easeOut" }}
            style={{ transformOrigin: "top center" }}
            className="absolute inset-x-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-depth-border bg-depth-surface p-2 shadow-[0_30px_60px_-30px_var(--depth-shadow)] md:hidden"
          >
            <ul>
              {items.map((item, i) => {
                const hasMenu = !!item.links?.length;
                return (
                  <li key={item.label}>
                    {hasMenu ? (
                      <>
                        <button
                          type="button"
                          aria-expanded={mobileSub === i}
                          onClick={() => setMobileSub((s) => (s === i ? null : i))}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-medium outline-none hover:bg-depth-elevated focus-visible:ring-2 focus-visible:ring-depth-accent"
                        >
                          {item.label}
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cn("transition-transform", mobileSub === i && "rotate-180")}>
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </button>
                        {mobileSub === i && (
                          <ul className="mb-1 ml-3 border-l border-depth-border pl-2">
                            {item.links!.map((l) => (
                              <li key={l.label}>
                                <a
                                  href={l.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="block rounded-lg px-3 py-2.5 text-sm text-depth-muted outline-none hover:bg-depth-elevated hover:text-depth-text focus-visible:ring-2 focus-visible:ring-depth-accent"
                                >
                                  {l.label}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <a
                        href={item.href ?? "#"}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-xl px-3 py-3 text-sm font-medium outline-none hover:bg-depth-elevated focus-visible:ring-2 focus-visible:ring-depth-accent"
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
            {actions && (
              <div className="mt-2 flex items-center justify-between gap-2 border-t border-depth-border p-2 pt-3">
                {actions}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function label_(text: string, hasMenu: boolean, isOpen: boolean) {
  if (!hasMenu) return text;
  return (
    <span className="inline-flex items-center gap-1">
      {text}
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cn("transition-transform duration-200", isOpen && "rotate-180")}>
        <path d="M6 9l6 6 6-6" />
      </svg>
    </span>
  );
}
