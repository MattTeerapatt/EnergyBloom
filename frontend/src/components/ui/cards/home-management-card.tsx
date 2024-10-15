import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { IconHome } from "@tabler/icons-react";

interface HomeManagementCardProps {
  currentPage: string;
  username: string;
  backgroundImage: string;
  livingRoomImage: string;
  bedroomImage: string;
  onTabChange: (tab: "Home" | "Living Room" | "Bedroom") => void;
}

const HomeManagementCard = ({
  currentPage,
  username,
  backgroundImage,
  livingRoomImage,
  bedroomImage,
  onTabChange,
}: HomeManagementCardProps) => {
  const [activeTab, setActiveTab] = useState<
    "Home" | "Living Room" | "Bedroom"
  >("Home");
  const [time, setTime] = useState(dayjs().format("hh:mm A"));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(dayjs().format("hh:mm A"));
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    onTabChange(activeTab);
  }, [activeTab, onTabChange]);

  let imageUrl;
  switch (activeTab) {
    case "Living Room":
      imageUrl = livingRoomImage;
      break;
    case "Bedroom":
      imageUrl = bedroomImage;
      break;
    default:
      imageUrl = backgroundImage;
      break;
  }

  let header;

  switch (currentPage) {
    case "home":
      header = (
        <motion.h1
          className="text-3xl font-bold text-black"
          key={time}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {time}
        </motion.h1>
      );
      break;
    case "smart-meter":
      header = (
        <motion.h1
          className="text-3xl font-bold text-black"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Smart Meter Usage
        </motion.h1>
      );
      break;
    default:
      header = (
        <motion.h1
          className="text-3xl font-bold text-black"
          key={time}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {time}
        </motion.h1>
      );
  }

  return (
    <motion.div
      className="bg-gray-gradient relative flex justify-between h-full w-full rounded-3xl  p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-[70%] flex flex-col">
        {header}
        <motion.div
          className="mt-1 text-md text-neutral-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          Welcome home, {username}
        </motion.div>

        <div className="mt-6 flex space-x-3">
          <motion.button
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === "Home"
                ? "bg-white text-black"
                : "bg-gray-100 text-gray-500 hover:bg-white"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("Home")}
          >
            <IconHome size={20} />
          </motion.button>

          <motion.button
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === "Living Room"
                ? "bg-white text-black"
                : "bg-gray-100 text-gray-500 hover:bg-white"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("Living Room")}
          >
            Living Room
          </motion.button>

          <motion.button
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === "Bedroom"
                ? "bg-white text-black"
                : "bg-gray-100 text-gray-500 hover:bg-white"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("Bedroom")}
          >
            Bedroom
          </motion.button>
        </div>
      </div>

      <motion.div
        className="w-full h-full rounded-2xl"
        key={imageUrl}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></motion.div>
    </motion.div>
  );
};

export default HomeManagementCard;