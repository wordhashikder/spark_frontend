"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { routes } from "@/lib/site";

/**
 * The logo link, in the header and the footer. Its `href` is an anchor to the
 * top of the homepage, so it works from every page and without JavaScript.
 * On the homepage itself the page scrolls back to the top in place, however
 * far down the visitor is and however often the logo is pressed.
 */
export function HomeLink(props: Omit<ComponentProps<typeof Link>, "href">) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      href={routes.homeTop}
      onClick={(event) => {
        // Leave new-tab and other modified clicks to the browser.
        const plainClick =
          event.button === 0 &&
          !(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey);
        if (pathname !== routes.home || !plainClick) return;
        event.preventDefault();
        // Smooth or instant, following the `scroll-behavior` set in globals.css.
        window.scrollTo({ top: 0 });
      }}
    />
  );
}
