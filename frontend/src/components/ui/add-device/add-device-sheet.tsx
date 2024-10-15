import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon } from "lucide-react";
import { addAircon, addLight } from "@/constants/devices";
import { set } from "zod";

// Mock function to simulate adding a device to the database
const updateDeviceDatabase = (
  deviceName: string,
  room: string,
  deviceUnitUsage: number,
  deviceCount: number
) => {
  const lowerCaseDevice = deviceName.toLowerCase();
  console.log(
    `Adding ${deviceCount} ${lowerCaseDevice}(s) with ${deviceUnitUsage} kWh usage to room: ${room}`
  );
};

const AddDeviceSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [deviceType, setDeviceType] = useState("Air Conditioner");
  const [deviceName, setDeviceName] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("Living Room");
  const [unitUsage, setUnitUsage] = useState(0);
  const [deviceCount, setDeviceCount] = useState(1);

  const toggleSheet = () => setIsOpen(!isOpen);

  const handleAddDevice = () => {
    // updateDeviceDatabase(
    //   deviceName || deviceType,
    //   selectedRoom,
    //   unitUsage,
    //   deviceCount
    // );
    console.log("Adding device:", deviceName, selectedRoom, unitUsage, deviceCount);
    if (deviceType === "Air Conditioner") {
      if (selectedRoom === "Living Room") {
        if (deviceName.includes("Living Room") || deviceName.includes("Livingroom")) {
          addAircon(deviceName, deviceCount, unitUsage);
        } else {
          addAircon("Living Room " + deviceName, deviceCount, unitUsage);
        }
      } else if (selectedRoom === "Bedroom") {
        if (deviceName.includes("Bed Room") || deviceName.includes("Bedroom")) {
          addAircon(deviceName, deviceCount, unitUsage);
        } else {
          addAircon("Bedroom " + deviceName, deviceCount, unitUsage);
        }
      }
    } else if (deviceType === "Light & Bulb") {
      if (selectedRoom === "Living Room") {
        if (deviceName.includes("Living Room") || deviceName.includes("Livingroom")) {
          addLight(deviceName, deviceCount, unitUsage);
        } else {
          addLight("Living Room " + deviceName, deviceCount, unitUsage);
        }
      } else if (selectedRoom === "Bedroom") {
        if (deviceName.includes("Bed Room") || deviceName.includes("Bedroom")) {
          addLight(deviceName, deviceCount, unitUsage);
        } else {
          addLight("Bedroom " + deviceName, deviceCount, unitUsage);
        }
      }
    }
    
    setIsOpen(false);
    setDeviceName("");
    setUnitUsage(0);
    setDeviceCount(1);
  };

  return (
    <>
      {/* SHEET TRIGGER */}
      <motion.div
        whileHover={{
          backgroundPosition: "150% 50%",
          scale: 1.05,
          backgroundSize: "200%",
          opacity: 1,
        }}
        whileTap={{ scale: 0.95 }}
        className="relative z-10 flex justify-center items-center space-x-1 p-[0.9rem] w-full rounded-full transition-all duration-500 group bg-black cursor-pointer"
        onClick={toggleSheet}
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0) 70%)`,
          backgroundSize: "0%",
          backgroundPosition: "50% 50%",
          transition:
            "background-position 1.5s ease, background-size 1.5s ease, scale 0.3s ease",
        }}
      >
        <PlusIcon className="text-white w-5 h-5" />
        <motion.p
          className="text-sm font-semibold text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Add Device
        </motion.p>
      </motion.div>

      {/* SLIDE-IN SHEET */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-y-0 right-0 w-1/3 bg-white text-black p-6 shadow-lg z-[1000] rounded-l-3xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Sheet Header */}
            <div className="flex justify-between items-center mb-6">
              <motion.h2
                className="text-xl font-bold"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                Add New Device
              </motion.h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleSheet}
                className="text-gray-400 hover:text-gray-600"
              >
                Close
              </motion.button>
            </div>

            {/* SELECT ROOM */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-gray-700 mb-2">Select Room</label>
              <motion.select
                whileHover={{ scale: 1.02 }}
                className="w-full p-3 rounded-lg bg-gray-50 text-black border border-gray-300 shadow-sm focus:ring-2 focus:ring-black focus:outline-none"
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
              >
                <option value="Living Room">Living Room</option>
                <option value="Bedroom">Bedroom</option>
              </motion.select>
            </motion.div>

            {/* DEVICE TYPE SELECTION */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-gray-700 mb-2">Device Type</label>
              <motion.select
                whileHover={{ scale: 1.02 }}
                className="w-full p-3 rounded-lg bg-gray-50 text-black border border-gray-300 shadow-sm focus:ring-2 focus:ring-black focus:outline-none"
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
              >
                <option value="Air Conditioner">Air Conditioner</option>
                <option value="Light & Bulb">Light & Bulb</option>
              </motion.select>
            </motion.div>

            {/* DEVICE NAME INPUT */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-gray-700 mb-2">Device Name</label>
              <motion.input
                type="text"
                placeholder="Enter device name"
                className="w-full p-3 rounded-lg bg-gray-50 text-black border border-gray-300 shadow-sm focus:ring-2 focus:ring-black focus:outline-none"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
              />
            </motion.div>

            {/* DEVICE USAGE INPUT */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-gray-700 mb-2">
                Unit Usage (kWh)
              </label>
              <motion.input
                type="number"
                min="0"
                className="w-full p-3 rounded-lg bg-gray-50 text-black border border-gray-300 shadow-sm focus:ring-2 focus:ring-black focus:outline-none"
                value={unitUsage}
                onChange={(e) => setUnitUsage(parseFloat(e.target.value))}
              />
            </motion.div>

            {/* DEVICE COUNT INPUT */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-gray-700 mb-2">
                Number of Devices
              </label>
              <motion.input
                type="number"
                min="1"
                className="w-full p-3 rounded-lg bg-gray-50 text-black border border-gray-300 shadow-sm focus:ring-2 focus:ring-black focus:outline-none"
                value={deviceCount}
                onChange={(e) => setDeviceCount(parseInt(e.target.value))}
              />
            </motion.div>

            {/* ADD DEVICE BUTTON */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-green-500 text-white py-3 rounded-full shadow-sm"
              onClick={handleAddDevice}
            >
              Add Device
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddDeviceSheet;
