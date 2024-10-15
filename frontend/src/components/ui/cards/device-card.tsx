"use client";

import { motion } from "framer-motion";
import React from "react";
import DeviceTab from "./device-tab";
import { IconAirConditioning, IconBulb } from "@tabler/icons-react";
import AddDeviceSheet from "../add-device/add-device-sheet";
import { BackgroundGradientAnimation } from "../backgrounds/background-gradient-animation";
import { Device } from "@/constants/devices";
import { cn } from "@/utils/cn";

interface DeviceCardProps {
  useWhiteStyle?: boolean;
  airConditionersCount: number;
  lightsCount: number;
  selectedRoom: "Living Room" | "Bedroom" | "Home";
  aircons: {
    "Living Room": Device[];
    Bedroom: Device[];
  };
  lights: {
    "Living Room": Device[];
    Bedroom: Device[];
  };
  disabledClick?: boolean;
}

const DeviceCard = ({
  useWhiteStyle,
  airConditionersCount,
  lightsCount,
  selectedRoom,
  aircons,
  lights,
  disabledClick,
}: DeviceCardProps) => {
  // Combine aircons if "Home" is selected, otherwise use the selected room's aircons
  const roomAircons =
    selectedRoom === "Home"
      ? [...(aircons["Living Room"] || []), ...(aircons["Bedroom"] || [])]
      : aircons[selectedRoom] || [];

  const roomLights =
    selectedRoom === "Home"
      ? [...(lights["Living Room"] || []), ...(lights["Bedroom"] || [])]
      : lights[selectedRoom] || [];

  return (
    <div className="h-full w-[28%] rounded-3xl bg-gray-100 shadow-lg">
      <BackgroundGradientAnimation className="p-5 flex flex-col justify-between w-full h-full">
        <div className="space-y-3">
          <motion.h2
            className={cn(
              "text-xl font-bold text-black mb-6",
              useWhiteStyle && "text-white"
            )}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Devices
          </motion.h2>

          {/* Air Conditioners Tab */}
          <DeviceTab
            useWhiteStyle={useWhiteStyle}
            title="Air Conditioners"
            count={roomAircons.length}
            devices={roomAircons}
            deviceType="Air Conditioner"
            icon={<IconAirConditioning className="text-neutral-700 h-6 w-6" />}
            disabledClick={disabledClick}
          />

          {/* Lights & Bulbs Tab */}

          <DeviceTab
            useWhiteStyle={useWhiteStyle}
            title="Lights & Bulbs"
            count={roomLights.length}
            devices={roomLights}
            deviceType="Light & Bulb"
            icon={<IconBulb className="text-neutral-700 h-6 w-6" />}
            disabledClick={disabledClick}
          />
        </div>

        {/* Add Device Button */}
        {!disabledClick && <AddDeviceSheet />}
      </BackgroundGradientAnimation>
    </div>
  );
};

export default DeviceCard;
