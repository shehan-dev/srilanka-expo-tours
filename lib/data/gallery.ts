import type { GalleryItem } from "@/lib/types";

// Gallery photos live in /public/media/gallery. To add one, drop the file there and add an entry below
// (`aspect` controls the tile shape: "tall", "wide" or "square"; set `video` for a clip instead).

export const gallery: GalleryItem[] = [
  {
    id: "g1",
    image: "/media/gallery/gallery-01-kingfisher.jpg",
    scene: "hills",
    aspect: "square",
    caption: { en: "White-throated kingfisher", it: "Martin pescatore golabianca" },
  },
  {
    id: "g2",
    image: "/media/gallery/gallery-02-crocodile.jpg",
    scene: "safari",
    aspect: "wide",
    caption: { en: "Crocodile in the lagoon", it: "Coccodrillo nella laguna" },
  },
  {
    id: "g3",
    image: "/media/gallery/gallery-03-eagle.jpg",
    scene: "hills",
    aspect: "tall",
    caption: { en: "Crested serpent eagle", it: "Aquila serpentaria crestata" },
  },
  {
    id: "g4",
    image: "/media/gallery/gallery-04-elephant.jpg",
    scene: "safari",
    aspect: "wide",
    caption: { en: "Elephant greeting", it: "Il saluto dell'elefante" },
  },
  {
    id: "g5",
    image: "/media/gallery/gallery-05-leopard.jpg",
    scene: "safari",
    aspect: "tall",
    caption: { en: "Sri Lankan leopard", it: "Leopardo dello Sri Lanka" },
  },
];
