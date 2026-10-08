import type { Faq } from "@/lib/types";

// TODO: confirm deposit %, payment methods and cancellation tiers match your actual booking policy.

export const faqs: Faq[] = [
  {
    id: "deposit",
    category: "booking",
    question: { en: "How do I confirm a booking?", it: "Come confermo una prenotazione?" },
    answer: {
      en: "Send us a request and we'll reply with a personalised quote within 24 hours. A 30% deposit confirms your tour; the balance is due 30 days before arrival.",
      it: "Inviaci una richiesta e ti risponderemo con un preventivo personalizzato entro 24 ore. Un acconto del 30% conferma il tour; il saldo è dovuto 30 giorni prima dell'arrivo.",
    },
  },
  {
    id: "payment",
    category: "booking",
    question: { en: "Which payment methods do you accept?", it: "Quali metodi di pagamento accettate?" },
    answer: {
      en: "Credit and debit cards (Visa, Mastercard, Amex), international bank transfer (SEPA from Italy) and cash in USD, EUR or LKR on arrival.",
      it: "Carte di credito e debito (Visa, Mastercard, Amex), bonifico bancario internazionale (SEPA dall'Italia) e contanti in USD, EUR o LKR all'arrivo.",
    },
  },
  {
    id: "private",
    category: "booking",
    question: { en: "Are all tours private?", it: "Tutti i tour sono privati?" },
    answer: {
      en: "Yes. Every tour is private — just you, your companions, your driver and (if chosen) your guide. You can change the pace and stops at any time.",
      it: "Sì. Ogni tour è privato — solo tu, i tuoi compagni di viaggio, l'autista e (se scelta) la guida. Puoi cambiare ritmo e tappe in qualsiasi momento.",
    },
  },
  {
    id: "visa",
    category: "visas",
    question: { en: "Do Italian citizens need a visa for Sri Lanka?", it: "I cittadini italiani hanno bisogno del visto per lo Sri Lanka?" },
    answer: {
      en: "Most visitors need an Electronic Travel Authorisation (ETA) before arrival. Entry rules change from time to time, so always check the official site eta.gov.lk before you fly — we're happy to help with the application.",
      it: "La maggior parte dei visitatori necessita di un'autorizzazione elettronica di viaggio (ETA) prima dell'arrivo. Le regole di ingresso cambiano periodicamente: verifica sempre sul sito ufficiale eta.gov.lk prima di partire — saremo felici di aiutarti con la richiesta.",
    },
  },
  {
    id: "passport",
    category: "visas",
    question: { en: "How long must my passport be valid?", it: "Quanto deve essere valido il passaporto?" },
    answer: {
      en: "Your passport should be valid for at least six months from your arrival date and have a blank page for the entry stamp.",
      it: "Il passaporto deve avere una validità di almeno sei mesi dalla data di arrivo e una pagina libera per il timbro d'ingresso.",
    },
  },
  {
    id: "vaccines",
    category: "health",
    question: { en: "Are any vaccinations required?", it: "Sono necessarie vaccinazioni?" },
    answer: {
      en: "No vaccinations are mandatory for travellers arriving from Italy. We recommend speaking to your doctor or a travel clinic about routine vaccines, and bringing mosquito repellent.",
      it: "Nessuna vaccinazione è obbligatoria per chi arriva dall'Italia. Ti consigliamo di parlare con il tuo medico o un ambulatorio di medicina dei viaggi per le vaccinazioni di routine e di portare un repellente per zanzare.",
    },
  },
  {
    id: "safety",
    category: "health",
    question: { en: "Is Sri Lanka safe for tourists?", it: "Lo Sri Lanka è sicuro per i turisti?" },
    answer: {
      en: "Sri Lanka is a welcoming and generally safe destination. Our drivers know the roads well, all vehicles are insured, and you'll have our 24/7 local support number throughout your trip.",
      it: "Lo Sri Lanka è una destinazione accogliente e generalmente sicura. I nostri autisti conoscono bene le strade, tutti i veicoli sono assicurati e avrai il nostro numero di assistenza locale 24/7 per tutto il viaggio.",
    },
  },
  {
    id: "water",
    category: "health",
    question: { en: "Can I drink tap water?", it: "Posso bere l'acqua del rubinetto?" },
    answer: {
      en: "We recommend bottled or filtered water. Every vehicle carries a refill station so you can avoid single-use plastic.",
      it: "Consigliamo acqua in bottiglia o filtrata. Ogni veicolo ha una tanica per le ricariche, così puoi evitare la plastica monouso.",
    },
  },
  {
    id: "cancel",
    category: "cancellations",
    question: { en: "What is your cancellation policy?", it: "Qual è la vostra politica di cancellazione?" },
    answer: {
      en: "Free cancellation up to 45 days before arrival (deposit refunded minus bank fees). 44–15 days: 50% of the tour price. Less than 15 days: non-refundable. See our full cancellation policy for details.",
      it: "Cancellazione gratuita fino a 45 giorni prima dell'arrivo (acconto rimborsato al netto delle spese bancarie). Da 44 a 15 giorni: 50% del prezzo. Meno di 15 giorni: non rimborsabile. Consulta la politica di cancellazione completa per i dettagli.",
    },
  },
  {
    id: "change-dates",
    category: "cancellations",
    question: { en: "Can I change my dates after booking?", it: "Posso cambiare le date dopo la prenotazione?" },
    answer: {
      en: "Yes — date changes are free up to 30 days before arrival, subject to hotel availability.",
      it: "Sì — il cambio date è gratuito fino a 30 giorni prima dell'arrivo, in base alla disponibilità degli hotel.",
    },
  },
  {
    id: "plugs",
    category: "tips",
    question: { en: "Will my Italian plugs work?", it: "Le prese italiane funzionano?" },
    answer: {
      en: "Sri Lanka uses 230 V with type D and G sockets, so bring a universal adapter. Most hotels can lend one too.",
      it: "In Sri Lanka la corrente è a 230 V con prese di tipo D e G: porta un adattatore universale. La maggior parte degli hotel può anche prestartene uno.",
    },
  },
  {
    id: "money",
    category: "tips",
    question: { en: "Should I bring euros or rupees?", it: "Meglio portare euro o rupie?" },
    answer: {
      en: "Bring some euros to exchange at the airport and withdraw rupees (LKR) from ATMs. Cards are accepted in hotels and larger restaurants; carry cash for markets and tips.",
      it: "Porta qualche euro da cambiare in aeroporto e preleva rupie (LKR) agli sportelli. Le carte sono accettate negli hotel e nei ristoranti più grandi; tieni contanti per mercati e mance.",
    },
  },
  {
    id: "food-it",
    category: "tips",
    question: { en: "Is the food very spicy?", it: "Il cibo è molto piccante?" },
    answer: {
      en: "It can be! Just say 'no spicy' — our guides always let the kitchen know. Many hotels also serve pasta and European dishes if you need a break from curry.",
      it: "Può esserlo! Basta dire 'no spicy' — le nostre guide avvisano sempre la cucina. Molti hotel servono anche pasta e piatti europei se vuoi una pausa dal curry.",
    },
  },
  {
    id: "time",
    category: "tips",
    question: { en: "What's the time difference with Italy?", it: "Qual è la differenza di fuso orario con l'Italia?" },
    answer: {
      en: "Sri Lanka is 4½ hours ahead of Italy in winter and 3½ hours ahead during Italian summer time.",
      it: "Lo Sri Lanka è 4 ore e mezza avanti rispetto all'Italia in inverno e 3 ore e mezza durante l'ora legale italiana.",
    },
  },
];
