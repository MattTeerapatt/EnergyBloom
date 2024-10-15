// "use server";

// import { createClient } from "@/src/utils/supabase/server";

// export const getLoggedInUser = async () => {
//   try {
//     const supabase = createClient();

//     const {
//       data: { user },
//       error,
//     } = await supabase.auth.getUser();

//     if (error) {
//       throw new Error(error.message);
//     }

//     return user;
//   } catch (error) {
//     console.error("Error fetching logged-in user:", error);
//     throw new Error("Failed to get logged-in user.");
//   }
// };

// export const getUserInfo = async ({ user_id }: GetUserInfoProps) => {
//   try {
//     const supabase = createClient();

//     const { data, error } = await supabase
//       .from("users")
//       .select("*")
//       .eq("id", user_id)

//     if (error) {
//       throw new Error(error.message);
//     }

//     if (!data || data.length === 0) {
//       throw new Error("User not found.");
//     }

//     return data[0];
//   } catch (error) {
//     console.error("Error fetching user info:", error);
//     throw new Error("Failed to fetch user info. Please try again later.");
//   }
// };

// export const signIn = async ({ email, password }: SignInProps) => {
//   try {
//     const supabase = createClient();

//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (error) {
//       throw new Error(error.message);
//     }

//     return data.user;
//   } catch (error) {
//     console.error("Error signing in:", error);
//     throw new Error("Failed to sign in. Please check your credentials.");
//   }
// };

// export const signUp = async ({ password, ...userData }: SignUpParams) => {
//   try {
//     const supabase = createClient();

//     console.log("Attempting sign-up with data:", userData);

//     // Sign up the user with just email and password (SUPABASE AUTH)
//     const { data, error } = await supabase.auth.signUp({
//       email: userData.email,
//       password,
//     });

//     if (error) {
//       console.error("Supabase sign-up error:", error);
//       throw new Error(error.message);
//     }

//     console.log("Sign-up successful, user data:", data.user);

//     if (!data.user) {
//       throw new Error("Failed to retrieve user data after sign-up.");
//     }

//     // Check if the user already exists in the users table
//     const { data: existingUser, error: selectError } = await supabase
//       .from("users")
//       .select("id")
//       .eq("id", data.user.id)
//       .single();

//     if (selectError && selectError.code !== "PGRST116") {
//       console.error("Error checking if user exists:", selectError);
//       throw new Error(
//         "Failed to check if user exists. Please try again later."
//       );
//     }

//     if (existingUser) {
//       // User already exists, update the record
//       const { error: updateError } = await supabase
//         .from("users")
//         .update({
//           email: userData.email,
//           first_name: userData.first_name,
//           last_name: userData.last_name,
//           address1: userData.address1,
//           city: userData.city,
//           postal_code: userData.postal_code,
//           date_of_birth: userData.date_of_birth,
//         })
//         .eq("id", data.user.id);

//       if (updateError) {
//         console.error("Error updating user data:", updateError);
//         throw new Error("Failed to update user data. Please try again later.");
//       }
//     } else {
//       // User does not exist, insert a new record
//       const { error: insertError } = await supabase.from("users").insert([
//         {
//           id: data.user.id,
//           email: userData.email,
//           first_name: userData.first_name,
//           last_name: userData.last_name,
//           address1: userData.address1,
//           city: userData.city,
//           postal_code: userData.postal_code,
//           date_of_birth: userData.date_of_birth,
//         },
//       ]);

//       if (insertError) {
//         console.error("Error inserting user data:", insertError);
//         throw new Error("Failed to insert user data. Please try again later.");
//       }
//     }

//     return data.user;
//   } catch (error) {
//     console.error("Error signing up:", error);
//     throw new Error("Failed to sign up. Please try again later.");
//   }
// };


// export const logoutAccount = async () => {
//   try {
//     const supabase = createClient();

//     const { error } = await supabase.auth.signOut();

//     if (error) {
//       throw new Error(error.message);
//     }

//     return { message: "Successfully logged out." };
//   } catch (error) {
//     console.error("Error logging out:", error);
//     throw new Error("Failed to log out. Please try again later.");
//   }
// };
