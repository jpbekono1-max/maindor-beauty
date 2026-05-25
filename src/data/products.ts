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
  stock: "En stock" | "Sur commande" | "Confection personnalisée";
  colors?: string[];
  lengths?: string[];
};

export const products: Product[] = [
  { slug: "perruque-lace-frontal-naturelle", name: "Perruque Lace Frontal Naturelle", description: "Cheveux 100% naturels, lace HD invisible", longDescription: "Perruque haut de gamme confectionnée avec des cheveux 100% naturels et une lace HD ultra-fine pour un fondu parfait avec votre peau.", price: 185000, image: p1, category: "Perruques Naturelles", texture: "Lisse", badge: "Nouveau", rating: 5, stock: "En stock", colors: ["Naturel","Noir","Brun"], lengths: ["18\"","20\"","22\"","24\""] },
  { slug: "bob-wig-lisse", name: "Bob Wig Lisse", description: "Carré court chic, prêt à porter", longDescription: "Le bob iconique pour un look moderne et sophistiqué au quotidien.", price: 95000, image: p2, category: "Perruques Synthétiques", texture: "Lisse", rating: 4, stock: "En stock", colors: ["Blond","Noir","Brun"], lengths: ["12\"","14\""] },
  { slug: "perruque-body-wave-26", name: "Perruque Body Wave 26\"", description: "Ondulations naturelles longueur extrême", longDescription: "Volume et mouvement avec ce body wave 26 pouces, idéal pour les grandes occasions.", price: 210000, oldPrice: 240000, image: p3, category: "Perruques Naturelles", texture: "Bouclé", badge: "Promo", rating: 5, stock: "En stock", colors: ["Naturel","Noir"], lengths: ["24\"","26\"","28\""] },
  { slug: "kit-soin-professionnel", name: "Kit Soin Professionnel Perruque", description: "Hydratation, démêlage, brillance", longDescription: "Routine complète pour entretenir vos perruques et prolonger leur durée de vie.", price: 25000, image: p4, category: "Soins", rating: 5, stock: "En stock" },
  { slug: "perruque-afro-kinky", name: "Perruque Afro Kinky", description: "Texture afro authentique et volumineuse", longDescription: "Embrassez votre essence avec ce kinky afro, fidèle à votre texture naturelle.", price: 120000, image: p5, category: "Perruques Naturelles", texture: "Afro", rating: 5, stock: "Sur commande", colors: ["Naturel","Noir"], lengths: ["14\"","16\"","18\""] },
  { slug: "accessoire-pose-lace", name: "Accessoire Pose Lace", description: "Colle + dissolvant professionnel", longDescription: "Le duo essentiel pour une pose lace impeccable et un retrait en douceur.", price: 8500, image: p6, category: "Accessoires", badge: "Nouveau", rating: 4, stock: "En stock" },
];

// Generate extra catalog items
const extra: Product[] = Array.from({ length: 6 }).map((_, i) => {
  const base = products[i % products.length];
  return { ...base, slug: `${base.slug}-v${i+2}`, name: `${base.name} Édition ${i+2}` };
});

export const catalog: Product[] = [...products, ...extra];

export const formatFCFA = (n: number) => `${n.toLocaleString("fr-FR")} FCFA`;