"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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

export default function FAQClient() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-cream min-h-screen py-12 sm:py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="w-12 h-px bg-gold/40" />
            <span className="text-gold text-xs tracking-widest uppercase font-bold flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" /> Support
            </span>
            <span className="w-12 h-px bg-gold/40" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-jungle mb-4">Frequently Asked Questions</h1>
          <p className="text-jungle/60 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Find answers to common questions about our pieces, shipping, and policies.
          </p>
        </div>

        {/* FAQ Accordions */}
        <div className="space-y-12">
          {FAQS.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="font-sans text-xs tracking-[0.25em] font-bold text-gold uppercase border-b border-jungle/10 pb-2.5">
                {section.category}
              </h2>
              <div className="space-y-3">
                {section.questions.map((faq, fIdx) => {
                  const uniqueId = `${idx}-${fIdx}`;
                  const isExpanded = expandedId === uniqueId;
                  return (
                    <div 
                      key={fIdx} 
                      className="bg-ivory rounded-xl border border-jungle/10 hover:border-gold/30 shadow-xs overflow-hidden transition-all duration-300"
                    >
                      <button
                        onClick={() => toggleExpand(uniqueId)}
                        className="w-full px-5 py-4 sm:py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer group"
                      >
                        <h3 className="font-display text-sm sm:text-base text-jungle font-semibold group-hover:text-gold transition-colors pr-4">
                          {faq.q}
                        </h3>
                        <ChevronDown 
                          className={`w-4 h-4 text-jungle/50 shrink-0 transition-transform duration-300 ${
                            isExpanded ? "rotate-180 text-gold" : "group-hover:text-gold"
                          }`} 
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <div className="px-5 pb-5 sm:pb-6 text-xs sm:text-sm text-jungle/70 leading-relaxed border-t border-jungle/5 pt-3 bg-cream/20">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Support Card */}
        <div className="mt-12 sm:mt-20 bg-jungle text-ivory rounded-xl p-6 sm:p-8 text-center border border-gold/15 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-15">
            <Sparkles className="w-12 h-12 text-gold" />
          </div>
          <h2 className="font-display text-2xl text-gold mb-3">Still have questions?</h2>
          <p className="text-ivory/80 text-xs sm:text-sm mb-6 max-w-lg mx-auto leading-relaxed">
            If you couldn&apos;t find the answer you were looking for, our customer care team is here to help.
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-gold hover-shimmer text-jungle px-8 py-3 rounded-lg font-bold tracking-widest uppercase hover:bg-gold-light transition-all text-xs sm:text-sm shadow-md active:scale-95"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
