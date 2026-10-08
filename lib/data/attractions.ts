import type { Attraction } from "@/lib/types";

// Attractions offered in the itinerary builder, in a sensible island-loop order.
// Fees are indicative foreign-visitor prices in USD per person.

export const attractions: Attraction[] = [
  { id: "anuradhapura", name: "Anuradhapura", region: "cultural-triangle", fee: 30, coords: [8.3114, 80.4037] },
  { id: "sigiriya", name: "Sigiriya Lion Rock", region: "cultural-triangle", fee: 35, coords: [7.957, 80.7603] },
  { id: "dambulla", name: "Dambulla Cave Temple", region: "cultural-triangle", fee: 10, coords: [7.8567, 80.6492] },
  { id: "polonnaruwa", name: "Polonnaruwa", region: "cultural-triangle", fee: 30, coords: [7.9403, 81.0188] },
  { id: "minneriya", name: "Minneriya Elephant Safari", region: "national-parks", fee: 45, coords: [8.0333, 80.85] },
  { id: "kandy-temple", name: "Temple of the Tooth, Kandy", region: "cultural-triangle", fee: 10, coords: [7.2936, 80.6413] },
  { id: "peradeniya", name: "Peradeniya Botanical Gardens", region: "hill-country", fee: 10, coords: [7.2686, 80.5966] },
  { id: "nuwara-eliya", name: "Nuwara Eliya Tea Estates", region: "hill-country", fee: 5, coords: [6.9497, 80.7891] },
  { id: "horton-plains", name: "Horton Plains & World's End", region: "hill-country", fee: 25, coords: [6.802, 80.807] },
  { id: "ella-train", name: "Kandy → Ella Scenic Train", region: "hill-country", fee: 8, coords: [6.8667, 81.0466] },
  { id: "nine-arches", name: "Nine Arches Bridge & Little Adam's Peak", region: "hill-country", fee: 0, coords: [6.8768, 81.0608] },
  { id: "udawalawe", name: "Udawalawe Safari", region: "national-parks", fee: 40, coords: [6.4389, 80.8986] },
  { id: "yala", name: "Yala Leopard Safari", region: "national-parks", fee: 55, coords: [6.3725, 81.5185] },
  { id: "mirissa-whales", name: "Mirissa Whale Watching", region: "south-coast", fee: 50, coords: [5.9485, 80.4718] },
  { id: "galle", name: "Galle Fort", region: "south-coast", fee: 0, coords: [6.0329, 80.217] },
  { id: "bentota", name: "Bentota River Safari", region: "south-coast", fee: 15, coords: [6.421, 79.998] },
  { id: "trincomalee", name: "Trincomalee & Pigeon Island", region: "east-coast", fee: 25, coords: [8.5874, 81.2152] },
  { id: "arugam-bay", name: "Arugam Bay", region: "east-coast", fee: 0, coords: [6.8404, 81.8368] },
  { id: "colombo", name: "Colombo City Tour", region: "city", fee: 5, coords: [6.9271, 79.8612] },
];
