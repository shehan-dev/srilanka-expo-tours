import { Landmark, Mountain, PawPrint, TreePalm, Users, UtensilsCrossed, Compass, type LucideIcon } from "lucide-react";
import type { ThemeId } from "@/lib/types";
import { cn } from "@/lib/utils";

// Brand experience icons, mapped onto existing tour themes where they fit cleanly:
// Culture → Heritage & Culture · Nature → Nature & Hiking · Wildlife → Wildlife & Safari · Beach → Beaches & Relaxation.
const icons: Record<ThemeId, LucideIcon> = {
  culture: Landmark,
  nature: Mountain,
  wildlife: PawPrint,
  beach: TreePalm,
  adventure: Compass,
  family: Users,
  food: UtensilsCrossed,
};

/** Category chip colours (all pass WCAG AA for the chip text). */
export function themeChipClass(theme: ThemeId) {
  switch (theme) {
    case "culture":
      return "bg-cinnamon-dark text-white";
    case "nature":
      return "bg-primary text-ivory";
    case "wildlife":
      return "bg-accent-700 text-white";
    case "beach":
      return "bg-ocean-dark text-white";
    default:
      return "bg-primary-50 text-primary";
  }
}

export function ThemeIcon({ theme, className }: { theme: ThemeId; className?: string }) {
  const Icon = icons[theme];
  return <Icon className={cn("shrink-0", className)} strokeWidth={1.75} aria-hidden />;
}
