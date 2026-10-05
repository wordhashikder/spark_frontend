import type { Metadata } from "next";
import { site } from "@/lib/site";

/** Absolute URL for a site path. */
export const absoluteUrl = (path = "/") =>
  `${site.url}${path.startsWith("/") ? path : `/${path}`}`;

type PageMeta = {
  title: string;
  description: string;
  path: string;
  /** Set false for utility pages (login, account, form confirmations). */
  index?: boolean;
};

/** Consistent title, description, canonical and social tags for a page. */
export function pageMetadata({
  title,
  description,
  path,
  index = true,
}: PageMeta): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: site.locale,
      url: absoluteUrl(path),
      title: `${title} | ${site.name}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
    },
    ...(index ? {} : { robots: { index: false, follow: false } }),
  };
}

/*
 * schema.org builders. Search engines and AI answer engines both read these,
 * so every claim here must be backed by content visible on the page.
 */

type Json = Record<string, unknown>;

export function organizationSchema(): Json {
  const sameAs = [site.social.x, site.social.linkedin].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: absoluteUrl("/logo.svg"),
    description: site.description,
    email: site.email,
    areaServed: { "@type": "Country", name: "United Kingdom" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: site.email,
      areaServed: "GB",
      availableLanguage: "English",
    },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    inLanguage: "en-GB",
    publisher: { "@id": `${site.url}/#organization` },
  };
}

export function breadcrumbSchema(
  items: { name: string; path: string }[],
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(items: { question: string; answer: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function howToSchema(args: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: args.name,
    description: args.description,
    step: args.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

export function serviceSchema(args: {
  name: string;
  description: string;
  path: string;
  areaServed?: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: args.name,
    description: args.description,
    url: absoluteUrl(args.path),
    serviceType: "EV charger installation quotes",
    provider: { "@id": `${site.url}/#organization` },
    areaServed: args.areaServed
      ? { "@type": "City", name: args.areaServed }
      : { "@type": "Country", name: "United Kingdom" },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "GBP",
      description: "Free, no-obligation quote comparison for homeowners",
    },
  };
}

/**
 * An installer's public profile as an `Electrician` (LocalBusiness subtype).
 * `aggregateRating` and `review` are emitted only when real reviews exist.
 */
export function installerSchema(args: {
  name: string;
  path: string;
  town: string;
  description?: string | null;
  /** Logo: a site-relative path or an absolute URL. */
  image?: string | null;
  areasServed?: string[];
  rating?: { average: number | null; count: number };
  /** Only the reviews that are rendered on the page. */
  reviews?: {
    rating: number;
    title: string;
    body: string;
    author_name: string;
    created_at: string;
  }[];
}): Json {
  const url = absoluteUrl(args.path);
  const areas = args.areasServed ?? [];
  const reviews = args.reviews ?? [];
  const hasRating =
    args.rating !== undefined &&
    args.rating.average !== null &&
    args.rating.count > 0;
  return {
    "@context": "https://schema.org",
    "@type": "Electrician",
    "@id": `${url}#business`,
    name: args.name,
    url,
    ...(args.description ? { description: args.description } : {}),
    ...(args.image
      ? {
          image: args.image.startsWith("/")
            ? absoluteUrl(args.image)
            : args.image,
        }
      : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: args.town,
      addressCountry: "GB",
    },
    ...(areas.length
      ? { areaServed: areas.map((name) => ({ "@type": "Place", name })) }
      : {}),
    ...(hasRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: args.rating?.average,
            reviewCount: args.rating?.count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(reviews.length
      ? {
          review: reviews.map((review) => ({
            "@type": "Review",
            name: review.title,
            reviewBody: review.body,
            datePublished: review.created_at,
            author: { "@type": "Person", name: review.author_name },
            reviewRating: {
              "@type": "Rating",
              ratingValue: review.rating,
              bestRating: 5,
              worstRating: 1,
            },
          })),
        }
      : {}),
  };
}
