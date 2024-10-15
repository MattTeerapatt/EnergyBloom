import React, { useState } from "react";
import { IconTemperature, IconSnowflake, IconWind } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import AirConditionerTab from "../cards/air-conditioner-tab";

const updateDatabase = (settingType: string, value: any) => {
  console.log(`Updating ${settingType} in database to:`, value);
};

interface AirConditionerControlProps {
  currentRoom: string;
  currentTemperature: number;
  currentMode: string;
  currentFanSpeed: string;
}

const AirConditionerControl = ({
  currentRoom,
  currentTemperature,
  currentMode,
  currentFanSpeed,
}: AirConditionerControlProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [temperature, setTemperature] = useState(currentTemperature);
  const [mode, setMode] = useState(currentMode);
  const [fanSpeed, setFanSpeed] = useState(currentFanSpeed);

  const toggleDrawer = (tab: string) => {
    setActiveTab(tab);
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    setActiveTab("");
  };

  const handleTemperatureChange = (delta: number) => {
    const newTemp = temperature + delta;
    setTemperature(newTemp);
    updateDatabase("Temperature", newTemp); // NOTE: Mock database update
  };

  const handleModeChange = (newMode: string) => {
    setMode(newMode);
    updateDatabase("Mode", newMode); // NOTE: Mock database update
  };

  const handleFanSpeedChange = (newSpeed: string) => {
    setFanSpeed(newSpeed);
    updateDatabase("Fan Speed", newSpeed); // NOTE: Mock database update
  };

  const renderDrawerContent = () => {
    const fadeInOut = {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 50 },
      transition: { duration: 0.4 },
    };

    switch (activeTab) {
      case "Temperature":
        return (
          <motion.div {...fadeInOut} className="flex flex-col items-center">
            <h2 className="text-2xl font-bold">Set Temperature</h2>
            <p className="text-gray-600 mb-4">
              Adjust the temperature of your {currentRoom}.
            </p>
            <motion.div
              className="flex items-center gap-4 mt-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <button
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-full shadow-md hover:bg-gray-400 transition-colors"
                onClick={() => handleTemperatureChange(-1)}
              >
                -
              </button>
              <motion.span
                key={temperature}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-4xl font-bold"
              >
                {temperature}°C
              </motion.span>
              <button
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-full shadow-md hover:bg-gray-400 transition-colors"
                onClick={() => handleTemperatureChange(1)}
              >
                +
              </button>
            </motion.div>
          </motion.div>
        );
      case "Mode":
        return (
          <motion.div {...fadeInOut} className="flex flex-col items-center">
            <h2 className="text-2xl font-bold">Change Mode</h2>
            <p className="text-gray-600 mb-4">
              Select mode: Cool, Heat, Fan, Dry
            </p>
            <motion.div
              className="flex items-center gap-4 mt-4"
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {["Cool", "Heat", "Fan", "Dry"].map((modeOption) => (
                <motion.button
                  key={modeOption}
                  className={`${
                    mode === modeOption
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-700"
                  } py-2 px-4 rounded-full shadow-md hover:bg-gray-400 transition-colors`}
                  onClick={() => handleModeChange(modeOption)}
                  whileTap={{ scale: 0.9 }}
                >
                  {modeOption}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        );
      case "Fan Speed":
        return (
          <motion.div {...fadeInOut} className="flex flex-col items-center">
            <h2 className="text-2xl font-bold">Set Fan Speed</h2>
            <p className="text-gray-600 mb-4">
              Adjust fan speed: Low, Medium, High
            </p>
            <motion.div
              className="flex items-center gap-4 mt-4"
              initial={{ x: 50 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {["Low", "Medium", "High"].map((speedOption) => (
                <motion.button
                  key={speedOption}
                  className={`${
                    fanSpeed === speedOption
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-700"
                  } py-2 px-4 rounded-full shadow-md hover:bg-gray-400 transition-colors`}
                  onClick={() => handleFanSpeedChange(speedOption)}
                  whileTap={{ scale: 0.9 }}
                >
                  {speedOption}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Air Conditioner Tabs */}
      <div className="flex gap-3">
        <AirConditionerTab
          title="Temperature"
          description={`${temperature}°C`}
          icon={<IconTemperature size={24} className="text-neutral-500" />}
          onClick={() => toggleDrawer("Temperature")}
        />
        <AirConditionerTab
          title="Mode"
          description={mode}
          icon={<IconSnowflake size={24} className="text-neutral-500" />}
          onClick={() => toggleDrawer("Mode")}
        />
        <AirConditionerTab
          title="Fan Speed"
          description={fanSpeed}
          icon={<IconWind size={24} className="text-neutral-500" />}
          onClick={() => toggleDrawer("Fan Speed")}
        />
      </div>

      {/* Animated Bottom Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[999] bg-white p-6 rounded-t-3xl shadow-lg h-[40%]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Drawer Handle */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            {/* Drawer Content based on activeTab */}
            {renderDrawerContent()}

            {/* Close Button */}
            <div className="mt-14 flex justify-center">
              <button
                className="bg-black text-white py-2 px-6 rounded-lg"
                onClick={closeDrawer}
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AirConditionerControl;
