import React from "react";
import Link from "next/link";

export const metadata = {
  title: "FAQ | WWJ",
  description: "Frequently asked questions about WWJ products, shipping, and returns.",
};

const FAQS = [
  {
    category: "Orders & Shipping",
    questions: [
      {
        q: "Where do you ship?",
        a: "We currently ship pan-India. International shipping to select countries (US, UK, UAE, Australia) will be available later this year."
      },
      {
        q: "How long will my order take to arrive?",
        a: "Standard shipping within India takes 3-5 business days. Metro cities usually receive orders within 2-3 days. All pieces are dispatched from our Mumbai studio."
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes! We offer free standard shipping on all orders over ₹1,499 within India. For orders below this amount, a flat shipping fee of ₹99 applies."
      }
    ]
  },
  {
    category: "Products & Care",
    questions: [
      {
        q: "What materials do you use?",
        a: "Our jewellery is crafted using high-quality brass or 925 sterling silver, plated with 18k gold or rhodium. We use cubic zirconia, enamel, and semi-precious stones for detailing. All pieces are nickel-free and hypoallergenic."
      },
      {
        q: "How should I care for my WWJ jewellery?",
        a: "To keep your piece looking its best, avoid contact with water, perfumes, lotions, and harsh chemicals. Store it in the WWJ pouch provided when not in use. Wipe gently with a soft cloth after wearing."
      },
      {
        q: "Do you offer repairs?",
        a: "We offer a 6-month warranty on manufacturing defects. If your piece requires repair outside of warranty, we offer repair services for a nominal fee. Please contact hello@wwj.com with photos of your item."
      }
    ]
  },
  {
    category: "Returns & Exchanges",
    questions: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 7 days of delivery for unworn items in their original packaging. Earrings cannot be returned for hygiene reasons unless defective. Please note that return shipping costs are the responsibility of the customer."
      },
      {
        q: "How do I initiate a return?",
        a: "Email us at hello@wwj.com with your order number and reason for return. Our team will provide you with a Return Authorization and shipping instructions."
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <div className="bg-cream min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl text-jungle mb-4">Frequently Asked Questions</h1>
          <p className="text-jungle/60 text-lg">
            Find answers to common questions about our pieces, shipping, and policies.
          </p>
        </div>

        <div className="space-y-16">
          {FAQS.map((section, idx) => (
            <div key={idx}>
              <h2 className="font-display text-2xl text-gold mb-6 border-b border-jungle/10 pb-2">
                {section.category}
              </h2>
              <div className="space-y-6">
                {section.questions.map((faq, fIdx) => (
                  <div key={fIdx} className="bg-ivory rounded-xl p-6 border border-jungle/10 shadow-sm">
                    <h3 className="font-sans font-bold text-lg text-jungle mb-2">{faq.q}</h3>
                    <p className="text-jungle/70 leading-relaxed text-sm md:text-base">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-jungle text-ivory rounded-xl p-8 text-center">
          <h2 className="font-display text-2xl text-gold mb-4">Still have questions?</h2>
          <p className="text-ivory/80 mb-6 max-w-lg mx-auto">
            If you couldn&apos;t find the answer you were looking for, our customer care team is here to help.
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-gold text-jungle px-8 py-3 rounded-btn font-bold tracking-widest uppercase hover:bg-ivory transition-colors text-sm"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
