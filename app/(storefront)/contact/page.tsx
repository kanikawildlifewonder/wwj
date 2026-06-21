import React from "react";
import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contact Us | WWJ — Wildlife Wonder Jewellery",
  description: "Get in touch with Wildlife Wonder Jewellery. Contact us for inquiries about our handcrafted animal jewellery collections, custom pieces, or orders.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Us | WWJ - Wildlife Wonder Jewellery",
    "description": "Get in touch with Wildlife Wonder Jewellery. Contact us for inquiries about our handcrafted animal jewellery collections, custom pieces, or orders.",
    "url": "https://wildlifewonderjewellery.com/contact",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-98490-77246",
      "contactType": "customer service",
      "email": "hello@wildlifewonderjewellery.com",
      "areaServed": "IN",
      "availableLanguage": ["en"]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactClient />
    </>
  );
}
