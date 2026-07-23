import React from "react";
import { notFound } from "next/navigation";
import { getPageContent } from "@/app/actions/content";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

const POLICY_TITLES: Record<string, string> = {
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  returns: "Return & Refund Policy",
  shipping: "Shipping & Delivery Policy",
};

const DEFAULT_POLICIES: Record<string, string> = {
  privacy: `
# Privacy Policy

At **WWJ - Wildlife Wonder Jewellery**, we value your privacy and are committed to protecting your personal data.

### Information We Collect
We collect personal information that you provide to us when placing an order, subscribing to our newsletter, or contacting us, including:
- Name and Email Address
- Shipping and Billing Address
- Contact Phone Number

### How We Use Your Information
- To process, fulfill, and manage your orders.
- To communicate order updates and tracking details.
- To send updates, promotional offers, and news about our wildlife initiatives if opted in.

### Data Security
We implement strict security measures to protect your personal information and transactions. We do not sell or rent your data to third parties.
  `,
  terms: `
# Terms of Service

Welcome to **WWJ - Wildlife Wonder Jewellery**. By accessing or using our website, you agree to comply with and be bound by the following terms.

### General Conditions
- All products listed are handcrafted fashion/imitation jewellery made of brass, alloy, and non-precious metals.
- Prices are subject to change without notice.

### Intellectual Property
All content on this site including text, designs, images, and logos are the property of WWJ. Unauthorized duplication or reproduction is strictly prohibited.
  `,
  returns: `
# Return & Refund Policy

We want you to love your **WWJ** pieces! If you receive a damaged or incorrect item, we are here to help.

### Return Window
- You may request a return or replacement within **7 days** of delivery for damaged, defective, or incorrect items.

### Return Conditions
- Items must be unused, in original packaging, with tags intact.
- Video proof of unboxing is required for damaged/missing claims.

### Refunds
- Upon verification, refunds will be processed to the original payment method within 5–7 business days.
  `,
  shipping: `
# Shipping & Delivery Policy

### Shipping Coverage
We ship across India! All orders are packed with eco-friendly materials and handled with care.

### Delivery Timelines
- **Standard Shipping**: 3 to 7 business days.
- Free shipping applies on orders above the minimum order threshold (standard ₹1499).

### Tracking
Once dispatched, tracking links will be shared via email and SMS.
  `,
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = POLICY_TITLES[slug] ?? "Policy";
  return {
    title: `${title} | WWJ Wildlife Wonder Jewellery`,
    description: `Read the official ${title} for WWJ Wildlife Wonder Jewellery.`,
  };
}

export default async function PolicyPage({ params }: Props) {
  const { slug } = await params;

  if (!POLICY_TITLES[slug]) {
    notFound();
  }

  const dbContent = await getPageContent(`policy-${slug}`);
  const title = POLICY_TITLES[slug];
  const markdownText = dbContent || DEFAULT_POLICIES[slug];

  return (
    <main className="min-h-screen bg-cream text-jungle py-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto bg-white border border-border rounded-2xl p-6 sm:p-12 shadow-sm">
        <h1 className="font-display text-3xl sm:text-4xl text-jungle border-b border-border pb-6 mb-8">
          {title}
        </h1>
        <div className="prose prose-sm sm:prose-base max-w-none text-jungle/80 space-y-4 whitespace-pre-line leading-relaxed">
          {markdownText}
        </div>
      </div>
    </main>
  );
}
