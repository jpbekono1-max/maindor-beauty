import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, MessageCircle, Phone, MapPin, Mail } from "lucide-react";
import logo from "@/assets/logo.png";

export function SiteFooter() {
  return (
    <footer className="bg-gradient-noir text-secondary-foreground">
      <div className="container mx-auto grid gap-12 px-4 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3">
            <img src={logo} alt="" className="h-14 w-14 rounded-full bg-white/5"/>
            <div>
              <div className="font-display text-2xl text-gradient-gold">Main d'or</div>
              <div className="text-xs uppercase tracking-[0.3em] opacity-70">Beauty</div>
            </div>
          </div>
          <p className="mt-4 text-sm opacity-70">L'art de sublimer votre beauté. Perruques, coiffure, onglerie et formations à Yaoundé.</p>
        </div>
        <div>
          <h4 className="font-display text-lg mb-4 text-gradient-gold">Navigation</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/" className="hover:text-primary">Accueil</Link></li>
            <li><Link to="/boutique" className="hover:text-primary">Boutique</Link></li>
            <li><Link to="/services" className="hover:text-primary">Services</Link></li>
            <li><Link to="/galerie" className="hover:text-primary">Galerie</Link></li>
            <li><Link to="/a-propos" className="hover:text-primary">À Propos</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg mb-4 text-gradient-gold">Contact</h4>
          <ul className="space-y-3 text-sm opacity-80">
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary"/> Yaoundé, Cameroun</li>
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-primary"/> +237 693 881 451</li>
            <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-primary"/> contact@maindorbeauty.cm</li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg mb-4 text-gradient-gold">Suivez-nous</h4>
          <div className="flex gap-3">
            <a href="#" aria-label="Instagram" className="h-10 w-10 rounded-full border border-primary/30 inline-flex items-center justify-center hover:bg-primary hover:text-secondary transition"><Instagram className="h-4 w-4"/></a>
            <a href="#" aria-label="Facebook" className="h-10 w-10 rounded-full border border-primary/30 inline-flex items-center justify-center hover:bg-primary hover:text-secondary transition"><Facebook className="h-4 w-4"/></a>
            <a href="https://wa.me/237693881451" aria-label="WhatsApp" className="h-10 w-10 rounded-full border border-primary/30 inline-flex items-center justify-center hover:bg-primary hover:text-secondary transition"><MessageCircle className="h-4 w-4"/></a>
          </div>
          <p className="mt-6 text-xs opacity-60">Horaires : Lun–Sam 8h–19h<br/>Dim sur RDV</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs opacity-60">
        © 2025 Main d'or Beauty. Tous droits réservés.
      </div>
    </footer>
  );
}