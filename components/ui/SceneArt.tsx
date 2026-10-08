import { useId } from "react";
import type { Scene } from "@/lib/types";
import { cn } from "@/lib/utils";

const skies: Record<Scene, [string, string]> = {
  hills: ["#bfe6ff", "#fff1d6"],
  coast: ["#9fd8ff", "#ffe0b8"],
  temple: ["#7aa8ff", "#ffc78a"],
  rock: ["#a8dcff", "#e8f6ff"],
  safari: ["#ffe3a3", "#ffbe6b"],
  city: ["#9fd4ff", "#e8f6ff"],
};

/**
 * Lightweight illustrated landscape used as a stand-in until real photography is supplied.
 * Decorative only — the surrounding component provides the accessible name.
 */
export function SceneArt({ scene, className }: { scene: Scene; className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [top, bottom] = skies[scene];

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={cn("h-full w-full", className)}
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id={`sky${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
        <linearGradient id={`sea${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3aa0e6" />
          <stop offset="1" stopColor="#0a6eff" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#sky${id})`} />

      {scene === "hills" && (
        <g>
          <circle cx="300" cy="90" r="30" fill="#ffd27a" opacity="0.9" />
          <path d="M0 170 C80 120 160 140 220 115 S360 120 400 135 L400 300 L0 300Z" fill="#8fd0b2" />
          <ellipse cx="120" cy="165" rx="140" ry="12" fill="#fff" opacity="0.35" />
          <path d="M0 205 C90 165 170 190 250 160 S370 175 400 170 L400 300 L0 300Z" fill="#3fa77a" />
          <path d="M0 250 C100 215 220 240 300 210 S380 225 400 220 L400 300 L0 300Z" fill="#1f7a55" />
          {[0, 14, 28, 42].map((o) => (
            <path key={o} d={`M10 ${262 + o} C120 ${235 + o} 220 ${258 + o} 395 ${232 + o}`} stroke="#2f9466" strokeWidth="3" fill="none" opacity="0.7" />
          ))}
        </g>
      )}

      {scene === "coast" && (
        <g>
          <circle cx="200" cy="178" r="38" fill="#ffb347" />
          <rect y="178" width="400" height="80" fill={`url(#sea${id})`} />
          {[195, 212, 228].map((y, i) => (
            <path key={y} d={`M${30 + i * 40} ${y} q20 -6 40 0 t40 0`} stroke="#fff" strokeWidth="2" fill="none" opacity="0.5" />
          ))}
          <path d="M0 240 C120 225 260 250 400 232 L400 300 L0 300Z" fill="#f3d9a4" />
          <path d="M335 300 C330 255 318 212 300 178" stroke="#6b4a2b" strokeWidth="8" fill="none" strokeLinecap="round" />
          <g fill="#1f7a55">
            <path d="M300 178 C270 160 240 166 225 184 C252 170 280 172 300 178Z" />
            <path d="M300 178 C330 158 362 164 376 182 C350 170 322 172 300 178Z" />
            <path d="M300 178 C290 150 270 136 248 136 C272 146 288 160 300 178Z" />
            <path d="M300 178 C312 150 334 138 356 140 C332 148 314 160 300 178Z" />
          </g>
        </g>
      )}

      {scene === "temple" && (
        <g>
          {[[90, 70], [110, 60], [300, 80]].map(([x, y]) => (
            <path key={x} d={`M${x} ${y} q6 -6 12 0 q6 -6 12 0`} stroke="#33415c" strokeWidth="2" fill="none" />
          ))}
          <path d="M0 238 C120 225 280 245 400 230 L400 300 L0 300Z" fill="#2e7d5b" />
          <circle cx="50" cy="220" r="34" fill="#235f45" />
          <circle cx="360" cy="215" r="40" fill="#235f45" />
          <rect x="140" y="215" width="120" height="25" rx="3" fill="#f7f9ff" />
          <path d="M150 215 C150 158 250 158 250 215Z" fill="#ffffff" />
          <path d="M200 160 C228 165 248 185 250 215 L200 215Z" fill="#e3ebff" />
          <rect x="188" y="148" width="24" height="14" fill="#f7f9ff" />
          <path d="M193 148 L200 92 L207 148Z" fill="#f7f9ff" />
          <circle cx="200" cy="90" r="3" fill="#ffd27a" />
        </g>
      )}

      {scene === "rock" && (
        <g>
          <ellipse cx="90" cy="70" rx="40" ry="12" fill="#fff" opacity="0.8" />
          <ellipse cx="320" cy="55" rx="50" ry="13" fill="#fff" opacity="0.7" />
          <path d="M128 225 C134 170 140 120 165 104 L255 99 C276 110 282 170 292 225Z" fill="#b5653d" />
          <path d="M228 100 L255 99 C276 110 282 170 292 225 L250 225 C252 170 245 125 228 100Z" fill="#8f4a2c" />
          <path d="M165 104 L255 99" stroke="#2f8a5f" strokeWidth="5" />
          <path d="M0 232 C40 202 80 216 120 206 C160 196 200 216 240 206 C290 196 340 216 400 200 L400 300 L0 300Z" fill="#2f8a5f" />
          <path d="M0 262 C60 240 140 258 200 245 C270 232 330 255 400 240 L400 300 L0 300Z" fill="#1f6b48" />
        </g>
      )}

      {scene === "safari" && (
        <g>
          <circle cx="90" cy="105" r="34" fill="#fff2c4" />
          <path d="M0 225 C120 210 280 230 400 215 L400 300 L0 300Z" fill="#d9a65a" />
          <path d="M0 260 C120 245 260 268 400 250 L400 300 L0 300Z" fill="#c48a3f" />
          <path d="M305 225 L308 168" stroke="#5a3b22" strokeWidth="6" strokeLinecap="round" />
          <path d="M308 185 L285 168 M308 180 L330 166" stroke="#5a3b22" strokeWidth="3" />
          <ellipse cx="308" cy="162" rx="56" ry="13" fill="#4b6b2e" />
          <g fill="#4a4a55">
            <ellipse cx="160" cy="192" rx="38" ry="25" />
            <circle cx="198" cy="182" r="18" />
            <rect x="130" y="205" width="11" height="25" rx="4" />
            <rect x="147" y="207" width="11" height="24" rx="4" />
            <rect x="167" y="207" width="11" height="24" rx="4" />
            <rect x="182" y="203" width="11" height="27" rx="4" />
          </g>
          <ellipse cx="190" cy="184" rx="9" ry="13" fill="#5d5d6b" />
          <path d="M212 186 C222 200 220 215 214 226" stroke="#4a4a55" strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d="M123 188 C116 196 116 204 118 210" stroke="#4a4a55" strokeWidth="2" fill="none" />
        </g>
      )}

      {scene === "city" && (
        <g>
          <ellipse cx="80" cy="60" rx="45" ry="12" fill="#fff" opacity="0.8" />
          <g fill="#6c8fb8">
            <rect x="20" y="170" width="40" height="90" />
            <rect x="65" y="140" width="32" height="120" />
            <rect x="102" y="185" width="45" height="75" />
            <rect x="330" y="160" width="38" height="100" />
          </g>
          <g fill="#4d6f96">
            <rect x="150" y="120" width="36" height="140" />
            <rect x="190" y="155" width="50" height="105" />
            <rect x="290" y="135" width="34" height="125" />
            <rect x="370" y="190" width="30" height="70" />
          </g>
          <rect x="262" y="78" width="8" height="182" fill="#8b7bb8" />
          <ellipse cx="266" cy="96" rx="16" ry="12" fill="#c084fc" />
          <path d="M266 40 L266 84" stroke="#8b7bb8" strokeWidth="3" />
          <rect y="258" width="400" height="42" fill={`url(#sea${id})`} />
        </g>
      )}
    </svg>
  );
}
