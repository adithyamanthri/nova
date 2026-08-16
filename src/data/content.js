/* ------------------------------------------------------------------ */
/*  BIG PAINTS — site content                                          */
/*  Edit this file to swap in real products, colors & details.         */
/* ------------------------------------------------------------------ */

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Shades', href: '#shades' },
  { label: 'Colors', href: '#colors' },
  { label: 'Products', href: '#products' },
  { label: 'Services', href: '#services' },
  { label: 'Visualizer', href: '#visualizer' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export const CONTACT_INFO = {
  brand: 'BIG PAINTS',
  tagline: 'Your trusted destination for premium paints and painting solutions.',
  address: '42 Color Avenue, Design District, Mumbai 400001, India',
  phone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  hours: [
    { day: 'Monday – Saturday', time: '9:00 AM – 8:00 PM' },
    { day: 'Sunday', time: '10:00 AM – 6:00 PM' },
  ],
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mumbai+Design+District',
}

/* The Shade Lab — 15 liquid paint pools */
export const SHADES = [
  { name: 'Pure White', code: '#F6F4EF', finish: 'Premium Matt', tagline: 'Clean. Calm. Endless.' },
  { name: 'Pearl', code: '#EFE7DA', finish: 'Silk', tagline: 'Soft light, warm glow.' },
  { name: 'Sand', code: '#D9C8A9', finish: 'Matt', tagline: 'Grounding warmth.' },
  { name: 'Beige', code: '#C9B79A', finish: 'Matt', tagline: 'Timeless neutrality.' },
  { name: 'Coral', code: '#FF7A6B', finish: 'Silk', tagline: 'Playful. Bold. Alive.' },
  { name: 'Rose', code: '#F58FB4', finish: 'Satin', tagline: 'Gentle romance.' },
  { name: 'Crimson', code: '#C73E3A', finish: 'Silk', tagline: 'Dramatic confidence.' },
  { name: 'Sunset Orange', code: '#E8632A', finish: 'Silk', tagline: 'Energy in every stroke.' },
  { name: 'Golden Yellow', code: '#F2B134', finish: 'Silk', tagline: 'Sunshine, bottled.' },
  { name: 'Ocean Blue', code: '#2FA8DC', finish: 'Silk', tagline: 'Depth and clarity.' },
  { name: 'Royal Blue', code: '#2457D6', finish: 'Premium Matt', tagline: 'Majestic and precise.' },
  { name: 'Emerald', code: '#2E8B57', finish: 'Silk', tagline: 'Fresh. Natural. Timeless.' },
  { name: 'Forest', code: '#1F5C45', finish: 'Matt', tagline: 'Quiet luxury.' },
  { name: 'Charcoal', code: '#2B2B30', finish: 'Matt', tagline: 'Modern gravity.' },
  { name: 'Midnight', code: '#12122A', finish: 'Premium Matt', tagline: 'Mysterious depth.' },
]

export const COLOR_COLLECTION = [
  { name: 'Arctic White', hex: '#F4F1EA', rgb: '244, 241, 234', finish: 'Matt', family: 'Whites' },
  { name: 'Royal Blue', hex: '#2B4A9B', rgb: '43, 74, 155', finish: 'Silk', family: 'Blues' },
  { name: 'Forest Green', hex: '#1F5C45', rgb: '31, 92, 69', finish: 'Matt', family: 'Greens' },
  { name: 'Sunset Orange', hex: '#E8632A', rgb: '232, 99, 42', finish: 'Silk', family: 'Warm' },
  { name: 'Rose Pink', hex: '#E87FA5', rgb: '232, 127, 165', finish: 'Satin', family: 'Pinks' },
  { name: 'Ocean Blue', hex: '#1E88B8', rgb: '30, 136, 184', finish: 'Silk', family: 'Blues' },
  { name: 'Sand Beige', hex: '#C9B79A', rgb: '201, 183, 154', finish: 'Matt', family: 'Neutrals' },
  { name: 'Charcoal Black', hex: '#2B2B30', rgb: '43, 43, 48', finish: 'Matt', family: 'Neutrals' },
]

export const PRODUCTS = [
  {
    id: 'interior-luxe',
    category: 'Interior Paints',
    name: 'Interior Luxe Silk',
    description: 'Silky-smooth, washable interior emulsion with rich colour depth.',
    finish: 'Silk Finish',
    colors: ['#F4F1EA', '#2B4A9B', '#E8632A', '#2B2B30'],
    price: '₹4,200 / 20L',
    gradient: ['#3b4a6b', '#1c2436'],
  },
  {
    id: 'exterior-shield',
    category: 'Exterior Paints',
    name: 'WeatherShield Max',
    description: 'Heavy-duty exterior paint that resists rain, sun and pollution.',
    finish: 'Matt + UV Guard',
    colors: ['#E8E2D2', '#1E88B8', '#1F5C45'],
    price: '₹5,600 / 20L',
    gradient: ['#2f5d50', '#16281f'],
  },
  {
    id: 'primer-plus',
    category: 'Primers',
    name: 'PrimeLock Undercoat',
    description: 'High-adhesion primer that seals surfaces for a flawless finish.',
    finish: 'Water-based',
    colors: ['#EDEAE2', '#D9D4C8'],
    price: '₹1,900 / 20L',
    gradient: ['#4a4650', '#22202a'],
  },
  {
    id: 'wood-finish',
    category: 'Wood Finishes',
    name: 'Golden Oak Polish',
    description: 'Deep, lustrous wood finish that protects and enriches timber.',
    finish: 'High Gloss',
    colors: ['#8a5a2b', '#c8913f', '#5a3a1e'],
    price: '₹3,400 / 5L',
    gradient: ['#7a4f26', '#3a2410'],
  },
  {
    id: 'waterproof-coat',
    category: 'Waterproofing',
    name: 'AquaSeal Barrier',
    description: 'Elastomeric waterproof coating that keeps walls dry for years.',
    finish: 'Elastomeric',
    colors: ['#dce8ec', '#9fb8c0'],
    price: '₹4,800 / 20L',
    gradient: ['#2e4a55', '#15242b'],
  },
  {
    id: 'texture-art',
    category: 'Textures',
    name: 'Texture Art Stone',
    description: 'Sculptural wall textures for dramatic feature walls.',
    finish: 'Textured',
    colors: ['#cfc6b4', '#8f8574', '#e5dfd2'],
    price: '₹2,700 / 5kg',
    gradient: ['#5a5244', '#26221b'],
  },
  {
    id: 'roller-kit',
    category: 'Accessories',
    name: 'Pro Roller & Brush Kit',
    description: 'Complete professional application kit for a perfect finish.',
    finish: 'Tool Kit',
    colors: ['#e8e2d2', '#2b2b30'],
    price: 'Contact for Price',
    gradient: ['#3a3f47', '#181b20'],
  },
]

export const SERVICES = [
  {
    icon: 'roller',
    title: 'Interior Painting',
    description: 'Flawless walls and ceilings with premium emulsions, delivered on time and on budget.',
  },
  {
    icon: 'building',
    title: 'Exterior Painting',
    description: 'Weatherproof facades that protect your home and keep it looking brand new.',
  },
  {
    icon: 'palette',
    title: 'Color Consultation',
    description: 'Expert color experts help you find the palette that fits your space and your life.',
  },
  {
    icon: 'texture',
    title: 'Texture Painting',
    description: 'Designer textures and finishes that add depth, drama and character to any wall.',
  },
  {
    icon: 'droplets',
    title: 'Waterproofing',
    description: 'Permanent protection against seepage, dampness and monsoon damage.',
  },
  {
    icon: 'store',
    title: 'Commercial Painting',
    description: 'Large-scale painting for offices, showrooms and retail — with zero downtime.',
  },
  {
    icon: 'home',
    title: 'Residential Painting',
    description: 'Complete home transformations, from single rooms to full-house projects.',
  },
]

export const STATS = [
  { value: 10, suffix: '+', label: 'Years Experience' },
  { value: 5000, suffix: '+', label: 'Happy Customers' },
  { value: 100, suffix: '+', label: 'Color Options' },
  { value: 100, suffix: '%', label: 'Premium Quality' },
]

export const TESTIMONIALS = [
  {
    name: 'Aarav Mehta',
    location: 'Andheri, Mumbai',
    rating: 5,
    text: 'The team painted our entire apartment in three days and the finish is unreal. The color consultation alone was worth it — our living room feels twice as big now.',
    color: '#ff6b5e',
  },
  {
    name: 'Sneha Iyer',
    location: 'Powai, Mumbai',
    rating: 5,
    text: 'I was nervous about choosing dark colors. Their visualizer showed me exactly how it would look. Forest Green in our bedroom — best decision ever.',
    color: '#4ecf8e',
  },
  {
    name: 'Rohan Kapoor',
    location: 'Bandra, Mumbai',
    rating: 5,
    text: 'BIG PAINTS is the only place we trust for our cafes. They understand commercial timelines and the quality is always consistent across sites.',
    color: '#57c8f2',
  },
  {
    name: 'Priya Sharma',
    location: 'Thane',
    rating: 4,
    text: 'From picking the paint to the final coat, everything felt premium. The WhatsApp updates kept us informed at every step. Highly recommended.',
    color: '#ffb454',
  },
  {
    name: 'Vikram Singh',
    location: 'Lower Parel, Mumbai',
    rating: 5,
    text: 'Their waterproofing solution fixed a decade-old seepage problem. Two monsoons later, still perfectly dry. These people know their craft.',
    color: '#9d8cf6',
  },
  {
    name: 'Ananya Desai',
    location: 'Juhu, Mumbai',
    rating: 5,
    text: 'Texture painting on our feature wall looks like art. Guests always ask who did it. Worth every rupee.',
    color: '#f58fb4',
  },
]

export const VISUALIZER_ROOMS = [
  {
    id: 'living',
    name: 'Living Room',
    desc: 'Open, airy space with a large window wall.',
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    desc: 'Cozy retreat with a warm, calm atmosphere.',
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    desc: 'Bright functional space with clean lines.',
  },
]
