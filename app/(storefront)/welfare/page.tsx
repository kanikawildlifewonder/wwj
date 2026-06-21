import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart, PawPrint, Feather } from "lucide-react";

export const metadata = {
  title: "Welfare & Awareness | WWJ",
  description: "Join WWJ in our compassionate initiatives supporting stray animal nourishment, cow sanctuaries, and urban bird preservation.",
  alternates: {
    canonical: "/welfare",
  },
};

const initiatives = [
  {
    id: "paws",
    title: "WWJ – Donate Food for Paws",
    subtitle: "Nourish a Friend in Need",
    image: "/images/welfare/food-for-paws.jpg",
    description:
      "A heartfelt initiative dedicated to helping hungry cats and dogs by collecting pet food for local shelters and rescue organizations. Every donation provides nourishment, hope, and a second chance to animals in need. Join us in making a difference—one bowl at a time.",
    points: [
      "Give a hungry animal hope.",
      "Support local shelters.",
      "Make a difference, one meal at a time."
    ],
    motto: "Be a Hero. Fill a Bowl. Share The Love!",
    icon: PawPrint,
    accentColor: "border-orange-200 text-orange-600 bg-orange-50/50",
  },
  {
    id: "cows",
    title: "WWJ – Create Homes for Cows",
    subtitle: "A Sanctuary of Love & Peace",
    image: "/images/welfare/homes-for-cows.jpg",
    description:
      "A compassionate initiative dedicated to providing safe, loving shelters for rescued and abandoned cows. By supporting local goshalas and cow sanctuaries, you help ensure these gentle animals receive proper care, nourishment, and protection. Together, we can create a future where every cow has a peaceful place to call home.",
    points: [
      "Give a cow a loving home.",
      "Support local Goushalas.",
      "Promote ethical cow care."
    ],
    motto: "Be a Hero. Offer Them a Safe Haven.",
    icon: Heart,
    accentColor: "border-emerald-200 text-emerald-600 bg-emerald-50/50",
  },
  {
    id: "wings",
    title: "WWJ – Little Wings Project",
    subtitle: "Be a Guardian of Little Wings!",
    image: "/images/welfare/little-wings.jpg",
    description:
      "A dedicated effort to protect and support our local bird populations. In the scorching summer heat and urban sprawl, birds struggle to find water, food, and safe nesting places. By installing feeders, water bowls, and sparrow nest boxes, we can make our balconies and parks sanctuary spaces.",
    points: [
      "Install bird feeders in parks, terraces, balconies.",
      "Put water bowls for summer heat.",
      "Add nesting boxes for sparrows and mynas."
    ],
    motto: "Be a Guardian of Little Wings!",
    icon: Feather,
    accentColor: "border-sky-200 text-sky-600 bg-sky-50/50",
  },
];

export default function WelfarePage() {
  return (
    <div className="bg-cream min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[55vh] min-h-120 -mt-20 md:-mt-30 lg:-mt-35 flex items-center justify-center overflow-hidden group">
        <div className="absolute inset-0 bg-jungle z-0">
          <Image 
            src="/wildlife-bg.png" 
            alt="Welfare Background"
            fill
            priority
            className="object-cover opacity-40 transition-transform duration-[10s] ease-out group-hover:scale-105"
          />
          {/* Decorative soft gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-jungle/50 to-jungle/90" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto space-y-4 pt-25 md:pt-37.5 lg:pt-45">
          <span className="text-gold text-xs sm:text-sm tracking-[0.3em] font-sans font-bold uppercase block">
            Compassion In Action
          </span>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl text-ivory tracking-wide">
            Welfare & Awareness
          </h1>
          <div className="w-20 h-0.5 bg-gold mx-auto my-3"></div>
          <p className="text-base sm:text-lg text-ivory/80 font-light leading-relaxed max-w-2xl mx-auto">
            At WWJ, our love for nature and wildlife extends beyond our jewellery designs. We commit our resources and community to support gentle animals, birds, and pets.
          </p>
        </div>
      </section>

      {/* Welfare Initiatives Grid */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="font-display text-3xl sm:text-4xl text-jungle">
              Our Core Pillars
            </h2>
            <p className="text-jungle/60 text-sm sm:text-base leading-relaxed">
              Every purchase you make on WWJ contributes directly to these grassroots initiatives. Discover how we work together to feed, shelter, and protect.
            </p>
          </div>

          {/* Modern Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {initiatives.map((item) => {
              const IconComponent = item.icon;
              return (
                <div 
                  key={item.id}
                  className="bg-white/80 border border-border/40 rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square w-full overflow-hidden bg-ivory">
                    <Image 
                      src={item.image} 
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-contain"
                      priority={item.id === "paws"}
                    />
                    
                    {/* Badge Icon */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-md text-jungle group-hover:text-gold transition-colors duration-300">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-6 sm:p-8 grow flex flex-col space-y-6">
                    <div className="space-y-2">
                      <span className="text-gold text-xs tracking-wider font-semibold uppercase block">
                        {item.subtitle}
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl text-jungle group-hover:text-gold-dark transition-colors duration-300">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-sm text-jungle/70 leading-relaxed font-light">
                      {item.description}
                    </p>

                    {/* Points highlight box */}
                    <div className={`p-4 border rounded-xl space-y-2 ${item.accentColor}`}>
                      <ul className="space-y-1.5 text-xs font-medium">
                        {item.points.map((pt, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="mt-1 font-bold">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grow" />

                    {/* Footer motto & action */}
                    <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <p className="text-xs font-serif italic text-jungle/60">
                        {item.motto}
                      </p>
                      <Link 
                        href="/shop"
                        className="inline-flex items-center gap-1 text-xs font-bold tracking-widest text-jungle hover:text-gold uppercase group/link transition-colors whitespace-nowrap"
                      >
                        Shop Now 
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 sm:py-20 bg-jungle text-ivory text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] bg-size-[16px_16px]" />
        <div className="relative z-10 container mx-auto px-4 max-w-3xl space-y-6">
          <h2 className="font-display text-2xl sm:text-4xl">
            You Shop, We Give Back
          </h2>
          <p className="text-sm sm:text-base text-ivory/70 max-w-xl mx-auto leading-relaxed">
            By choosing WWJ, you support ethical fashion that protects. 5% of our profits are directly distributed among pet shelters, Goushalas, and community bird programs.
          </p>
          <div className="pt-4">
            <Link 
              href="/shop" 
              className="inline-flex items-center justify-center bg-gold text-jungle px-8 py-3.5 text-xs font-bold tracking-widest uppercase hover:bg-gold-light transition-all rounded-md shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              Shop Our Collection <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
