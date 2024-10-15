"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface CreditCardProps {
  cardType: string;
  lastFourDigits: string;
  expirationDate: string;
  nextBillingDate: string;
}

const CreditCard = ({
  cardType,
  lastFourDigits,
  expirationDate,
  nextBillingDate,
}: CreditCardProps) => {
  return (
    <motion.div
      className="w-full h-full bg-gradient-to-r from-gray-800 to-black rounded-3xl flex content-center items-center justify-center shadow-lg"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div className="p-5 w-full h-full">
        <div className="relative w-full h-full text-white">
          {/* Edit link */}
          <motion.div
            className="flex justify-between mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="font-semibold">Payment details</h2>
            <a href="#" className="text-[#C0C0C0] text-sm">
              Edit
            </a>
          </motion.div>

          {/* Card details */}
          <motion.div
            className="flex items-center mb-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Image
              alt={cardType}
              src={`/assets/images/credit-card/${cardType.toLowerCase()}.svg`}
              width={70}
              height={24}
              className="mr-2"
            />
            <span className="text-lg font-semibold">
              •••• •••• •••• {lastFourDigits}
            </span>
          </motion.div>

          {/* Expiration date */}
          <motion.div
            className="text-sm text-gray-200 mb-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {cardType} - Expires {expirationDate}
          </motion.div>

          {/* Billing information */}
          <motion.div
            className="text-sm text-gray-200 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Billed on the first of every month.
            <br />
            Next billing on <strong>{nextBillingDate}</strong>.
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreditCard;
