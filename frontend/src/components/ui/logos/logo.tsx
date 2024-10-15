import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export const Logo = () => {
  return (
    <Link
      href="#"
      className="flex items-center justify-start gap-2 group/sidebar w-20 h-20 relative z-20 -ml-1 mt-1"
    >
      <Image
        src="/assets/icons/logo/energy-bloom-icon.png"
        width={300}
        height={300}
        alt="Logo"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-bold text-black text-xl dark:text-white whitespace-pre"
      >
        Energy Bloom
      </motion.span>
    </Link>
  );
};
