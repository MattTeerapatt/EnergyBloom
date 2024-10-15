import Image from "next/image";
import Link from "next/link";

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="flex items-center justify-start gap-2 group/sidebar w-20 h-20 -ml-1 mt-1"
    >
      <Image
        src="/assets/icons/logo/energy-bloom-icon.png"
        width={300}
        height={300}
        alt="Logo"
      />
    </Link>
  );
}