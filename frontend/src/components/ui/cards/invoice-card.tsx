"use client";

import { motion } from "framer-motion";

interface Invoice {
  date: string;
  amount: string;
}

interface InvoiceCardProps {
  invoices: Invoice[];
  onViewAll: () => void;
}

const InvoiceCard = ({ invoices, onViewAll }: InvoiceCardProps) => {
  return (
    <motion.div
      className="w-[38%] p-5 rounded-3xl bg-gradient-to-r from-gray-800 to-black shadow-lg text-white"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.div
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold">Invoices</h2>
        <button onClick={onViewAll} className="text-[#C0C0C0] text-sm">
          View all
        </button>
      </motion.div>

      <motion.ul
        className="space-y-4 mt-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        {invoices.map((invoice, index) => (
          <motion.li
            key={index}
            className="flex justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <span className="font-medium text-md">{invoice.date}</span>
            <span className="text-neutral-300 text-sm">{invoice.amount}</span>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
};

export default InvoiceCard;
