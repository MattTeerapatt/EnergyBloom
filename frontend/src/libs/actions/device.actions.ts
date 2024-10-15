// "use server";

// import { createClient } from '@/src/utils/supabase/server'; 
// import dayjs from 'dayjs';
// import bcrypt from 'bcrypt';
// import { revalidatePath } from 'next/cache';
// import { handleSupabaseRequest } from '@/src/utils/supabase/supabase-request-handler';
// import { SALT_ROUNDS } from '@/constants';
// export const addDevice = async ({
//   user_id,
//   device_name,
//   device_type,
//   device_count,
//   device_unit_usage,
// }: AddDeviceParams) => {
//   return handleSupabaseRequest(async () => {
//     try {
//       const supabase = createClient();
//       const createdAt = dayjs().toISOString();

//       const hashedDeviceName = await bcrypt.hash(device_name, SALT_ROUNDS);

//       console.log("Hashed Device Name:", hashedDeviceName);
//       console.log(
//         "Device Verification:",
//         await bcrypt.compare(device_name, hashedDeviceName)
//       );

//       console.log("Adding device this is from actions:", {
//         hash: hashedDeviceName,
//         user_id,
//         device_name,
//         device_type,
//         device_count,
//         device_unit_usage,
//         created_at: createdAt,
//       });

//       const { data, error } = await supabase.from("devices").insert([
//         {
//           user_id,
//           device_name,
//           device_type,
//           device_count,
//           device_unit_usage,
//           created_at: createdAt,
//         },
//       ]);

//       if (error) {
//         throw new Error(error.message);
//       }

//       revalidatePath("/");

//       return data;
//     } catch (error) {
//       console.error("Error adding device:", error);
//       throw new Error("Failed to add device. Please try again later.");
//     }
//   }, "adding device");
// };

// export const updateDevice = async ({
//   id,
//   device_name,
//   device_type,
//   device_count,
//   device_unit_usage,
// }: UpdateDeviceParams) => {
//   return handleSupabaseRequest(async () => {
//     try {
//       const supabase = createClient();

//       const hashedDeviceName = await bcrypt.hash(device_name, SALT_ROUNDS);

//       console.log("Hashed Device Name:", hashedDeviceName);

//       console.log("Updating device this is from actions:", {
//         id,
//         device_name: hashedDeviceName,
//         device_type,
//         device_count,
//         device_unit_usage,
//       });

//       const { data, error } = await supabase
//         .from("devices")
//         .update({
//           device_name,
//           device_type,
//           device_count,
//           device_unit_usage,
//         })
//         .eq("id", id);

//       if (error) {
//         throw new Error(error.message);
//       }

//       revalidatePath("/");

//       return data;
//     } catch (error) {
//       console.error("Error updating device:", error);
//       throw new Error("Failed to update device. Please try again later.");
//     }
//   }, "updating device");
// };

// export const deleteDevice = async ({ id }: DeleteDeviceParams) => {
//   return handleSupabaseRequest(async () => {
//     try {
//       const supabase = createClient();

//       console.log("Deleting device this is from actions:", id);

//       const { data, error } = await supabase
//         .from("devices")
//         .delete()
//         .eq("id", id);

//       if (error) {
//         throw new Error(error.message);
//       }

//       revalidatePath("/");

//       return data;
//     } catch (error) {
//       console.error("Error deleting device:", error);
//       throw new Error("Failed to delete device. Please try again later.");
//     }
//   }, "deleting device");
// };

// export const getDevices = async ({ user_id }: GetDevicesParams) => {
//   return handleSupabaseRequest(async () => {
//     try {
//       const supabase = createClient();

//       const { data, error } = await supabase
//         .from("devices")
//         .select("*")
//         .eq("user_id", user_id);

//       if (error) {
//         console.error("Error:", error);
//         throw new Error(error.message);
//       }

//       return data;
//     } catch (error) {
//       console.error("Error fetching devices:", error);
//       throw new Error("Failed to fetch devices. Please try again later.");
//     }
//   }, "fetching devices");
// };
