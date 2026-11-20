import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import type { MenuItem } from "./dropdown-menu-3d";

/**
 * ContextMenu3D — a menu that opens where you right-click. Also opens with the
 * keyboard (Shift+F10 or the Menu key while the area is focused) and with a long
 * press on touch screens. Arrow keys move, Enter chooses, Escape closes and
 * focus returns to the area. The menu stays inside the window.
 */
export interface ContextMenu3DProps {
  /** The items in the menu. Reuses the item shape of DropdownMenu3D. */
  items: MenuItem[];
  /** Called with the id of the chosen item. */
  onSelect?: (id: string) => void;
  /** The area that reacts to right-click. */
  children: ReactNode;
  /** Accessible name of the menu. */
  "aria-label"?: string;
  /** Extra classes added to the area. */
  className?: string;
}

export function ContextMenu3D({ items, onSelect, children, "aria-label": ariaLabel = "Context menu", className }: ContextMenu3DProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const area = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const press = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const enabled = () => items.map((it, i) => (it.disabled ? -1 : i)).filter((i) => i >= 0);

  function close(refocus = true) {
    setPos(null);
    if (refocus) area.current?.focus();
  }

  // Keep the menu inside the window, then focus its first item.
  useEffect(() => {
    if (!pos || !menu.current) return;
    const r = menu.current.getBoundingClientRect();
    const x = Math.max(8, Math.min(pos.x, window.innerWidth - r.width - 8));
    const y = Math.max(8, Math.min(pos.y, window.innerHeight - r.height - 8));
    menu.current.style.left = `${x}px`;
    menu.current.style.top = `${y}px`;
    refs.current[enabled()[0]]?.focus();
    const down = (e: PointerEvent) => {
      if (!menu.current?.contains(e.target as Node)) setPos(null);
    };
    const away = () => setPos(null);
    document.addEventListener("pointerdown", down);
    window.addEventListener("resize", away);
    window.addEventListener("scroll", away, true);
    return () => {
      document.removeEventListener("pointerdown", down);
      window.removeEventListener("resize", away);
      window.removeEventListener("scroll", away, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos]);
  useEffect(() => () => clearTimeout(press.current), []);

  function onMenuKey(e: KeyboardEvent) {
    const list = enabled();
    const cur = list.indexOf(refs.current.findIndex((r) => r === document.activeElement));
    const go = (i: number | undefined) => i !== undefined && refs.current[i]?.focus();
    if (e.key === "ArrowDown") go(list[(cur + 1) % list.length]);
    else if (e.key === "ArrowUp") go(list[(cur - 1 + list.length) % list.length]);
    else if (e.key === "Home") go(list[0]);
    else if (e.key === "End") go(list[list.length - 1]);
    else if (e.key === "Escape") close();
    else if (e.key === "Tab") { setPos(null); return; }
    else return;
    e.preventDefault();
  }

  return (
    <>
      <div
        ref={area}
        tabIndex={0}
        onContextMenu={(e) => { e.preventDefault(); setPos({ x: e.clientX, y: e.clientY }); }}
        onKeyDown={(e) => {
          if (e.key === "ContextMenu" || (e.shiftKey && e.key === "F10")) {
            e.preventDefault();
            const r = e.currentTarget.getBoundingClientRect();
            setPos({ x: r.left + 24, y: r.top + 24 });
          }
        }}
        onTouchStart={(e) => { const t = e.touches[0]; press.current = setTimeout(() => setPos({ x: t.clientX, y: t.clientY }), 550); }}
        onTouchEnd={() => clearTimeout(press.current)}
        onTouchMove={() => clearTimeout(press.current)}
        className={cn("rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-depth-accent", className)}
        style={{ WebkitTouchCallout: "none" }}
      >
        {children}
      </div>
      {pos && createPortal(
        <div
          ref={menu}
          role="menu"
          aria-label={ariaLabel}
          onKeyDown={onMenuKey}
          style={{ position: "fixed", left: pos.x, top: pos.y }}
          className="z-[100] min-w-[12rem] rounded-xl border border-depth-border bg-depth-surface p-1.5 shadow-[0_18px_40px_rgb(0_0_0/0.3)]"
        >
          {items.map((it, i) => (
            <div key={it.id}>
              {it.separatorBefore && <div role="separator" className="my-1 h-px bg-depth-border" />}
              <button
                ref={(el) => { refs.current[i] = el; }}
                type="button"
                role="menuitem"
                tabIndex={-1}
                disabled={it.disabled}
                onClick={() => { onSelect?.(it.id); close(); }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm outline-none transition-colors hover:bg-depth-elevated focus-visible:bg-depth-accent focus-visible:text-white",
                  it.danger ? "text-red-600 dark:text-red-400" : "text-depth-text",
                  it.disabled && "cursor-not-allowed opacity-40",
                )}
              >
                {it.icon && <span aria-hidden className="flex h-4 w-4 items-center justify-center">{it.icon}</span>}
                <span className="flex-1">{it.label}</span>
                {it.hint && <span className="font-mono text-[11px] opacity-60">{it.hint}</span>}
              </button>
            </div>
          ))}
        </div>,
        document.body,
      )}
    </>
  );
}
