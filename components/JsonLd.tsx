export function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Zian Wang",
    alternateName: "Lewis Wang",
    url: "https://lewiswang.com.au",
    image: "https://lewiswang.com.au/og-image.png",
    sameAs: [
      "https://github.com/wza15046319911",
      "https://www.linkedin.com/in/zian-wang-39081b225/",
    ],
    jobTitle: "Senior Full Stack Developer",
    worksFor: {
      "@type": "Organization",
      name: "Broadsheet Media",
    },
    description:
      "Senior Full Stack Developer with 5+ years experience building scalable web applications with React, Next.js, Node.js, TypeScript, and cloud technologies.",
    knowsAbout: [
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
      "Python",
      "PostgreSQL",
      "MongoDB",
      "Docker",
      "Kubernetes",
      "AWS",
      "GCP",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Brisbane",
      addressRegion: "QLD",
      addressCountry: "AU",
    },
    email: "mailto:zianwang9911@gmail.com",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Zian Wang Portfolio",
    url: "https://lewiswang.com.au",
    description:
      "Portfolio website of Zian Wang, Senior Full Stack Developer based in Brisbane, Australia.",
    author: {
      "@type": "Person",
      name: "Zian Wang",
    },
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: "Zian Wang",
    },
    dateCreated: "2024-01-01",
    dateModified: new Date().toISOString().split("T")[0],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(profilePageSchema),
        }}
      />
    </>
  );
}
