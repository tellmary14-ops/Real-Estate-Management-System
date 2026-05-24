import { Link } from "react-router-dom";
import { appConfig } from "../../config";
import { images } from "../../constants/images";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-[calc(100vh-72px)] grid lg:grid-cols-2 bg-white">
      <div className="hidden lg:block relative">
        <img src={images.auth} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-slate-900/60" />
        <div className="relative h-full flex flex-col justify-end p-12 text-white">
          <Link to="/" className="inline-flex items-center gap-3 mb-auto pt-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-brand)] font-display text-xl font-bold">
              G
            </span>
            <span className="font-display text-2xl font-semibold">{appConfig.appName}</span>
          </Link>
          <p className="font-display text-4xl font-semibold leading-tight max-w-md">
            Your next home is waiting.
          </p>
          <p className="mt-4 text-slate-300 max-w-sm">{appConfig.tagline}</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="font-display text-2xl font-semibold text-[var(--color-brand)]">
              {appConfig.appName}
            </Link>
          </div>
          <h1 className="heading-display text-3xl">{title}</h1>
          {subtitle && <p className="mt-3 text-lead">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
