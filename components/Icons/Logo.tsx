import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="https://res.cloudinary.com/db304aaga/image/upload/v1772467796/LOGO-MF-PROFISSINAL-3_edfdwz.png"
      alt="MF Profissional Logo"
      width={172}
      height={26}
      priority
      unoptimized
      className="object-contain"
    />
  );
}
