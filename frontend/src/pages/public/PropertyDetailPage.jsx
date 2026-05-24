import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { propertyApi, favoriteApi, reservationApi, paymentApi, reviewApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import { IconStar } from "../../components/ui/Icons";
import { PropertyLocation, PropertyFactsDetail } from "../../components/property/PropertyMeta";
import { formatPrice, formatCategory, formatStatus } from "../../utils/format";
import { propertyImage, propertyImageKey } from "../../constants/images";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [reservation, setReservation] = useState({ startDate: "", endDate: "", notes: "" });
  const [review, setReview] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    Promise.all([propertyApi.get(id), reviewApi.list(id)])
      .then(([p, r]) => {
        setProperty(p.data.data);
        setReviews(r.data.data ?? []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading property…" />;
  if (!property) {
    return (
      <div className="container-page py-24 text-center bg-white">
        <h1 className="font-display text-3xl font-semibold">Property not found</h1>
        <Link to="/listings" className="btn-primary mt-6 inline-flex">Back to listings</Link>
      </div>
    );
  }

  const dbImages = property.images?.filter((i) => i.url && !i.url.includes("placehold.co")) ?? [];
  const images =
    dbImages.length > 0
      ? dbImages.map((img) => ({
          ...img,
          url: propertyImage({ ...property, images: [img] }),
        }))
      : [{ id: "fallback", url: propertyImage(property) }];
  const mainImage = images[activeImage]?.url ?? images[0].url;
  const galleryKey = propertyImageKey(property);

  const handleFavorite = async () => {
    try {
      await favoriteApi.add(id);
      toast.success("Saved to your favorites");
    } catch (e) {
      toast.error(e.response?.data?.message ?? "Could not save");
    }
  };

  const handleReserve = async (e) => {
    e.preventDefault();
    try {
      await reservationApi.create({ propertyId: id, ...reservation });
      toast.success("Your visit request was sent");
      setReservation({ startDate: "", endDate: "", notes: "" });
    } catch (e) {
      toast.error(e.response?.data?.message ?? "Could not submit request");
    }
  };

  const handlePurchase = async () => {
    try {
      const res = await paymentApi.initialize(id);
      await paymentApi.simulate(res.data.data.payment.id);
      toast.success("Congratulations — this property is yours");
      const updated = await propertyApi.get(id);
      setProperty(updated.data.data);
    } catch (e) {
      toast.error(e.response?.data?.message ?? "Could not complete purchase");
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await reviewApi.create({ propertyId: id, ...review });
      toast.success("Thank you for your review");
      const r = await reviewApi.list(id);
      setReviews(r.data.data);
      setReview({ rating: 5, comment: "" });
    } catch (e) {
      toast.error(e.response?.data?.message ?? "Could not post review");
    }
  };

  return (
    <div className="pb-20 bg-white">
      <div className="container-page pt-6">
        <nav className="text-caption mb-6">
          <Link to="/" className="text-[var(--color-brand)] hover:underline">Home</Link>
          <span className="mx-2 text-slate-300">/</span>
          <Link to="/listings" className="text-[var(--color-brand)] hover:underline">Properties</Link>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-ink">{property.title}</span>
        </nav>
      </div>

      <div className="container-page">
        <div className="grid gap-4 lg:grid-cols-[1fr_120px]">
          <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-[var(--color-border)] shadow-sm">
            <img
              key={`${galleryKey}-${activeImage}`}
              src={mainImage}
              alt={property.title}
              className="h-full w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex lg:flex-col gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={img.id ?? i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`shrink-0 rounded-lg overflow-hidden border-2 transition ${
                    activeImage === i ? "border-[var(--color-brand)]" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    key={`${img.id ?? i}-${galleryKey}`}
                    src={img.url}
                    alt=""
                    className="h-20 w-28 lg:w-full lg:h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container-page mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="badge-brand">{formatCategory(property.category)}</span>
            <span className={property.status === "AVAILABLE" ? "badge-available" : "badge bg-slate-200 text-slate-700"}>
              {formatStatus(property.status)}
            </span>
          </div>
          <h1 className="heading-display text-3xl md:text-4xl lg:text-[2.75rem] mt-3">
            {property.title}
          </h1>
          <PropertyLocation
            className="mt-3"
            address={property.address}
            city={property.city}
            state={property.state}
            country={property.country}
          />

          <div className="mt-8">
            <PropertyFactsDetail
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              areaSqft={property.areaSqft}
            />
          </div>

          <div className="mt-12">
            <h2 className="heading-section mb-4">Property details</h2>
            <p className="prose-block whitespace-pre-line">{property.description}</p>
          </div>

          <section className="mt-14">
            <h2 className="heading-section mb-6">Reviews</h2>
            {user && (
              <form onSubmit={handleReview} className="card p-6 mb-8 max-w-lg space-y-4 shadow-sm">
                <div>
                  <label className="text-label block mb-2">Your rating</label>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setReview({ ...review, rating: n })}
                        className={n <= review.rating ? "text-[var(--color-brand)]" : "text-slate-200"}
                      >
                        <IconStar filled={n <= review.rating} size="sm" />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  placeholder="Share your experience…"
                  rows={3}
                  className="input-field"
                  value={review.comment}
                  onChange={(e) => setReview({ ...review, comment: e.target.value })}
                />
                <button type="submit" className="btn-primary">Submit review</button>
              </form>
            )}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-caption">No reviews yet.</p>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="card p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-label text-ink">{r.user.firstName} {r.user.lastName}</p>
                      <div className="flex gap-0.5 text-[var(--color-brand)]">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <IconStar key={i} filled size="xs" />
                        ))}
                      </div>
                    </div>
                    {r.comment && <p className="mt-2 text-body">{r.comment}</p>}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6 md:p-8 shadow-lg border-2 border-[var(--color-brand-muted)]">
            <p className="font-display text-[1.75rem] leading-none font-semibold text-[var(--color-brand)] tracking-tight">
              {formatPrice(property.price, property.currency)}
            </p>
            <p className="text-caption mt-2">Listed price</p>

            {property.status === "AVAILABLE" ? (
              user ? (
                <div className="mt-6 space-y-3">
                  <button type="button" onClick={handlePurchase} className="btn-primary w-full">
                    Buy this property
                  </button>
                  <button type="button" onClick={handleFavorite} className="btn-secondary w-full">
                    Save to favorites
                  </button>
                </div>
              ) : (
                <div className="mt-6">
                  <p className="text-body mb-4">Sign in to reserve a visit or make an offer.</p>
                  <Link to="/login" className="btn-primary w-full text-center block">Sign in to continue</Link>
                </div>
              )
            ) : (
              <p className="mt-6 text-label">This property is no longer available.</p>
            )}

            {user && property.status === "AVAILABLE" && (
              <form onSubmit={handleReserve} className="mt-8 pt-8 border-t border-[var(--color-border)] space-y-4">
                <h3 className="text-label text-ink">Schedule a visit</h3>
                <input type="date" required className="input-field" value={reservation.startDate} onChange={(e) => setReservation({ ...reservation, startDate: e.target.value })} />
                <input type="date" required className="input-field" value={reservation.endDate} onChange={(e) => setReservation({ ...reservation, endDate: e.target.value })} />
                <textarea placeholder="Notes (optional)" rows={2} className="input-field" value={reservation.notes} onChange={(e) => setReservation({ ...reservation, notes: e.target.value })} />
                <button type="submit" className="btn-primary w-full">Request visit</button>
              </form>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
