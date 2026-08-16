import tplPortfolio from "@/assets/tpl-portfolio.jpg";
import tplRestaurant from "@/assets/tpl-restaurant.jpg";
import tplEcommerce from "@/assets/tpl-ecommerce.jpg";
import tplAgency from "@/assets/tpl-agency.jpg";
import tplCafe from "@/assets/tpl-cafe.jpg";
import tplSaas from "@/assets/tpl-saas.jpg";

export type Template = {
  slug: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  price: number; // 0 = free
  tone: string; // gradient classes for preview
  accent: string;
  image: string;
  features: string[];
  pages: string[];
  tech: string[];
};

export const templates: Template[] = [
  {
    slug: "aurora-portfolio",
    title: "Aurora Portfolio",
    category: "Portfolio",
    tagline: "A luminous personal portfolio for designers and developers.",
    description:
      "Aurora is a dark-mode-first portfolio template with fluid gradients, a curated projects grid, and a slow-scroll case study layout. Built with clean, semantic HTML/CSS so you can drop in your own content in minutes.",
    price: 0,
    tone: "from-violet-500/50 to-fuchsia-500/50",
    accent: "Violet",
    image: tplPortfolio,
    features: [
      "6 fully designed sections",
      "Case study detail page",
      "Blog-ready markup",
      "Smooth scroll interactions",
      "Mobile-first responsive",
    ],
    pages: ["Home", "Work", "About", "Case Study", "Contact"],
    tech: ["HTML5", "CSS3", "Vanilla JS"],
  },
  {
    slug: "bistro-landing",
    title: "Bistro Landing",
    category: "Restaurant",
    tagline: "Warm, appetite-inducing template for restaurants and bistros.",
    description:
      "Bistro pairs a hero reservation CTA with a scrollable menu, chef's story, and gallery. Designed to convert hungry visitors into diners.",
    price: 1499,
    tone: "from-amber-500/50 to-rose-500/50",
    accent: "Amber",
    image: tplRestaurant,
    features: [
      "Reservation form section",
      "Menu with categories",
      "Chef & story block",
      "Google Maps embed",
      "Instagram gallery grid",
    ],
    pages: ["Home", "Menu", "Reservations", "About", "Contact"],
    tech: ["HTML5", "CSS3", "AOS"],
  },
  {
    slug: "threadline-store",
    title: "Threadline Store",
    category: "E-commerce",
    tagline: "Minimal fashion storefront with a cart-first mindset.",
    description:
      "Threadline is a boutique-style e-commerce template with product grid, filter drawer, product detail, and a slide-out cart. Ships with a checkout page and order confirmation flow.",
    price: 2999,
    tone: "from-cyan-500/50 to-blue-500/50",
    accent: "Cyan",
    image: tplEcommerce,
    features: [
      "Product listing + filters",
      "Product detail page",
      "Slide-out cart drawer",
      "Checkout & confirmation",
      "Wishlist ready",
    ],
    pages: ["Shop", "Product", "Cart", "Checkout", "Account"],
    tech: ["HTML5", "CSS3", "Alpine.js"],
  },
  {
    slug: "studio-mono",
    title: "Studio Mono",
    category: "Agency",
    tagline: "Bold, editorial-grade layout for design and dev agencies.",
    description:
      "Studio Mono is a confident, editorial template with oversized typography, marquee client logos, and a services-first structure. Perfect for a solo studio or a small team.",
    price: 1499,
    tone: "from-emerald-500/50 to-teal-500/50",
    accent: "Emerald",
    image: tplAgency,
    features: [
      "Editorial hero with marquee",
      "Services accordion",
      "Case study carousel",
      "Team + culture blocks",
      "Contact studio form",
    ],
    pages: ["Home", "Services", "Work", "About", "Contact"],
    tech: ["HTML5", "CSS3", "GSAP"],
  },
  {
    slug: "cafe-noir",
    title: "Café Noir",
    category: "Café",
    tagline: "Cozy café template with menu, hours, and story.",
    description:
      "Café Noir feels like a favorite neighborhood spot — warm typography, honest photography slots, and a menu built to browse on mobile.",
    price: 999,
    tone: "from-orange-500/50 to-red-500/50",
    accent: "Orange",
    image: tplCafe,
    features: [
      "Menu with pricing",
      "Opening hours block",
      "Owner story section",
      "Location + directions",
      "Newsletter signup",
    ],
    pages: ["Home", "Menu", "About", "Visit", "Contact"],
    tech: ["HTML5", "CSS3"],
  },
  {
    slug: "founder-deck",
    title: "Founder Deck",
    category: "SaaS",
    tagline: "Conversion-focused landing page for early-stage SaaS.",
    description:
      "Founder Deck comes wired for growth: a benefit-driven hero, feature bento, pricing table with a highlighted tier, and a trust-heavy footer. Ready to plug into your analytics.",
    price: 1999,
    tone: "from-indigo-500/50 to-sky-500/50",
    accent: "Indigo",
    image: tplSaas,
    features: [
      "Benefit-driven hero",
      "Feature bento grid",
      "Pricing with toggle",
      "FAQ accordion",
      "Trust logos + testimonials",
    ],
    pages: ["Home", "Pricing", "Changelog", "Docs", "Login"],
    tech: ["HTML5", "CSS3", "Alpine.js"],
  },
];

export const getTemplate = (slug: string) =>
  templates.find((t) => t.slug === slug);
