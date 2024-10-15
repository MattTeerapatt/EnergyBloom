import React, { useState } from "react";
import { IconChevronRight, IconTrash, IconEdit } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { Device, updateAircon, updateLight } from "@/constants/devices";
import { deleteAircon, deleteLight } from "@/constants/devices";
import { cn } from "@/utils/cn";

interface DeviceTabProps {
  useWhiteStyle?: boolean;
  title: string;
  count: number;
  devices: Device[];
  deviceType: string;
  icon?: React.JSX.Element | React.ReactNode;
  disabledClick?: boolean;
}

const DeviceTab = ({
  useWhiteStyle,
  title,
  count,
  devices,
  deviceType,
  icon,
  disabledClick
}: DeviceTabProps) => {
  const [isDeviceSelectionOpen, setIsDeviceSelectionOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  // Handle device selection for Delete or Edit
  const handleDeviceSelect = (device: Device, action: string) => {
    setSelectedDevice(device);
    console.log("Selected Device:", device);
    setIsDeviceSelectionOpen(false);
    if (action === "delete") {
      setIsPopupOpen(true);
    } else if (action === "edit") {
      setIsEditSheetOpen(true);
    }
  };

  const handleDelete = () => {
    if (selectedDevice) {
      if (deviceType === "Air Conditioner") {
        deleteAircon(selectedDevice.id);
      } else {
        deleteLight(selectedDevice.id);
      }
      setIsPopupOpen(false);
    }
  };

  const handleEdit = () => {
    if (selectedDevice) {
      console.log(
        selectedDevice.id,
        selectedDevice.name,
        selectedDevice.unit_usage,
        selectedDevice.count
      );
      if (deviceType === "Air Conditioner") {
        updateAircon(
          selectedDevice.id,
          selectedDevice.name,
          selectedDevice.unit_usage,
          selectedDevice.count
        );
      } else {
        updateLight(
          selectedDevice.id,
          selectedDevice.name,
          selectedDevice.unit_usage,
          selectedDevice.count
        );
      }
      setIsEditSheetOpen(false);
    }
  };

  return (
    <>
      {/* Device Tab - Open device selection on click */}
      <div
        className="relative z-10 flex justify-between items-center gap-4 p-2 w-full rounded-full transition-all duration-500 group hover:bg-white cursor-pointer"
        onClick={() => setIsDeviceSelectionOpen(true)}
      >
        <div className="flex justify-center items-center bg-white rounded-full w-14 h-14 transition-colors duration-500 group-hover:bg-neutral-200">
          {icon && icon}
        </div>
        <div className="flex flex-col gap-1">
          <p
            className={cn(
              "text-sm font-semibold text-black",
              useWhiteStyle && "text-white"
            )}
          >
            {title}
          </p>
          <p
            className={cn(
              "text-sm font-normal text-neutral-500",
              useWhiteStyle && "text-neutral-400"
            )}
          >
            {count} {count > 1 ? "devices" : "device"}
          </p>
        </div>

        <IconChevronRight
          className={cn(
            "text-neutral-700 h-4 w-4 ml-auto",
            disabledClick && "text-transparent"
          )}
        />
      </div>

      {/* Device Selection Modal */}
      <AnimatePresence>
        {isDeviceSelectionOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDeviceSelectionOpen(false)}
          >
            <motion.div
              className="bg-white p-6 rounded-3xl shadow-lg w-[400px] text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-bold mb-4">Manage {title}</h2>
              <div className="flex flex-col gap-3 mt-6">
                {devices.map((device, index) => (
                  <div
                    key={index}
                    className="flex justify-between bg-gray-200 hover:bg-gray-300 text-black px-4 py-3 rounded-xl"
                  >
                    <span className="text-md font-medium">
                      {" "}
                      {device.name.replace(/Living Room|Bedroom/, "").trim()}
                    </span>
                    <div className="space-x-2 flex">
                      <button
                        className="text-blue-500 flex justify-center items-center"
                        onClick={() => handleDeviceSelect(device, "edit")}
                      >
                        <IconEdit size={20} />
                      </button>
                      <button
                        className="text-red-500 flex justify-center items-center"
                        onClick={() => handleDeviceSelect(device, "delete")}
                      >
                        <IconTrash size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Popup */}
      <AnimatePresence>
        {isPopupOpen && selectedDevice && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPopupOpen(false)}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-[400px] text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-bold mb-4">
                Delete {selectedDevice.name}?
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this device? This action cannot
                be undone.
              </p>
              <div className="flex justify-around">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  onClick={handleDelete}
                >
                  Confirm
                </button>
                <button
                  className="bg-gray-300 px-4 py-2 rounded-lg"
                  onClick={() => setIsPopupOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Sheet Popup */}
      <AnimatePresence>
        {isEditSheetOpen && selectedDevice && (
          <motion.div
            className="fixed inset-y-0 right-0 w-1/3 bg-white text-black p-6 shadow-lg z-[1000] rounded-l-3xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex justify-between items-center mb-6">
              <motion.h2
                className="text-xl font-bold"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                Edit{" "}
                {selectedDevice.name.replace(/Living Room|Bedroom/, "").trim()}
              </motion.h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditSheetOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                Close
              </motion.button>
            </div>

            {/* Edit Device Details */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-gray-700 mb-2">Device Name</label>
              <motion.input
                type="text"
                placeholder="Enter new device name"
                className="w-full p-3 rounded-lg bg-gray-50 text-black border border-gray-300 shadow-sm focus:ring-2 focus:ring-black focus:outline-none"
                value={selectedDevice.name}
                onChange={(e) =>
                  setSelectedDevice({ ...selectedDevice, name: e.target.value })
                }
              />
            </motion.div>

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
                value={selectedDevice.unit_usage}
                onChange={(e) =>
                  setSelectedDevice({
                    ...selectedDevice,
                    unit_usage: parseFloat(e.target.value),
                  })
                }
              />
            </motion.div>

            <motion.div
              className="mb-4"
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
                value={selectedDevice.count}
                onChange={(e) =>
                  setSelectedDevice({
                    ...selectedDevice,
                    count: parseInt(e.target.value),
                  })
                }
              />
            </motion.div>

            {/* Save Changes Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-blue-500 text-white py-3 rounded-full shadow-sm"
              onClick={handleEdit}
            >
              Save Changes
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DeviceTab;
