import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTilt } from "@/hooks/use-tilt";
import { cn } from "@/lib/utils";

/**
 * PricingTable — plan cards with a monthly / yearly switch. Prices slide when
 * the billing period changes, and each card leans toward the pointer. The
 * highlighted plan sits higher and glows.
 */
export interface PricingPlan {
  name: string;
  description?: string;
  /** Price per month, billed monthly. */
  monthly: number;
  /** Price per month, billed yearly. */
  yearly: number;
  features: string[];
  cta?: string;
  highlighted?: boolean;
  onSelect?: () => void;
}

export interface PricingTableProps {
  /** Pricing plans to show, one card each. */
  plans: PricingPlan[];
  /** Currency symbol put before prices. */
  currency?: string;
  /** Shown on the yearly option, e.g. "Save 20%". */
  savingsLabel?: string;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function PricingTable({
  plans,
  currency = "$",
  savingsLabel = "Save 20%",
  className,
}: PricingTableProps) {
  const uid = useId();
  const reduced = !!useReducedMotion();
  const [yearly, setYearly] = useState(true);

  return (
    <div className={className}>
      <div className="flex justify-center">
        <div
          role="group"
          aria-label="Billing period"
          className="relative inline-flex rounded-full border border-depth-border bg-depth-surface p-1"
        >
          {[
            { label: "Monthly", value: false },
            { label: "Yearly", value: true },
          ].map((opt) => {
            const on = yearly === opt.value;
            return (
              <button
                key={opt.label}
                type="button"
                aria-pressed={on}
                onClick={() => setYearly(opt.value)}
                className={cn(
                  "relative rounded-full px-4 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-depth-accent",
                  on ? "text-white" : "text-depth-muted hover:text-depth-text",
                )}
              >
                {on && (
                  <motion.span
                    layoutId={`${uid}-pill`}
                    transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 rounded-full bg-depth-accent"
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  {opt.label}
                  {opt.value && (
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                        on ? "bg-white/20" : "bg-depth-accent/15 text-depth-accent",
                      )}
                    >
                      {savingsLabel}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-3 lg:items-center">
        {plans.map((plan) => (
          <PlanCard key={plan.name} plan={plan} yearly={yearly} currency={currency} reduced={reduced} />
        ))}
      </div>
    </div>
  );
}

function PlanCard({
  plan,
  yearly,
  currency,
  reduced,
}: {
  plan: PricingPlan;
  yearly: boolean;
  currency: string;
  reduced: boolean;
}) {
  const { ref, rotateX, rotateY, handlers, reduced: noTilt } = useTilt({ max: 5 });
  const price = yearly ? plan.yearly : plan.monthly;

  return (
    <div className={cn(plan.highlighted && "lg:-my-4")} style={{ perspective: 1000 }}>
      <motion.div
        ref={ref}
        {...handlers}
        style={{
          rotateX: noTilt ? 0 : rotateX,
          rotateY: noTilt ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "relative rounded-2xl border bg-depth-surface p-6 will-change-transform",
          plan.highlighted
            ? "border-depth-accent shadow-[0_30px_70px_-30px_var(--depth-shadow)] sm:p-7"
            : "border-depth-border shadow-[0_20px_40px_-28px_var(--depth-shadow)]",
        )}
      >
        {plan.highlighted && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-depth-accent px-3 py-1 text-xs font-semibold text-white">
            Most popular
          </span>
        )}

        <h3 className="text-lg font-semibold">{plan.name}</h3>
        {plan.description && <p className="mt-1 text-sm text-depth-muted">{plan.description}</p>}

        <div className="mt-5 flex items-baseline gap-1">
          <span className="text-lg text-depth-muted">{currency}</span>
          <span className="relative inline-block h-12 overflow-hidden text-4xl font-bold tracking-tight">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={price}
                initial={{ y: reduced ? 0 : 28, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: reduced ? 0 : -28, opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.25, ease: "easeOut" }}
                className="block leading-[3rem]"
              >
                {price}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="text-sm text-depth-muted">/ month</span>
        </div>
        <p className="mt-1 text-xs text-depth-muted">
          {yearly ? "Billed yearly" : "Billed monthly"}
        </p>

        <button
          type="button"
          onClick={plan.onSelect}
          className={cn(
            "mt-6 w-full rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition-all focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-surface",
            plan.highlighted
              ? "bg-depth-accent text-white hover:opacity-90"
              : "border border-depth-border bg-depth-elevated hover:border-depth-accent",
          )}
        >
          {plan.cta ?? "Get started"}
        </button>

        <ul className="mt-6 space-y-3 text-sm">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="mt-0.5 shrink-0 text-depth-accent">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
