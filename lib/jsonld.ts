const BASE_URL = 'https://maonoforextrading.co.za'

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Maono Forex Trading',
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+27814369770',
      contactType: 'customer service',
      areaServed: 'ZA',
      availableLanguage: 'English',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Unit 3B Waterside Place, 19 Carl Cronje Drive',
      addressLocality: 'Tyger Waterfront',
      addressRegion: 'Western Cape',
      postalCode: '7530',
      addressCountry: 'ZA',
    },
    sameAs: [],
  }
}

export function courseJsonLd(course: {
  title: string
  description: string
  slug: string
  price: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    url: `${BASE_URL}/courses/${course.slug}`,
    provider: {
      '@type': 'Organization',
      name: 'Maono Forex Trading',
      url: BASE_URL,
    },
    offers: {
      '@type': 'Offer',
      price: course.price,
      priceCurrency: 'ZAR',
      availability: 'https://schema.org/InStock',
    },
  }
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}
