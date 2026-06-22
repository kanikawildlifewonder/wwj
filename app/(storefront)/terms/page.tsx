import React from "react";

export const metadata = {
  title: "Terms of Service | WWJ",
  description: "Terms and conditions for using the Wildlife Wonder Jewellery (WWJ) website.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="bg-cream min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-3xl bg-ivory p-8 md:p-12 rounded-xl border border-jungle/10 shadow-sm">
        <h1 className="font-display text-4xl text-jungle mb-8">Terms of Service</h1>
        
        <div className="prose prose-jungle max-w-none text-sm md:text-base text-jungle/80 space-y-6">
          <p className="text-jungle/50 italic">Last Updated: June 2026</p>

          <p>
            Welcome to WildLife Jewellery (WWJ). These terms and conditions outline the rules and regulations for the use of WWJ&apos;s Website, located at wwj.com.
          </p>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use WWJ if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h2 className="font-display text-2xl text-jungle pt-4">1. Products and Services</h2>
          <p>
            Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy. We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor&apos;s display of any color will be accurate.
          </p>

          <h2 className="font-display text-2xl text-jungle pt-4">2. Pricing and Availability</h2>
          <p>
            Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time. All items are subject to availability. We will inform you as soon as possible if the goods you have ordered are not available.
          </p>

          <h2 className="font-display text-2xl text-jungle pt-4">3. Accuracy of Billing and Account Information</h2>
          <p>
            We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the e-mail and/or billing address/phone number provided at the time the order was made.
          </p>

          <h2 className="font-display text-2xl text-jungle pt-4">4. Intellectual Property</h2>
          <p>
            Unless otherwise stated, WWJ and/or its licensors own the intellectual property rights for all material on WWJ. All intellectual property rights are reserved. You may access this from WWJ for your own personal use subjected to restrictions set in these terms and conditions.
          </p>

          <h2 className="font-display text-2xl text-jungle pt-4">5. Governing Law</h2>
          <p>
            These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India, specifically within the jurisdiction of Mumbai, Maharashtra.
          </p>

          <h2 className="font-display text-2xl text-jungle pt-4">6. Product Material Disclaimer</h2>
          <p>
            All jewelry products sold on Wildlife Wonder Jewellery (WWJ) are handcrafted imitation, fashion, and art jewelry. They are made of brass, alloy, resin, enamel, and other non-precious metals/materials. We do not sell or deal in precious metals (such as Gold, Silver, or Platinum) or precious stones/gems.
          </p>
        </div>
      </div>
    </div>
  );
}
