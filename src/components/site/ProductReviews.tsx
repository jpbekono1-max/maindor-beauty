import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

type Review = {
  id: string;
  product_slug: string;
  user_id: string;
  author_name: string;
  rating: number;
  title: string | null;
  comment: string;
  created_at: string;
};

export function ProductReviews({ productSlug }: { productSlug: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("product_slug", productSlug)
      .order("created_at", { ascending: false });
    if (!error && data) setReviews(data as Review[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [productSlug]);

  const myReview = user ? reviews.find(r => r.user_id === user.id) : null;
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const breakdown = [5, 4, 3, 2, 1].map(n => ({
    n,
    count: reviews.filter(r => r.rating === n).length,
    pct: reviews.length ? (reviews.filter(r => r.rating === n).length / reviews.length) * 100 : 0,
  }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (comment.trim().length < 3) { toast.error("Merci d'écrire un commentaire"); return; }
    setSubmitting(true);
    const authorName =
      (user.user_metadata?.full_name as string | undefined) ||
      user.email?.split("@")[0] ||
      "Cliente";
    const payload = {
      product_slug: productSlug,
      user_id: user.id,
      author_name: authorName,
      rating,
      title: title.trim() || null,
      comment: comment.trim(),
    };
    const { error } = myReview
      ? await supabase.from("product_reviews").update(payload).eq("id", myReview.id)
      : await supabase.from("product_reviews").insert(payload);
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success(myReview ? "Avis mis à jour" : "Merci pour votre avis !");
    setTitle(""); setComment(""); setRating(5);
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("product_reviews").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Avis supprimé");
    load();
  };

  return (
    <section className="py-20 bg-muted/40">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-2xl md:text-3xl mb-10">Avis clientes</h2>

        <div className="grid lg:grid-cols-3 gap-10 mb-12">
          <div className="bg-card border border-border rounded-md p-6 text-center">
            <div className="font-display text-5xl" style={{ color: "var(--gold-dark)" }}>
              {avg.toFixed(1)}
            </div>
            <div className="flex justify-center gap-0.5 my-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < Math.round(avg) ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              {reviews.length} avis
            </p>
          </div>
          <div className="lg:col-span-2 space-y-2">
            {breakdown.map(b => (
              <div key={b.n} className="flex items-center gap-3 text-xs">
                <span className="w-12 flex items-center gap-1">{b.n} <Star className="h-3 w-3 fill-primary text-primary" /></span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-gold" style={{ width: `${b.pct}%` }} />
                </div>
                <span className="w-8 text-right text-muted-foreground">{b.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {loading && <p className="text-sm text-muted-foreground">Chargement…</p>}
          {!loading && reviews.length === 0 && (
            <p className="text-sm text-muted-foreground">Aucun avis pour le moment. Soyez la première !</p>
          )}
          {reviews.map(r => (
            <div key={r.id} className="bg-card border border-border rounded-md p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString("fr-FR")}
                </span>
              </div>
              {r.title && <p className="font-semibold text-sm mb-1">{r.title}</p>}
              <p className="text-sm">{r.comment}</p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs uppercase tracking-widest" style={{ color: "var(--gold-dark)" }}>
                  {r.author_name}
                </p>
                {user?.id === r.user_id && (
                  <button onClick={() => remove(r.id)} className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-destructive">
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto bg-card border border-border rounded-md p-6 md:p-8">
          <h3 className="font-display text-xl mb-4">
            {myReview ? "Modifier votre avis" : "Laisser un avis"}
          </h3>
          {!user ? (
            <p className="text-sm text-muted-foreground">
              <Link to="/connexion" className="text-primary underline">Connectez-vous</Link> pour publier votre avis.
            </p>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--gold-dark)" }}>Note</p>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const v = i + 1;
                    const active = (hover || rating) >= v;
                    return (
                      <button
                        key={v} type="button"
                        onMouseEnter={() => setHover(v)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setRating(v)}
                        aria-label={`${v} étoile${v > 1 ? "s" : ""}`}
                      >
                        <Star className={`h-7 w-7 ${active ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest" style={{ color: "var(--gold-dark)" }}>Titre (optionnel)</label>
                <input
                  type="text" value={title} onChange={e => setTitle(e.target.value)} maxLength={120}
                  className="mt-2 w-full px-4 py-3 border border-border rounded-sm bg-background focus:outline-none focus:border-primary"
                  placeholder="Excellente qualité"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest" style={{ color: "var(--gold-dark)" }}>Votre avis *</label>
                <textarea
                  value={comment} onChange={e => setComment(e.target.value)} required maxLength={1000} rows={4}
                  className="mt-2 w-full px-4 py-3 border border-border rounded-sm bg-background focus:outline-none focus:border-primary"
                  placeholder="Partagez votre expérience…"
                />
              </div>
              <button
                type="submit" disabled={submitting}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-gold text-secondary font-semibold rounded-sm hover:shadow-luxe transition disabled:opacity-60"
              >
                {submitting ? "Envoi…" : myReview ? "Mettre à jour" : "Publier mon avis"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}