import type { Testimonial } from "@/lib/types";

// SAMPLE REVIEWS — placeholders for layout only.
// Replace with genuine guest reviews (and their real Google / Tripadvisor links) before launch.

export const testimonials: Testimonial[] = [
  {
    id: "r1",
    name: "Giulia & Marco",
    country: "Italy",
    flag: "🇮🇹",
    rating: 5,
    quote: {
      en: "Our guide spoke perfect Italian and knew every hidden corner. The train to Ella and the Yala safari were unforgettable!",
      it: "La nostra guida parlava un italiano perfetto e conosceva ogni angolo nascosto. Il treno per Ella e il safari a Yala sono stati indimenticabili!",
    },
    source: "tripadvisor",
    link: "https://www.tripadvisor.com/",
    date: "2026-03-12",
  },
  {
    id: "r2",
    name: "Famiglia Rossi",
    country: "Italy",
    flag: "🇮🇹",
    rating: 5,
    quote: {
      en: "Travelling with two kids was effortless — child seats, pools at every hotel and a guide who made history fun for them.",
      it: "Viaggiare con due bambini è stato facilissimo — seggiolini, piscina in ogni hotel e una guida che ha reso la storia divertente per loro.",
    },
    source: "google",
    link: "https://g.page/",
    date: "2026-02-03",
  },
  {
    id: "r3",
    name: "Sophie L.",
    country: "France",
    flag: "🇫🇷",
    rating: 5,
    quote: {
      en: "Every detail was perfect, from the airport welcome to the cooking class in the village. Highly recommended.",
      it: "Ogni dettaglio era perfetto, dall'accoglienza in aeroporto al corso di cucina nel villaggio. Consigliatissimo.",
    },
    source: "google",
    link: "https://g.page/",
    date: "2026-01-20",
  },
  {
    id: "r4",
    name: "Andrea B.",
    country: "Switzerland",
    flag: "🇨🇭",
    rating: 5,
    quote: {
      en: "Nishan adapted our itinerary every day based on the weather and our energy. It felt like travelling with a friend.",
      it: "Nishan ha adattato l'itinerario ogni giorno in base al meteo e alla nostra energia. Sembrava di viaggiare con un amico.",
    },
    source: "tripadvisor",
    link: "https://www.tripadvisor.com/",
    date: "2025-12-08",
  },
  {
    id: "r5",
    name: "Thomas K.",
    country: "Germany",
    flag: "🇩🇪",
    rating: 4,
    quote: {
      en: "Comfortable van, safe driving and great hotel choices. Sigiriya at sunrise was the highlight of our year.",
      it: "Van confortevole, guida sicura e ottima scelta degli hotel. Sigiriya all'alba è stato il momento più bello del nostro anno.",
    },
    source: "google",
    link: "https://g.page/",
    date: "2025-11-15",
  },
];
