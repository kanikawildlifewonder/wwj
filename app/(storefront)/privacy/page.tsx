import React from "react";

export const metadata = {
  title: "Privacy Policy | WWJ",
  description: "Privacy Policy for Wildlife Wonder Jewellery (WWJ). Learn how we collect, use, and protect your personal data.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="bg-cream min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-3xl bg-ivory p-8 md:p-12 rounded-xl border border-jungle/10 shadow-sm">
        <h1 className="font-display text-4xl text-jungle mb-8">Privacy Policy</h1>
        
        <div className="prose prose-jungle max-w-none text-sm md:text-base text-jungle/80 space-y-6">
          <p className="text-jungle/50 italic">Last Updated: June 2026</p>

          <p>
            At WildLife Jewellery (&quot;WWJ&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
          </p>

          <h2 className="font-display text-2xl text-jungle pt-4">1. Information We Collect</h2>
          <p>
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
            <li><strong>Financial Data:</strong> includes payment card details (processed securely by our payment partners; we do not store this).</li>
            <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
            <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
          </ul>

          <h2 className="font-display text-2xl text-jungle pt-4">2. How We Use Your Information</h2>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., fulfilling an order).</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal obligation.</li>
          </ul>

          <h2 className="font-display text-2xl text-jungle pt-4">3. Data Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
          </p>

          <h2 className="font-display text-2xl text-jungle pt-4">4. Third-Party Links</h2>
          <p>
            This website may include links to third-party websites, plug-ins, and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
          </p>

          <h2 className="font-display text-2xl text-jungle pt-4">5. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> hello@wwj.com<br />
            <strong>Address:</strong> 123 Artisan Lane, Bandra West, Mumbai, Maharashtra 400050, India
          </p>
        </div>
      </div>
    </div>
  );
}
