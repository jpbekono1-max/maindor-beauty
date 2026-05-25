import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/237693881451?text=Bonjour%20Main%20d'or%20Beauty"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter sur WhatsApp"
      className="fixed bottom-6 right-6 z-50 group flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-luxe hover:scale-110 transition-transform"
    >
      <MessageCircle className="h-7 w-7" />
      <span className="absolute right-full mr-3 hidden md:block whitespace-nowrap rounded bg-secondary px-3 py-1.5 text-xs text-secondary-foreground opacity-0 group-hover:opacity-100 transition">
        Discutons sur WhatsApp
      </span>
    </a>
  );
}