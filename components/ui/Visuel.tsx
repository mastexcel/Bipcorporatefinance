import Image from "next/image";
import type { EmplacementImage } from "@/config/images";

/**
 * Photo d'illustration, ou visuel neutre aux couleurs de BIP tant qu'aucune
 * image n'est renseignée dans config/images.ts.
 */
export function Visuel({
  image,
  className = "",
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: {
  image: EmplacementImage;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (image.src) {
    return (
      <div className={`relative overflow-hidden rounded-lg bg-fond ${className}`}>
        <Image src={image.src} alt={image.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }
  return (
    <div
      role="img"
      aria-label={image.alt}
      className={`relative overflow-hidden rounded-lg bg-gradient-to-br from-[#ececee] to-[#dcdcdf] ${className}`}
    >
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 300">
        <defs>
          <linearGradient id="bip-visuel" x1="0" x2="1">
            <stop offset="0" stopColor="#d7261e" />
            <stop offset="1" stopColor="#f26522" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1">
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M-20 ${60 + i * 28} C 120 ${20 + i * 30}, 260 ${110 + i * 26}, 420 ${50 + i * 29}`} />
          ))}
        </g>
        <rect x="32" y="248" width="64" height="4" fill="url(#bip-visuel)" />
      </svg>
    </div>
  );
}
