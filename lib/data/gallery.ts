import type { GalleryItem } from "@/lib/types";

// Add real photos under /public/media/gallery and set `image` (or `video` for clips).

export const gallery: GalleryItem[] = [
  { id: "g1", category: "nature", scene: "hills", aspect: "tall", caption: { en: "Tea pickers above Ella", it: "Raccoglitrici di tè sopra Ella" } },
  { id: "g2", category: "culture", scene: "temple", aspect: "square", caption: { en: "Evening puja in Kandy", it: "Puja serale a Kandy" } },
  { id: "g3", category: "nature", scene: "coast", aspect: "wide", caption: { en: "Sunset at Mirissa", it: "Tramonto a Mirissa" } },
  { id: "g4", category: "culture", scene: "rock", aspect: "tall", caption: { en: "Sigiriya at dawn", it: "Sigiriya all'alba" } },
  { id: "g5", category: "food", scene: "city", aspect: "square", caption: { en: "Kottu roti, Colombo", it: "Kottu roti, Colombo" } },
  { id: "g6", category: "nature", scene: "safari", aspect: "wide", caption: { en: "Elephants in Minneriya", it: "Elefanti a Minneriya" } },
  { id: "g7", category: "vehicles", scene: "hills", aspect: "square", caption: { en: "Our family van in the hill country", it: "Il nostro van sull'altopiano" } },
  { id: "g8", category: "food", scene: "coast", aspect: "tall", caption: { en: "Fresh seafood on the beach", it: "Pesce fresco sulla spiaggia" } },
  { id: "g9", category: "culture", scene: "temple", aspect: "wide", caption: { en: "Ruwanwelisaya stupa", it: "Lo stupa Ruwanwelisaya" } },
  { id: "g10", category: "nature", scene: "safari", aspect: "tall", caption: { en: "Leopard spotting in Yala", it: "Avvistamento leopardi a Yala" } },
  { id: "g11", category: "vehicles", scene: "city", aspect: "wide", caption: { en: "Tuk-tuk tour of Colombo", it: "Tour in tuk-tuk di Colombo" } },
  { id: "g12", category: "food", scene: "hills", aspect: "square", caption: { en: "Tea tasting in Nuwara Eliya", it: "Degustazione di tè a Nuwara Eliya" } },
];
