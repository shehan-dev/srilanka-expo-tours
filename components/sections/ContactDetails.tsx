import { Clock, Headphones, Mail, MapPin, Phone } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { site } from "@/lib/site";
import { MapView } from "@/components/map/MapView";
import { TelegramIcon, WhatsappIcon } from "@/components/ui/SocialIcons";

export function ContactDetails({ dict }: { dict: Dictionary }) {
  const t = dict.contact;
  const text = encodeURIComponent(t.prefill);

  return (
    <div className="flex flex-col gap-5">
      <div className="card flex flex-col gap-4 p-6">
        <h2 className="text-xl font-semibold">{t.office}</h2>
        <address className="flex flex-col gap-3 text-[15px] not-italic">
          <p className="flex gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent-700" aria-hidden />
            {site.address.street}, {site.address.city}, {site.address.region}, {site.address.country}
          </p>
          <a href={site.phoneHref} className="flex gap-3 hover:text-primary">
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-accent-700" aria-hidden />
            {site.phone}
          </a>
          <a href={`mailto:${site.email}`} className="flex gap-3 hover:text-primary">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-accent-700" aria-hidden />
            {site.email}
          </a>
        </address>
        <div className="flex flex-col gap-2 border-t border-line pt-4 text-sm">
          <p className="flex gap-3">
            <Clock className="h-5 w-5 shrink-0 text-accent-700" aria-hidden />
            <span>
              <strong className="block font-semibold">{t.hours}</strong>
              {t.hoursText}
            </span>
          </p>
          <p className="flex gap-3">
            <Headphones className="h-5 w-5 shrink-0 text-accent-700" aria-hidden />
            <span>
              <span aria-hidden>🇮🇹 </span>
              {t.italianSupport}
            </span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`https://wa.me/${site.whatsapp}?text=${text}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm bg-[#25D366] text-ink"
          >
            <WhatsappIcon width={18} height={18} /> WhatsApp
          </a>
          <a href={`https://t.me/${site.telegram}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm bg-[#229ED9] text-white">
            <TelegramIcon width={18} height={18} /> Telegram
          </a>
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold tracking-wide text-muted uppercase">{t.meetingPoint}</h2>
        <MapView
          className="h-64"
          label={t.meetingPoint}
          points={[{ id: "office", coords: site.meetingPoint, title: site.name, subtitle: `${site.address.street}, ${site.address.city}, ${site.address.region}` }]}
        />
      </div>
    </div>
  );
}
