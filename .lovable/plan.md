## Phase 2 — Marketplace, Comptes & Suivi

Le périmètre est très large. Je propose de le découper en lots livrables, en gardant intacts le design system, l'en-tête, le pied de page et toutes les pages déjà créées.

---

### Lot A — Panier complet + Favoris (frontend, localStorage)
1. **Page `/panier`** (full cart)
   - Colonne items : miniature, nom, options (couleur/longueur/densité), prix unitaire, sélecteur quantité, supprimer, sauvegarder
   - Colonne récap : sous-total, livraison (dropdown Yaoundé 2 000 / Hors Yaoundé 5 000 / Retrait 0), promo code, total
   - État vide avec illustration + CTA boutique
   - Icônes paiement (MTN, Orange, livraison)
2. **Mini-cart dropdown** (desktop hover) déclenché depuis l'icône panier existante
3. **Wishlist (`WishlistContext`)** localStorage
   - Toggle cœur sur `ProductCard` et page produit
   - Page `/favoris` (grille + ajout panier)
   - Icône cœur dans le header avec compteur
4. **Codes promo** dans `CartContext` (BIENVENUE10 -10%, MARIAGE2025 -15% bridal, FORMATION50 -50 000 FCFA training, sinon erreur)

### Lot B — Checkout 3 étapes (frontend, sans backend)
1. **`/commande/coordonnees`** : nom, WhatsApp (+237 XXX XXX XXX auto-formaté, validation zod), email optionnel, ville, quartier, note. Indicateur d'étapes ①②③.
2. **`/commande/paiement`** : 3 cartes livraison + 4 cartes paiement (MTN, Orange, livraison, WhatsApp). Récap sticky à droite.
3. **`/commande/confirmation`** : checkmark animé, numéro `#MD-2025-XXXX`, prochaines étapes, CTA suivi & WhatsApp.
4. **State** : données checkout dans `CheckoutContext` (sessionStorage) pour persister entre étapes.
5. **Toasts** sonner pour succès / erreur.

### Lot C — Authentification (Lovable Cloud)
1. Tables : `profiles` (user_id, full_name, whatsapp, email, city, address) + trigger `handle_new_user`.
2. Pages `/connexion`, `/inscription`, `/mot-de-passe-oublie`, `/reset-password`.
3. Auth email/password + Google (via `lovable.auth.signInWithOAuth` + `configure_social_auth`).
4. Listener `onAuthStateChange` global, sync wishlist locale → DB au login.

### Lot D — Espace Client + Commandes en base
1. Tables : `orders` (order_number, status, totals, delivery, payment, customer snapshot), `order_items` (snapshot produit + options), `order_status_history`, `wishlist_items`, `promo_codes` (lecture seule pour MVP).
2. Server functions (TanStack) :
   - `placeOrder` (publique, sans auth requis — accepte invité ou user) → insère via `supabaseAdmin`, génère `order_number`
   - `getMyOrders`, `getOrderById` (auth)
   - `trackOrder` (publique, par order_number + whatsapp)
3. **Page `/suivi-commande`** : formulaire + timeline statuts (5 étapes).
4. **`/mon-compte`** avec sidebar : Profil, Commandes (badges statuts colorés), Favoris, RDV (placeholder), Formations (placeholder), Déconnexion.

### Lot E — Avis produits
1. Table `product_reviews` (product_slug, user_id, rating, title, body, helpful_count) + RLS (lecture publique, écriture si auth + a commandé).
2. Bloc avis sur page produit : moyenne, barres breakdown, cartes avis, bouton "Laisser un avis" (modal — étoiles, titre, texte, photos optionnelles via Supabase Storage `review-photos`).
3. Bouton "Utile ?" incrémente compteur.

### Lot F — Finitions & UX globales
1. WhatsApp flottant déjà présent — vérifier message pré-rempli par contexte (déjà fait sur page produit).
2. Boutons "Commande sur mesure" et "Formation" avec messages WhatsApp pré-remplis.
3. Bouton "Back to top" sur pages longues.
4. Skeletons sur grilles produits, spinners boutons soumission.
5. Formatage FCFA cohérent (espace milliers).
6. SEO : meta uniques par page produit (déjà partiellement fait — vérifier).

---

### Détails techniques

- **Stack** : pas de nouvelle lib. Réutilise `CartContext`, `ProductCard`, design tokens existants (`--gold`, `--gradient-gold`, etc.).
- **Auth** : Lovable Cloud (Supabase) avec email/password + Google (broker Lovable). Profiles table + trigger.
- **DB grants** : chaque migration inclut GRANT + RLS.
- **Serveur** : `createServerFn` pour toutes les opérations (jamais d'edge function pour la logique app).
- **Pas d'envoi email** : la confirmation est uniquement on-screen + WhatsApp (cohérent avec le besoin business à Yaoundé). Le flow email reste désactivé jusqu'à demande explicite.
- **Numéros marchands MTN/Orange** : placeholders `XXX XXX XXX` à remplacer par le client (note inline dans le code).

### Ordre de livraison proposé

Je suggère de livrer **Lot A + B en premier** (panier + checkout entièrement fonctionnel côté frontend, sans backend) — cela donne déjà un parcours d'achat complet via WhatsApp. Puis **Lot C + D** (auth + commandes persistées). Puis **E + F**.

**Question** : je commence par **Lot A + B uniquement** dans ce message, puis on enchaîne ? Ou bien tu veux que j'aille jusqu'au bout dans une grande série de messages successifs ?
