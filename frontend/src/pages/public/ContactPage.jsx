import toast from "react-hot-toast";
import PageHero from "../../components/ui/PageHero";
import { images } from "../../constants/images";
import { locale } from "../../constants/locale";

export default function ContactPage() {
  return (
    <div className="bg-white">
      <PageHero
        image={images.contactHero}
        eyebrow="We are here to help"
        title="Contact us"
        description="Questions about a listing, a viewing, or your account? Send us a message."
      />

      <section className="section-pad">
        <div className="container-page grid lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20">
          <form
            className="card p-8 md:p-10 lg:p-12 space-y-6 shadow-sm"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Thanks! We will reply soon.");
            }}
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-label block mb-2">First name</label>
                <input required className="input-field" placeholder="Jane" />
              </div>
              <div>
                <label className="text-label block mb-2">Last name</label>
                <input required className="input-field" placeholder="Smith" />
              </div>
            </div>
            <div>
              <label className="text-label block mb-2">Email</label>
              <input required type="email" className="input-field" placeholder="you@email.com" />
            </div>
            <div>
              <label className="text-label block mb-2">Message</label>
              <textarea required rows={5} className="input-field" placeholder="How can we help?" />
            </div>
            <button type="submit" className="btn-primary w-full">Send message</button>
          </form>

          <div className="space-y-6">
            <img
              src={images.contact}
              alt=""
              className="rounded-xl w-full aspect-video object-cover border border-[var(--color-border)] shadow-sm"
            />
            <div className="card p-8">
              <h3 className="text-label text-ink text-lg mb-4">Visit our office</h3>
              <p className="prose-block">
                {locale.addressLine}
                <br />
                {locale.postalHint}, {locale.city}
                <br />
                {locale.country}
              </p>
            </div>
            <div className="card p-8 bg-[var(--color-brand-soft)] border-[var(--color-brand-muted)]">
              <h3 className="text-label text-ink text-lg mb-2">Call us</h3>
              <p className="font-display text-2xl font-semibold text-[var(--color-brand)] leading-tight">
                {locale.phone}
              </p>
              <p className="text-caption mt-2">Monday – Friday, 9am – 6pm (WAT)</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
