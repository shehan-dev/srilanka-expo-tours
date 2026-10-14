import type { Vehicle } from "@/lib/types";

// Photos: Unsplash (see /public/media/CREDITS.md). pricePerDay is used only by the (upcoming) itinerary builder.

export const vehicles: Vehicle[] = [
  {
    id: "sedan",
    image: "/media/fleet/sedan.jpg",
    name: { en: "Comfort Sedan", it: "Berlina Comfort" },
    model: "Toyota Prius / Axio",
    capacity: 3,
    luggage: 2,
    features: ["ac", "seatbelts", "usb"],
    pricePerDay: 55,
    icon: "car",
  },
  {
    id: "van",
    image: "/media/fleet/van.jpg",
    name: { en: "Family Van", it: "Van Famiglia" },
    model: "Toyota KDH High-Roof",
    capacity: 7,
    luggage: 6,
    features: ["ac", "wifi", "seatbelts", "usb", "cooler"],
    pricePerDay: 75,
    icon: "van",
  },
  {
    id: "minibus",
    image: "/media/fleet/minibus.jpg",
    name: { en: "Luxury Minibus", it: "Minibus di Lusso" },
    model: "Toyota Coaster",
    capacity: 18,
    luggage: 14,
    features: ["ac", "wifi", "seatbelts", "recliner", "cooler"],
    pricePerDay: 120,
    icon: "bus",
  },
  {
    id: "coach",
    image: "/media/fleet/coach.jpg",
    name: { en: "Tour Coach", it: "Pullman Turistico" },
    model: "Ashok Leyland / Yutong",
    capacity: 35,
    luggage: 35,
    features: ["ac", "wifi", "seatbelts", "recliner", "usb"],
    pricePerDay: 190,
    icon: "bus",
  },
];

/** Smallest vehicle that seats the party. */
export const recommendedVehicle = (pax: number) =>
  vehicles.find((v) => v.capacity >= pax) ?? vehicles[vehicles.length - 1];
