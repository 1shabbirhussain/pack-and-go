import Image from "next/image";
import Link from "next/link";

export function Logo({ variant = "light", className = "", priority = false }: { variant?: "light" | "dark"; className?: string; priority?: boolean }) {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`} aria-label="Pack & Go Tourism — home">
      <Image
        src={variant === "light" ? "/images/brand/logo-light.png" : "/images/brand/logo-dark.png"}
        alt="Pack & Go Tourism"
        width={540}
        height={353}
        priority={priority}
        className="h-11 w-auto sm:h-12"
      />
    </Link>
  );
}
