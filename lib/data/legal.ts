import type { L10n } from "@/lib/types";

// TEMPLATE LEGAL TEXT — have these reviewed by a lawyer (Sri Lankan law + EU GDPR for Italian guests)
// before going live. Each page is a list of sections rendered by app/[lang]/legal/[slug]/page.tsx.

export const legalSlugs = ["terms", "privacy", "cookies", "cancellation", "insurance", "accessibility"] as const;
export type LegalSlug = (typeof legalSlugs)[number];

interface Section {
  heading: L10n;
  body: L10n;
}

export const legalUpdated = "2026-10-01";

export const legalPages: Record<LegalSlug, Section[]> = {
  terms: [
    {
      heading: { en: "1. Who we are", it: "1. Chi siamo" },
      body: {
        en: "SriLanka Expo Tours is a licensed tour operator registered in Sri Lanka. These terms apply to every tour, transfer and service booked through this website, by email, WhatsApp or phone.",
        it: "SriLanka Expo Tours è un tour operator autorizzato registrato in Sri Lanka. I presenti termini si applicano a ogni tour, transfer e servizio prenotato tramite questo sito, via email, WhatsApp o telefono.",
      },
    },
    {
      heading: { en: "2. Quotes and booking", it: "2. Preventivi e prenotazione" },
      body: {
        en: "Prices shown on the website are indicative. A booking is confirmed only when we send a written confirmation and receive the deposit stated in your quote.",
        it: "I prezzi indicati sul sito sono indicativi. Una prenotazione è confermata solo dopo il nostro invio di una conferma scritta e la ricezione dell'acconto indicato nel preventivo.",
      },
    },
    {
      heading: { en: "3. Payments", it: "3. Pagamenti" },
      body: {
        en: "The balance is due by the date shown in your confirmation. Card payments are processed by our payment provider; we never store full card details.",
        it: "Il saldo è dovuto entro la data indicata nella conferma. I pagamenti con carta sono gestiti dal nostro fornitore di pagamenti; non memorizziamo mai i dati completi della carta.",
      },
    },
    {
      heading: { en: "4. Changes by us", it: "4. Modifiche da parte nostra" },
      body: {
        en: "Weather, road conditions or events beyond our control may require changes to the itinerary. We will always offer an alternative of equal or higher value where possible.",
        it: "Meteo, condizioni stradali o eventi al di fuori del nostro controllo possono richiedere modifiche all'itinerario. Offriremo sempre, ove possibile, un'alternativa di valore pari o superiore.",
      },
    },
    {
      heading: { en: "5. Your responsibilities", it: "5. Le tue responsabilità" },
      body: {
        en: "You are responsible for valid passports, visas/ETA, travel insurance and for informing us of any medical conditions or dietary needs relevant to your tour.",
        it: "Sei responsabile di passaporto valido, visto/ETA, assicurazione di viaggio e di informarci di eventuali condizioni mediche o esigenze alimentari rilevanti per il tour.",
      },
    },
  ],
  privacy: [
    {
      heading: { en: "What we collect", it: "Quali dati raccogliamo" },
      body: {
        en: "When you send a booking or quote request we collect your name, contact details, travel dates, number of travellers and any details you choose to share in your message.",
        it: "Quando invii una richiesta di prenotazione o preventivo raccogliamo nome, recapiti, date di viaggio, numero di viaggiatori e qualsiasi dettaglio tu scelga di condividere nel messaggio.",
      },
    },
    {
      heading: { en: "How we use it", it: "Come li utilizziamo" },
      body: {
        en: "Only to prepare your quote, organise your trip (hotels, guides, transport) and contact you about it. We never sell your data. Newsletter emails are sent only if you subscribe, and you can unsubscribe at any time.",
        it: "Solo per preparare il preventivo, organizzare il viaggio (hotel, guide, trasporti) e contattarti al riguardo. Non vendiamo mai i tuoi dati. La newsletter viene inviata solo se ti iscrivi e puoi annullare l'iscrizione in qualsiasi momento.",
      },
    },
    {
      heading: { en: "Your rights (GDPR)", it: "I tuoi diritti (GDPR)" },
      body: {
        en: "You may request access to, correction or deletion of your personal data at any time by writing to info@srilankaexpotours.com.",
        it: "Puoi richiedere in qualsiasi momento l'accesso, la rettifica o la cancellazione dei tuoi dati personali scrivendo a info@srilankaexpotours.com.",
      },
    },
  ],
  cookies: [
    {
      heading: { en: "Essential storage", it: "Archiviazione essenziale" },
      body: {
        en: "We store your language choice (NEXT_LOCALE cookie) and preferred currency (browser storage) so the site remembers your settings.",
        it: "Memorizziamo la lingua scelta (cookie NEXT_LOCALE) e la valuta preferita (archiviazione del browser) affinché il sito ricordi le tue impostazioni.",
      },
    },
    {
      heading: { en: "Analytics", it: "Statistiche" },
      body: {
        en: "If enabled, we use Google Analytics 4 and similar tools only after you give consent, to understand how the site is used and improve it.",
        it: "Se attivi, utilizziamo Google Analytics 4 e strumenti simili solo dopo il tuo consenso, per capire come viene usato il sito e migliorarlo.",
      },
    },
  ],
  cancellation: [
    {
      heading: { en: "Cancellation by you", it: "Cancellazione da parte tua" },
      body: {
        en: "45 days or more before arrival: deposit refunded minus bank fees. 44–15 days: 50% of the tour price. Less than 15 days or no-show: no refund.",
        it: "45 giorni o più prima dell'arrivo: acconto rimborsato al netto delle spese bancarie. Da 44 a 15 giorni: 50% del prezzo del tour. Meno di 15 giorni o mancata presentazione: nessun rimborso.",
      },
    },
    {
      heading: { en: "Date changes", it: "Cambio date" },
      body: {
        en: "Free up to 30 days before arrival, subject to availability. Later changes may incur hotel penalties, which we pass on at cost.",
        it: "Gratuito fino a 30 giorni prima dell'arrivo, salvo disponibilità. Modifiche successive possono comportare penali alberghiere, che addebitiamo al costo.",
      },
    },
    {
      heading: { en: "Cancellation by us", it: "Cancellazione da parte nostra" },
      body: {
        en: "If we must cancel for reasons within our control, you receive a full refund. For force majeure we offer new dates or a refund of unused services.",
        it: "Se dobbiamo annullare per motivi dipendenti da noi, riceverai un rimborso completo. In caso di forza maggiore offriamo nuove date o il rimborso dei servizi non utilizzati.",
      },
    },
  ],
  insurance: [
    {
      heading: { en: "Our insurance", it: "La nostra assicurazione" },
      body: {
        en: "All our vehicles carry comprehensive passenger insurance as required for licensed tourist transport in Sri Lanka.",
        it: "Tutti i nostri veicoli sono coperti da assicurazione passeggeri completa, come richiesto per il trasporto turistico autorizzato in Sri Lanka.",
      },
    },
    {
      heading: { en: "Travel insurance", it: "Assicurazione di viaggio" },
      body: {
        en: "We strongly recommend that every traveller holds travel insurance covering medical expenses, repatriation, cancellation and personal belongings.",
        it: "Raccomandiamo vivamente che ogni viaggiatore abbia un'assicurazione di viaggio che copra spese mediche, rimpatrio, annullamento ed effetti personali.",
      },
    },
    {
      heading: { en: "Disclaimer", it: "Limitazione di responsabilità" },
      body: {
        en: "Wildlife sightings, weather and train schedules cannot be guaranteed. Optional activities run by third parties are subject to their own terms.",
        it: "Avvistamenti di animali, meteo e orari dei treni non possono essere garantiti. Le attività facoltative gestite da terzi sono soggette ai rispettivi termini.",
      },
    },
  ],
  accessibility: [
    {
      heading: { en: "Our commitment", it: "Il nostro impegno" },
      body: {
        en: "We aim to meet WCAG 2.2 level AA. The site uses semantic headings, text alternatives for images, visible focus states, keyboard-operable menus, carousels and dialogs, and respects your 'reduce motion' setting.",
        it: "Puntiamo a rispettare le WCAG 2.2 livello AA. Il sito usa intestazioni semantiche, testi alternativi per le immagini, focus visibile, menu, caroselli e finestre utilizzabili da tastiera e rispetta l'impostazione 'riduci movimento'.",
      },
    },
    {
      heading: { en: "Accessible travel", it: "Viaggi accessibili" },
      body: {
        en: "Tell us about any mobility, hearing or visual needs and we will adapt vehicles, hotels and the pace of your tour.",
        it: "Comunicaci eventuali esigenze motorie, uditive o visive: adatteremo veicoli, hotel e ritmo del tour.",
      },
    },
    {
      heading: { en: "Feedback", it: "Segnalazioni" },
      body: {
        en: "If something on this site is hard to use, please email info@srilankaexpotours.com and we will fix it.",
        it: "Se qualcosa su questo sito è difficile da usare, scrivi a info@srilankaexpotours.com e lo correggeremo.",
      },
    },
  ],
};
