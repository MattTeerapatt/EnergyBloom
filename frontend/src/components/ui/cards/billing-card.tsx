import dayjs from "dayjs";
import { motion } from "framer-motion";

interface BillingCardProps {
  clientName: string;
  address: string;
  totalAmount: number;
  tax: number;
  totalElectricityUsage: number;
}

const BillingCard = ({
  clientName,
  address,
  totalAmount,
  tax,
  totalElectricityUsage,
}: BillingCardProps) => {
  const past_month = dayjs().subtract(1, "month").format("MMMM");
  const year = dayjs().subtract(1, "month").format("YYYY");

  return (
    <motion.div
      className="bg-gray-gradient relative flex flex-col h-full w-full rounded-3xl p-6 shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, scale: [0.95, 1] }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <motion.div
        className="flex justify-between items-start mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.h1
          className="text-2xl font-bold text-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {past_month}, {year} Billing
        </motion.h1>
      </motion.div>

      <motion.div
        className="border-b border-gray-300 pb-4 mb-4 mt-5"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-sm font-semibold text-gray-800">
          Client Information
        </h3>
        <p className="text-md text-gray-800 mt-2 font-bold">{clientName}</p>
        <p className="text-md text-gray-600">{address}</p>
      </motion.div>

      <motion.div
        className="border-b border-gray-300 pb-4 mb-4"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h3 className="text-sm font-semibold text-gray-800">
          Electricity Usage
        </h3>
        <div className="flex items-end justify-between mt-2">
          <span>Total Usage:</span>
          <span className="font-semibold">{totalElectricityUsage} kWh</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h3 className="text-sm font-semibold text-gray-800">Billing Summary</h3>
        <div className="flex items-end justify-between mt-2">
          <span>Tax:</span>
          <span className="text-sm font-semibold">฿{tax}</span>
        </div>
        <div className="flex items-end justify-between mt-2">
          <span>Total Amount:</span>
          <span className="text-xl font-bold">฿{totalAmount}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BillingCard;
