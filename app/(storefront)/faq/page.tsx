import React from "react";
import FAQClient from "./FAQClient";

export const metadata = {
  title: "Frequently Asked Questions (FAQ) | WWJ",
  description: "Find answers to questions about shipping rates, materials, product care, warranty, returns, and exchanges for Wildlife Wonder Jewellery.",
  alternates: {
    canonical: "/faq",
  },
};

export default function FAQPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Where do you ship?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We currently ship pan-India. International shipping to select countries (US, UK, UAE, Australia) will be available later this year."
        }
      },
      {
        "@type": "Question",
        "name": "How long will my order take to arrive?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Standard shipping within India takes 3-5 business days. Metro cities usually receive orders within 2-3 days. All pieces are dispatched from our Mumbai studio."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer free shipping?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We offer free standard shipping on all orders over ₹1,499 within India. For orders below this amount, a flat shipping fee of ₹99 applies."
        }
      },
      {
        "@type": "Question",
        "name": "What materials do you use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our jewellery is crafted using high-quality brass or 925 sterling silver, plated with 18k gold or rhodium. We use cubic zirconia, enamel, and semi-precious stones for detailing. All pieces are nickel-free and hypoallergenic."
        }
      },
      {
        "@type": "Question",
        "name": "How should I care for my WWJ jewellery?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To keep your piece looking its best, avoid contact with water, perfumes, lotions, and harsh chemicals. Store it in the WWJ pouch provided when not in use. Wipe gently with a soft cloth after wearing."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer repairs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer a 6-month warranty on manufacturing defects. If your piece requires repair outside of warranty, we offer repair services for a nominal fee. Please contact hello@wwj.com with photos of your item."
        }
      },
      {
        "@type": "Question",
        "name": "What is your return policy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We accept returns within 7 days of delivery for unworn items in their original packaging. Earrings cannot be returned for hygiene reasons unless defective. Please note that return shipping costs are the responsibility of the customer."
        }
      },
      {
        "@type": "Question",
        "name": "How do I initiate a return?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Email us at hello@wwj.com with your order number and reason for return. Our team will provide you with a Return Authorization and shipping instructions."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FAQClient />
    </>
  );
}
