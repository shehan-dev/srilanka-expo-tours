import { attractions } from "@/lib/data/attractions";
import { recommendedVehicle, vehicles } from "@/lib/data/vehicles";

// Indicative rates in USD (low season). Tune these to your real contracted rates.
export const rates = {
  /** Per day. */
  guide: { driver: 0, national: 45, italian: 60 },
  /** Per person per day (breakfast is included with hotels). */
  meals: { breakfast: 0, half: 18, full: 32 },
  /** Per room per night; two adults share a room, children share with parents. */
  accommodation: { none: 0, essential: 45, comfort: 95, premium: 210 },
  /** Average entrance fees per person per day, used when no attractions are chosen. */
  averageFeesPerDay: 18,
  /** Children pay this share of meals and entrance fees. */
  childFactor: 0.5,
};

export type GuideOption = keyof typeof rates.guide;
export type MealOption = keyof typeof rates.meals;
export type AccommodationOption = keyof typeof rates.accommodation;

export interface TripInput {
  days: number;
  adults: number;
  kids: number;
  vehicleId?: string;
  guide: GuideOption;
  meals: MealOption;
  accommodation: AccommodationOption;
  /** Chosen attractions; when omitted, an average daily entrance fee is used. */
  attractionIds?: string[];
}

export interface TripEstimate {
  vehicle: number;
  guide: number;
  accommodation: number;
  meals: number;
  fees: number;
  total: number;
  perPerson: number;
}

export function estimateTrip(input: TripInput): TripEstimate {
  const days = Math.max(1, input.days);
  const nights = Math.max(0, days - 1);
  const pax = Math.max(1, input.adults + input.kids);
  const weightedPax = input.adults + input.kids * rates.childFactor;

  const vehicle = vehicles.find((v) => v.id === input.vehicleId) ?? recommendedVehicle(pax);
  const rooms = Math.max(1, Math.ceil(input.adults / 2));

  const fees = input.attractionIds
    ? attractions
        .filter((a) => input.attractionIds!.includes(a.id))
        .reduce((sum, a) => sum + a.fee * weightedPax, 0)
    : rates.averageFeesPerDay * days * weightedPax;

  const breakdown = {
    vehicle: vehicle.pricePerDay * days,
    guide: rates.guide[input.guide] * days,
    accommodation: rates.accommodation[input.accommodation] * rooms * nights,
    meals: rates.meals[input.meals] * days * weightedPax,
    fees,
  };
  const total = Math.round(Object.values(breakdown).reduce((a, b) => a + b, 0));

  return {
    ...breakdown,
    total,
    perPerson: Math.round(total / pax),
  };
}
