// "use server";

// import { UNIT_PRICE } from '@/constants';
// import { hashData, verifyData } from '@/src/utils/crypto';
// import { createClient } from '@/src/utils/supabase/server'; 
// import { handleSupabaseRequest } from '@/src/utils/supabase/supabase-request-handler';
// import dayjs from 'dayjs';
// import { revalidatePath } from 'next/cache';

// export const getMonthlyUsage = async ({ user_id }: GetMonthlyUsageParams) => {
//   return handleSupabaseRequest(async () => {
//     try {
//       const supabase = createClient();

//       const currentMonth = dayjs().month() + 1;
//       const currentYear = dayjs().year();

//       console.log(`Filtering for month: ${currentMonth}, year: ${currentYear}`);

//       const { data, error } = await supabase
//         .from("usages")
//         .select("*")
//         .eq("user_id", user_id)
//         .eq("month", currentMonth)
//         .eq("year", currentYear);

//       if (error) {
//         throw new Error(error.message);
//       }

//       if (!data || data.length === 0) {
//         console.log("No usage data found for the current month.");
//         return {
//           usage: 0,
//           price: 0,
//         };
//       }

//       return { usage: data[0].usage, price: data[0].price };
//     } catch (error) {
//       console.error("Error fetching monthly usage data:", error);
//       throw new Error("Failed to fetch monthly usage data. Please try again later.");
//     }
//   }, "fetching monthly usage data");
// };

// export const addElectricityUsage = async ({
//   user_id,
//   usage,
//   price,
// }: AddElectricityUsageParams) => {
//   return handleSupabaseRequest(async () => {
//     try {
//       const supabase = createClient();

//       const createdAt = dayjs().toISOString();
//       const currentMonth = dayjs().month() + 1;
//       const currentYear = dayjs().year();

//       console.log("Adding this usage from actions:", {
//         user_id,
//         month: currentMonth,
//         year: currentYear,
//         usage,
//         price,
//         created_at: createdAt,
//         updated_at: createdAt,
//       });

//       const { data, error } = await supabase.from("usages").insert([
//         {
//           user_id,
//           month: currentMonth,
//           year: currentYear,
//           usage,
//           price,
//           created_at: createdAt,
//           updated_at: createdAt,
//         },
//       ]);

//       if (error) {
//         throw new Error(error.message);
//       }

//       revalidatePath("/");

//       return data;
//     } catch (error) {
//       console.error("Error adding electricity usage:", error);
//       throw new Error(
//         "Failed to add electricity usage. Please try again later."
//       );
//     }
//   }, "adding electricity usage");
// };

// export const updateElectricityUsage = async ({
//   user_id,
//   usage,
//   price,
// }: UpdateElectricityUsageParams) => {
//   return handleSupabaseRequest(async () => {
//     try {
//       const supabase = createClient();
//       const updatedAt = dayjs().toISOString();
//       const currentMonth = dayjs().month() + 1;
//       const currentYear = dayjs().year();

//       console.log("Updating this usage from actions:", {
//         user_id,
//         usage,
//         price,
//         updated_at: updatedAt,
//       });

//       const { data, error } = await supabase
//         .from("usages")
//         .update({
//           user_id,
//           usage,
//           price,
//           updated_at: updatedAt,
//         })
//         .eq("user_id", user_id)
//         .eq("month", currentMonth)
//         .eq("year", currentYear);

//       if (error) {
//         throw new Error(error.message);
//       }

//       revalidatePath("/house/my-smart-meter");

//       return data;
//     } catch (error) {
//       console.error("Error updating electricity usage:", error);
//       throw new Error(
//         "Failed to update electricity usage. Please try again later."
//       );
//     }
//   }, "updating electricity usage");
// };

// export const calculateUsageAndPrice = async ({
//   user_id,
// }: GetTodayUsageParams): Promise<{ usage: number; price: number }> => {
//   return handleSupabaseRequest(async () => {
//     try {
//       const supabase = createClient();

//       const { data: devices, error } = await supabase
//         .from("devices")
//         .select("device_unit_usage, created_at")
//         .eq("user_id", user_id);

//       if (error) {
//         throw new Error(error.message); // Specific Supabase error handling
//       }

//       const now = dayjs();
//       const currentMonthStart = dayjs().startOf("month");
//       const currentMinute = now.diff(currentMonthStart, "minute");

//       console.log("Minutes since the start of the month:", currentMinute);

//       const rawUsage = devices.reduce((total, device) => {
//         const deviceCreatedAt = dayjs(device.created_at);
//         const minutesSinceCreation = deviceCreatedAt.isSame(
//           currentMonthStart,
//           "minute"
//         )
//           ? Math.min(currentMinute - deviceCreatedAt.minute(), currentMinute)
//           : currentMinute;

//         const usageToday =
//           device.device_unit_usage * Math.max(minutesSinceCreation, 0);

//         const totalUsage = (total + usageToday) / 60;

//         return totalUsage;
//       }, 0);

//       const usage = parseFloat(rawUsage.toFixed(2));
//       const price = parseFloat((usage * UNIT_PRICE).toFixed(2));

//       console.log("Today's usage (in minutes):", { usage, price });

//       const storedHash = hashData(usage);

//       console.log("Data Verification:", verifyData(usage, storedHash));
//       console.log("Hashed Usage Data:", storedHash);

//       const isFirstDayOfMonth = new Date().getDate() === 1;
//       console.log("Is first day of month:", isFirstDayOfMonth);

//       const { data: existingUsage, error: checkError } = await supabase
//         .from("usages")
//         .select("*")
//         .eq("user_id", user_id)
//         .eq("month", now.month() + 1)
//         .eq("year", now.year());

//       if (checkError) {
//         throw new Error(checkError.message); // Specific Supabase error handling
//       }

//       const hasCurrentMonthUsage = existingUsage.length > 0;
//       console.log("Has current month usage:", hasCurrentMonthUsage);

//       if (
//         !hasCurrentMonthUsage ||
//         (!hasCurrentMonthUsage && isFirstDayOfMonth)
//       ) {
//         await addElectricityUsage({ user_id, usage, price });
//       } else {
//         await updateElectricityUsage({ user_id, usage, price });
//       }

//       // NOTE: FOR LIVE DEMO
//        if (
//          !hasCurrentMonthUsage ||
//          (!hasCurrentMonthUsage && isFirstDayOfMonth)
//        ) {
//          await addElectricityUsage({ user_id, usage, price });
//        } else {
//          await updateElectricityUsage({ user_id, usage, price });
//        }


//       return { usage, price };
//     } catch (error) {
//       console.error("Error calculating today's usage:", error);
//       throw new Error(
//         "Failed to calculate today's usage. Please try again later."
//       );
//     }
//   }, "calculating usage");
// };

//   // NOTE: FOR TESTING PURPOSES ONLY (USING SECONDS INSTEAD OF HOURS)
// //   export const getTodayUsage = async ({ user_id }: GetTodayUsageParams) => {
// //     try {
// //       const supabase = createClient();
  
// //       const { data: devices, error } = await supabase
// //         .from("devices")
// //         .select("device_unit_usage, created_at")
// //         .eq("user_id", user_id);
  
// //       if (error) {
// //         console.error("Error:", error);
// //         throw new Error(error.message);
// //       }
  
// //       // Use seconds instead of hours for testing purposes
// //       const currentSecond = dayjs().second();
// //       const todayDate = dayjs().startOf("minute"); // Start of the current minute for testing
  
// //       const totalUsage = devices.reduce((total, device) => {
// //         const deviceCreatedAt = dayjs(device.created_at);
  
// //         // Calculate "seconds" since creation today
// //         const secondsSinceCreationToday = deviceCreatedAt.isSame(
// //           todayDate,
// //           "minute"
// //         )
// //           ? Math.min(currentSecond - deviceCreatedAt.second(), currentSecond)
// //           : currentSecond;
  
// //         // Calculate today's usage for this device using seconds instead of hours
// //         const usageToday =
// //           device.device_unit_usage * Math.max(secondsSinceCreationToday, 0);
  
// //         return total + usageToday;
// //       }, 0);
  
// //       const totalPriceToday = totalUsage * UNIT_PRICE;
  
// //       console.log("Today's usage (in seconds):", {
// //         totalUsage,
// //         totalPriceToday,
// //       });
  
// //       return {
// //         totalUsage,
// //         totalPriceToday,
// //       };
// //     } catch (error) {
// //       console.error("Error calculating today's usage (in seconds):", error);
// //       throw new Error(
// //         "Failed to calculate today's usage. Please try again later."
// //       );
// //     }
// //   };
  

