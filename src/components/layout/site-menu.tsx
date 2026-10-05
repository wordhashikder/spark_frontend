"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { navigation } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Site navigation behind the header's menu button.
 * The links are always in the HTML (hidden when closed) so crawlers can follow them.
 */
export function SiteMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close after navigation.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-10 items-center justify-center rounded-lg text-ink hover:bg-surface"
      >
        {open ? (
          <X aria-hidden className="size-5" strokeWidth={2.25} />
        ) : (
          <Menu aria-hidden className="size-5" strokeWidth={2.25} />
        )}
      </button>

      {open ? (
        <button
          type="button"
          aria-hidden
          tabIndex={-1}
          onClick={() => setOpen(false)}
          className="fixed inset-0 top-[72px] z-40 cursor-default bg-ink/20"
        />
      ) : null}

      <nav
        id={panelId}
        aria-label="Main"
        hidden={!open}
        className={cn(
          "absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-72px)] overflow-y-auto border-b border-line bg-white shadow-card",
        )}
      >
        <div className="mx-auto grid w-full max-w-[1168px] gap-8 px-5 py-8 sm:grid-cols-3 sm:px-8 sm:py-10">
          {navigation.map((group) => (
            <div key={group.title}>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.04em] text-primary">
                {group.title}
              </p>
              <ul className="space-y-1">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "-mx-2 block rounded-md px-2 py-2 text-[15px] font-medium text-ink hover:bg-mint-soft",
                        pathname === link.href && "text-primary",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}
