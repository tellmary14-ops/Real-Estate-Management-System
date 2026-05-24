import { images } from "./images";

export const stats = [
  { value: "128K+", label: "Happy clients" },
  { value: "300+", label: "Locations" },
  { value: "15K+", label: "Properties sold" },
  { value: "98%", label: "Satisfaction rate" },
];

export const howItWorks = [
  {
    title: "Search",
    text: "Browse homes by city, type, and budget.",
    icon: "search",
  },
  {
    title: "Choose",
    text: "Compare listings and save your favorites.",
    icon: "choose",
  },
  {
    title: "Contact",
    text: "Book a visit with our team.",
    icon: "contact",
  },
  {
    title: "Buy",
    text: "Complete your purchase with confidence.",
    icon: "buy",
  },
];

export const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Home buyer",
    text: "They made finding our first home simple. Every step felt personal and clear.",
    rating: 5,
    avatar: "SM",
  },
  {
    name: "James Okonkwo",
    role: "Investor",
    text: "Professional from start to finish. The listings were accurate and well presented.",
    rating: 5,
    avatar: "JO",
  },
  {
    name: "Emily Chen",
    role: "Relocated family",
    text: "We found the perfect place in under two weeks. Highly recommend their team.",
    rating: 5,
    avatar: "EC",
  },
];

export const neighborhoods = [
  { name: "Maitama", image: images.neighborhoods[0], count: "42 homes" },
  { name: "Asokoro", image: images.neighborhoods[1], count: "38 homes" },
  { name: "Wuse II", image: images.neighborhoods[2], count: "56 homes" },
  { name: "Garki", image: images.neighborhoods[3], count: "31 homes" },
];

export const agents = [
  {
    name: "David Richardson",
    role: "Senior agent",
    sold: "120+ sold",
    image: images.agents[0],
  },
  {
    name: "Maria Lopez",
    role: "Luxury specialist",
    sold: "95+ sold",
    image: images.agents[1],
  },
  {
    name: "Kevin Brooks",
    role: "Commercial lead",
    sold: "80+ sold",
    image: images.agents[2],
  },
  {
    name: "Anna Petrov",
    role: "First-time buyers",
    sold: "70+ sold",
    image: images.agents[3],
  },
];

export const articles = [
  {
    title: "5 tips for first-time home buyers",
    date: "Mar 12, 2026",
    image: images.articles[0],
    slug: "tips-first-time-buyers",
  },
  {
    title: "How to prepare your home for sale",
    date: "Feb 28, 2026",
    image: images.articles[1],
    slug: "prepare-home-sale",
  },
  {
    title: "Understanding property value in 2026",
    date: "Feb 10, 2026",
    image: images.articles[2],
    slug: "property-value-2026",
  },
];

export const propertyFilterGroups = [
  { id: "all", label: "All", categories: null },
  { id: "residential", label: "Residential", categories: ["HOUSE", "APARTMENT", "VILLA"] },
  { id: "commercial", label: "Commercial", categories: ["COMMERCIAL"] },
  { id: "land", label: "Land", categories: ["LAND"] },
];

export const priceRanges = [
  { label: "Any price", min: "", max: "" },
  { label: "Under ₦50M", min: "", max: "50000000" },
  { label: "₦50M – ₦100M", min: "50000000", max: "100000000" },
  { label: "₦100M – ₦200M", min: "100000000", max: "200000000" },
  { label: "₦200M+", min: "200000000", max: "" },
];
