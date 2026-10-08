import type { Destination } from "@/lib/types";

export const destinations: Destination[] = [
  {
    id: "ella",
    name: "Ella",
    region: "hill-country",
    blurb: {
      en: "A laid-back mountain village surrounded by tea estates, waterfalls and easy sunrise hikes.",
      it: "Un tranquillo villaggio di montagna tra piantagioni di tè, cascate e facili escursioni all'alba.",
    },
    bestMonths: { en: "Jan–Mar, Jul–Sep", it: "Gen–Mar, Lug–Set" },
    highlights: {
      en: ["Nine Arches Bridge", "Little Adam's Peak", "Tea estates"],
      it: ["Ponte dei Nove Archi", "Little Adam's Peak", "Piantagioni di tè"],
    },
    scene: "hills",
    coords: [6.8667, 81.0466],
  },
  {
    id: "nuwara-eliya",
    name: "Nuwara Eliya",
    region: "hill-country",
    blurb: {
      en: "Colonial 'Little England' at 1,900 m, with cool air, rose gardens and the island's finest tea.",
      it: "La coloniale 'Piccola Inghilterra' a 1.900 m, con aria fresca, giardini di rose e il miglior tè dell'isola.",
    },
    bestMonths: { en: "Feb–Apr", it: "Feb–Apr" },
    highlights: {
      en: ["Tea factory tasting", "Gregory Lake", "Horton Plains & World's End"],
      it: ["Degustazione in fabbrica del tè", "Lago Gregory", "Horton Plains e World's End"],
    },
    scene: "hills",
    coords: [6.9497, 80.7891],
  },
  {
    id: "kandy",
    name: "Kandy",
    region: "cultural-triangle",
    blurb: {
      en: "The last royal capital, home of the Temple of the Sacred Tooth Relic and the Esala Perahera festival.",
      it: "L'ultima capitale reale, sede del Tempio della Sacra Reliquia del Dente e del festival Esala Perahera.",
    },
    bestMonths: { en: "Jan–Apr, Jul–Aug", it: "Gen–Apr, Lug–Ago" },
    highlights: {
      en: ["Temple of the Tooth", "Peradeniya Botanical Gardens", "Kandyan dance show"],
      it: ["Tempio del Dente", "Giardini Botanici di Peradeniya", "Spettacolo di danze kandyane"],
    },
    scene: "temple",
    coords: [7.2906, 80.6337],
  },
  {
    id: "sigiriya",
    name: "Sigiriya",
    region: "cultural-triangle",
    blurb: {
      en: "A 5th-century fortress on a 200 m rock, with frescoes, mirror wall and sweeping jungle views.",
      it: "Una fortezza del V secolo su una rocca di 200 m, con affreschi, muro a specchio e viste sulla giungla.",
    },
    bestMonths: { en: "Jan–Apr, Jun–Sep", it: "Gen–Apr, Giu–Set" },
    highlights: {
      en: ["Lion Rock climb", "Pidurangala sunrise", "Village tour by bullock cart"],
      it: ["Salita sulla Rocca del Leone", "Alba a Pidurangala", "Tour del villaggio in carro trainato da buoi"],
    },
    scene: "rock",
    coords: [7.957, 80.7603],
  },
  {
    id: "polonnaruwa",
    name: "Polonnaruwa",
    region: "cultural-triangle",
    blurb: {
      en: "A medieval capital of palaces, lotus ponds and the serene Buddha statues of Gal Vihara.",
      it: "Una capitale medievale di palazzi, stagni di loto e le serene statue del Buddha di Gal Vihara.",
    },
    bestMonths: { en: "Feb–Sep", it: "Feb–Set" },
    highlights: {
      en: ["Gal Vihara", "Royal Palace ruins", "Cycling the ancient city"],
      it: ["Gal Vihara", "Rovine del Palazzo Reale", "In bici nella città antica"],
    },
    scene: "temple",
    coords: [7.9403, 81.0188],
  },
  {
    id: "galle",
    name: "Galle",
    region: "south-coast",
    blurb: {
      en: "A UNESCO-listed Dutch fort town of cobbled lanes, boutique cafés and ocean-view ramparts.",
      it: "Una città-fortezza olandese patrimonio UNESCO, con vicoli acciottolati, caffè boutique e bastioni sull'oceano.",
    },
    bestMonths: { en: "Nov–Apr", it: "Nov–Apr" },
    highlights: {
      en: ["Galle Fort ramparts", "Lighthouse at sunset", "Stilt fishermen at Koggala"],
      it: ["Bastioni del Forte di Galle", "Il faro al tramonto", "Pescatori sui trampoli a Koggala"],
    },
    scene: "coast",
    coords: [6.0329, 80.217],
  },
  {
    id: "mirissa",
    name: "Mirissa",
    region: "south-coast",
    blurb: {
      en: "A crescent bay famous for blue-whale watching, palm-hill viewpoints and seafood dinners on the sand.",
      it: "Una baia a mezzaluna famosa per l'avvistamento delle balenottere azzurre, la collina delle palme e le cene di pesce sulla sabbia.",
    },
    bestMonths: { en: "Nov–Apr", it: "Nov–Apr" },
    highlights: {
      en: ["Whale watching", "Coconut Tree Hill", "Secret Beach"],
      it: ["Avvistamento balene", "Coconut Tree Hill", "Secret Beach"],
    },
    scene: "coast",
    coords: [5.9485, 80.4718],
  },
  {
    id: "trincomalee",
    name: "Trincomalee",
    region: "east-coast",
    blurb: {
      en: "One of the world's finest natural harbours, with white beaches and coral reefs at Pigeon Island.",
      it: "Uno dei porti naturali più belli del mondo, con spiagge bianche e la barriera corallina di Pigeon Island.",
    },
    bestMonths: { en: "May–Sep", it: "Mag–Set" },
    highlights: {
      en: ["Pigeon Island snorkelling", "Koneswaram Temple", "Nilaveli Beach"],
      it: ["Snorkeling a Pigeon Island", "Tempio di Koneswaram", "Spiaggia di Nilaveli"],
    },
    scene: "coast",
    coords: [8.5874, 81.2152],
  },
  {
    id: "arugam-bay",
    name: "Arugam Bay",
    region: "east-coast",
    blurb: {
      en: "A world-class surf point and relaxed beach town, with lagoon safaris and elephant sightings nearby.",
      it: "Uno spot surf di livello mondiale e una rilassata cittadina di mare, con safari in laguna ed elefanti nei dintorni.",
    },
    bestMonths: { en: "May–Oct", it: "Mag–Ott" },
    highlights: {
      en: ["Surf lessons", "Pottuvil lagoon safari", "Kumana National Park"],
      it: ["Lezioni di surf", "Safari nella laguna di Pottuvil", "Parco Nazionale di Kumana"],
    },
    scene: "coast",
    coords: [6.8404, 81.8368],
  },
  {
    id: "yala",
    name: "Yala",
    region: "national-parks",
    blurb: {
      en: "Sri Lanka's most famous park, with the highest density of leopards on earth.",
      it: "Il parco più famoso dello Sri Lanka, con la più alta densità di leopardi al mondo.",
    },
    bestMonths: { en: "Feb–Jul", it: "Feb–Lug" },
    highlights: {
      en: ["Leopard safari", "Sloth bears & elephants", "Sithulpawwa rock temple"],
      it: ["Safari dei leopardi", "Orsi labiati ed elefanti", "Tempio rupestre di Sithulpawwa"],
    },
    scene: "safari",
    coords: [6.3725, 81.5185],
  },
  {
    id: "udawalawe",
    name: "Udawalawe",
    region: "national-parks",
    blurb: {
      en: "Open grasslands where wild elephant herds are seen almost every day of the year.",
      it: "Praterie aperte dove si avvistano mandrie di elefanti selvatici quasi ogni giorno dell'anno.",
    },
    bestMonths: { en: "All year", it: "Tutto l'anno" },
    highlights: {
      en: ["Elephant herds", "Elephant Transit Home", "Birdwatching"],
      it: ["Mandrie di elefanti", "Elephant Transit Home", "Birdwatching"],
    },
    scene: "safari",
    coords: [6.4389, 80.8986],
  },
  {
    id: "colombo",
    name: "Colombo",
    region: "city",
    blurb: {
      en: "A buzzing capital of colonial buildings, bazaars, rooftop bars and some of the island's best food.",
      it: "Una capitale vivace di edifici coloniali, bazar, rooftop bar e alcuni dei migliori piatti dell'isola.",
    },
    bestMonths: { en: "Dec–Mar", it: "Dic–Mar" },
    highlights: {
      en: ["Pettah market", "Gangaramaya Temple", "Galle Face Green sunset"],
      it: ["Mercato di Pettah", "Tempio Gangaramaya", "Tramonto a Galle Face Green"],
    },
    scene: "city",
    coords: [6.9271, 79.8612],
  },
];

/** Search suggestions for the booking bar autocomplete. */
export const searchPlaces = [
  ...destinations.map((d) => ({ id: d.id, label: d.name, region: d.region })),
  { id: "dambulla", label: "Dambulla", region: "cultural-triangle" as const },
  { id: "anuradhapura", label: "Anuradhapura", region: "cultural-triangle" as const },
  { id: "bentota", label: "Bentota", region: "south-coast" as const },
  { id: "minneriya", label: "Minneriya", region: "national-parks" as const },
  { id: "adams-peak", label: "Adam's Peak", region: "hill-country" as const },
];
