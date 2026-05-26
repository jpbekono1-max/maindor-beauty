import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";
import p5 from "@/assets/product-5.jpg";
import p6 from "@/assets/product-6.jpg";

export type Product = {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  texture?: string;
  badge?: "Nouveau" | "Promo" | "Sur commande";
  rating: number;
  reviews: number;
  stock: "En stock" | "Sur commande" | "Confection personnalisée";
  colors?: string[];
  lengths?: string[];
};

export const products: Product[] = [
  { slug: "perruque-lace-frontal-naturelle", name: "Perruque Lace Frontal Naturelle", description: "Cheveux 100% naturels, lace HD invisible", longDescription: "Perruque haut de gamme confectionnée avec des cheveux 100% naturels et une lace HD ultra-fine pour un fondu parfait avec votre peau.", price: 185000, image: p1, category: "Perruques Naturelles", texture: "Lisse", badge: "Nouveau", rating: 5, reviews: 42, stock: "En stock", colors: ["Naturel","Noir","Brun"], lengths: ["18\"","20\"","22\"","24\""] },
  { slug: "bob-wig-lisse", name: "Bob Wig Lisse", description: "Carré court chic, prêt à porter", longDescription: "Le bob iconique pour un look moderne et sophistiqué au quotidien.", price: 95000, image: p2, category: "Perruques Synthétiques", texture: "Lisse", rating: 4, reviews: 28, stock: "En stock", colors: ["Blond","Noir","Brun"], lengths: ["12\"","14\""] },
  { slug: "perruque-body-wave-26", name: "Perruque Body Wave 26\"", description: "Ondulations naturelles longueur extrême", longDescription: "Volume et mouvement avec ce body wave 26 pouces, idéal pour les grandes occasions.", price: 210000, oldPrice: 240000, image: p3, category: "Perruques Naturelles", texture: "Bouclé", badge: "Promo", rating: 5, reviews: 56, stock: "En stock", colors: ["Naturel","Noir"], lengths: ["24\"","26\"","28\""] },
  { slug: "kit-soin-professionnel", name: "Kit Soin Professionnel Perruque", description: "Hydratation, démêlage, brillance", longDescription: "Routine complète pour entretenir vos perruques et prolonger leur durée de vie.", price: 25000, image: p4, category: "Soins", rating: 5, reviews: 73, stock: "En stock" },
  { slug: "perruque-afro-kinky", name: "Perruque Afro Kinky", description: "Texture afro authentique et volumineuse", longDescription: "Embrassez votre essence avec ce kinky afro, fidèle à votre texture naturelle.", price: 120000, image: p5, category: "Perruques Naturelles", texture: "Afro", rating: 5, reviews: 34, stock: "Sur commande", colors: ["Naturel","Noir"], lengths: ["14\"","16\"","18\""] },
  { slug: "accessoire-pose-lace", name: "Accessoire Pose Lace", description: "Colle + dissolvant professionnel", longDescription: "Le duo essentiel pour une pose lace impeccable et un retrait en douceur.", price: 8500, image: p6, category: "Accessoires", badge: "Nouveau", rating: 4, reviews: 91, stock: "En stock" },
  { slug: "lace-frontal-13x6-hd", name: "Lace Frontal 13x6 HD", description: "Closure invisible haute densité", longDescription: "Lace frontal 13x6 HD pour un parting naturel et un fondu parfait. Densité 180%.", price: 145000, image: p1, category: "Lace Frontal", texture: "Lisse", rating: 5, reviews: 38, stock: "En stock", colors: ["Naturel","Noir"], lengths: ["16\"","18\"","20\""] },
  { slug: "lace-frontal-bouclee-22", name: "Lace Frontal Bouclée 22\"", description: "Boucles définies, finition luxe", longDescription: "Une cascade de boucles définies sur lace HD 13x4.", price: 165000, image: p3, category: "Lace Frontal", texture: "Bouclé", badge: "Nouveau", rating: 5, reviews: 21, stock: "En stock", colors: ["Naturel","Brun"], lengths: ["20\"","22\"","24\""] },
  { slug: "perruque-deep-wave-24", name: "Perruque Deep Wave 24\"", description: "Vagues profondes, brillance miroir", longDescription: "Deep wave 100% Remy hair, idéal pour un look glamour.", price: 195000, oldPrice: 220000, image: p3, category: "Perruques Naturelles", texture: "Bouclé", badge: "Promo", rating: 5, reviews: 47, stock: "En stock", colors: ["Naturel","Noir","#1B"], lengths: ["20\"","22\"","24\"","26\""] },
  { slug: "perruque-pixie-cut", name: "Perruque Pixie Cut", description: "Coupe courte audacieuse", longDescription: "Le pixie cut moderne pour les femmes affirmées.", price: 75000, image: p2, category: "Perruques Synthétiques", texture: "Lisse", rating: 4, reviews: 19, stock: "En stock", colors: ["Noir","Bordeaux","Blond"] },
  { slug: "perruque-kinky-curly-20", name: "Perruque Kinky Curly 20\"", description: "Boucles serrées, volume naturel", longDescription: "Kinky curly authentique, parfait pour célébrer votre nature.", price: 135000, image: p5, category: "Perruques Naturelles", texture: "Frisé", rating: 5, reviews: 31, stock: "Sur commande", colors: ["Naturel","Noir"], lengths: ["18\"","20\"","22\""] },
  { slug: "shampooing-hydratant-300ml", name: "Shampooing Hydratant 300ml", description: "Sans sulfate, pour perruques naturelles", longDescription: "Formule douce sans sulfate qui préserve la fibre capillaire.", price: 6500, image: p4, category: "Soins", rating: 4, reviews: 52, stock: "En stock" },
  { slug: "serum-brillance-100ml", name: "Sérum Brillance 100ml", description: "Anti-frisottis, fini soyeux", longDescription: "Sérum léger qui apporte brillance et discipline les pointes.", price: 7500, image: p4, category: "Soins", badge: "Nouveau", rating: 5, reviews: 27, stock: "En stock" },
  { slug: "tete-mannequin-pro", name: "Tête Mannequin Pro avec Trépied", description: "Support de styling professionnel", longDescription: "Tête mannequin avec trépied réglable, indispensable pour la confection.", price: 22000, image: p6, category: "Accessoires", rating: 4, reviews: 44, stock: "En stock" },
  { slug: "filet-perruque-pro", name: "Filet Perruque Pro (lot de 5)", description: "Maintien optimal, respirant", longDescription: "Lot de 5 filets pour préparer vos cheveux avant pose.", price: 4500, image: p6, category: "Accessoires", rating: 4, reviews: 67, stock: "En stock" },
  { slug: "vernis-gel-collection-or", name: "Vernis Gel Collection Or", description: "12 teintes signature", longDescription: "Collection exclusive de 12 vernis gel longue tenue.", price: 35000, image: p4, category: "Onglerie", badge: "Nouveau", rating: 5, reviews: 18, stock: "En stock" },
  { slug: "kit-nail-art-premium", name: "Kit Nail Art Premium", description: "Strass, paillettes, stickers", longDescription: "Tout pour créer des nail arts dignes d'un salon.", price: 18000, image: p6, category: "Onglerie", rating: 4, reviews: 23, stock: "En stock" },
  { slug: "perruque-sur-mesure-bridal", name: "Perruque Bridal Sur Mesure", description: "Confection personnalisée mariage", longDescription: "Une perruque conçue spécifiquement pour votre grand jour. Délai 7 à 14 jours.", price: 280000, image: p1, category: "Perruques Naturelles", texture: "Lisse", badge: "Sur commande", rating: 5, reviews: 15, stock: "Confection personnalisée", colors: ["Naturel","Noir","Brun","Châtain"], lengths: ["20\"","22\"","24\"","26\"","28\""] },
  { slug: "perruque-water-wave-22", name: "Perruque Water Wave 22\"", description: "Ondulations aquatiques fluides", longDescription: "Water wave naturel pour un effet plage glamour.", price: 175000, image: p3, category: "Perruques Naturelles", texture: "Body Wave", rating: 5, reviews: 36, stock: "En stock", colors: ["Naturel","Noir"], lengths: ["20\"","22\"","24\""] },
  { slug: "perruque-blonde-platinum", name: "Perruque Blonde Platinum 18\"", description: "Blond platine éclatant", longDescription: "Pré-coloré blond platine, lace transparent HD.", price: 220000, image: p2, category: "Perruques Naturelles", texture: "Lisse", badge: "Nouveau", rating: 5, reviews: 12, stock: "En stock", colors: ["#613","#27","Platinum"], lengths: ["16\"","18\"","20\""] },
  { slug: "masque-reparateur-500ml", name: "Masque Réparateur 500ml", description: "Soin intense hebdomadaire", longDescription: "Masque ultra-nourrissant à la kératine et huile d'argan.", price: 12000, image: p4, category: "Soins", rating: 5, reviews: 41, stock: "En stock" },
];

export const catalog: Product[] = products;

export const formatFCFA = (n: number) => `${n.toLocaleString("fr-FR")} FCFA`;