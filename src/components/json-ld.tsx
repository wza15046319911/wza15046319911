import { profile } from "@/lib/data";

export function JsonLd() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Zian Wang",
    alternateName: "Zane Wang",
    url: "https://lewiswang.com.au",
    email: `mailto:${profile.email}`,
    jobTitle: "Full Stack Developer",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Melbourne",
      addressCountry: "AU",
    },
    sameAs: [profile.github, profile.linkedin, profile.instagram],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
    />
  );
}
