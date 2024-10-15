import { useState, useEffect } from "react";
import { Aircon } from "../types/aircon";
import { Light } from "../types/light";
import { set } from "zod";

export type Device = {
  id: string;
  name: string;
  unit_usage: number;
  count: number;
};

export type AirconRooms = {
  "Living Room": Device[];
  Bedroom: Device[];
};

export type LightsRooms = {
  "Living Room": Device[];
  Bedroom: Device[];
};

export const getAircons = () => {
  const [aircons, setAircons] = useState<AirconRooms>({
    "Living Room": [],
    Bedroom: [],
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAircons = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        if (!token) {
          console.error("No token found in localStorage.");
          return;
        }

        const response = await fetch("http://localhost:3001/aircons", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const airconsData: Aircon[] = await response.json();
          const airconsByRoom: AirconRooms = {
            "Living Room": [],
            Bedroom: [],
          };

          for (const aircon of airconsData) {
            if (
              aircon.aircons_name.includes("Living Room") ||
              aircon.aircons_name.includes("Livingroom")
            ) {
              airconsByRoom["Living Room"].push({
                id: aircon.id,
                name: aircon.aircons_name,
                unit_usage: aircon.aircons_unit_usage,
                count: aircon.aircons_count,
              });
            } else if (
              aircon.aircons_name.includes("Bed Room") ||
              aircon.aircons_name.includes("Bedroom")
            ) {
              airconsByRoom["Bedroom"].push({
                id: aircon.id,
                name: aircon.aircons_name,
                unit_usage: aircon.aircons_unit_usage,
                count: aircon.aircons_count,
              });
            }
          }
          // console.log("Aircons by room:", airconsByRoom);
          setAircons(airconsByRoom);
        } else {
          console.error(
            "Failed to fetch aircons:",
            response.status,
            response.statusText
          );
          setError(response.statusText);
        }
      } catch (error: any) {
        console.error("Error fetching aircons:", error);
        setError(error.message); // Store the error message
      }
    };

    fetchAircons();
  }, []);
  return aircons;
};

export const getLights = () => {
  const [lights, setLights] = useState<LightsRooms>({
    "Living Room": [],
    Bedroom: [],
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLights = async () => {
      try {
        // Check if token is available
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        if (!token) {
          console.error("No token found in localStorage.");
          return;
        }

        const response = await fetch("http://localhost:3004/lights", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const lightsData: Light[] = await response.json();
          const lightsByRoom: LightsRooms = {
            "Living Room": [],
            Bedroom: [],
          };

          // Classifying air conditioners by room based on aircon_name
          for (const light of lightsData) {
            if (
              light.lights_name.includes("Living Room") ||
              light.lights_name.includes("Livingroom")
            ) {
              lightsByRoom["Living Room"].push({
                id: light.id,
                name: light.lights_name,
                unit_usage: light.lights_unit_usage,
                count: light.lights_count,
              });
            } else if (
              light.lights_name.includes("Bed Room") ||
              light.lights_name.includes("Bedroom")
            ) {
              lightsByRoom["Bedroom"].push({
                id: light.id,
                name: light.lights_name,
                unit_usage: light.lights_unit_usage,
                count: light.lights_count,
              });
            }
          }
          console.log("Lights by room:", lightsByRoom);
          setLights(lightsByRoom);
        } else {
          console.error(
            "Failed to fetch lights:",
            response.status,
            response.statusText
          );
          setError(response.statusText);
        }
      } catch (error: any) {
        console.error("Error fetching lights:", error);
        setError(error.message); // Store the error message
      }
    };

    fetchLights();
  }, []);
  return lights;
};

export const addAircon = async (
  airconName: string,
  airconCount: number,
  airconUnitUsage: number
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    const response = await fetch("http://localhost:3001/add-aircon", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        aircons_name: airconName,
        aircons_count: airconCount,
        aircons_unit_usage: airconUnitUsage,
      }),
    });

    if (response.ok) {
      console.log("Aircon added successfully.");
    } else {
      console.error(
        "Failed to add aircon:",
        response.status,
        response.statusText
      );
    }
  } catch (error: any) {
    console.error("Error adding aircon:", error);
  }
};

export const addLight = async (
  lightName: string,
  lightCount: number,
  lightUnitUsage: number
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    const response = await fetch("http://localhost:3004/add-light", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        lights_name: lightName,
        lights_count: lightCount,
        lights_unit_usage: lightUnitUsage,
      }),
    });

    if (response.ok) {
      console.log("Light added successfully.");
    } else {
      console.error(
        "Failed to add light:",
        response.status,
        response.statusText
      );
    }
  } catch (error: any) {
    console.error("Error adding light:", error);
  }
};

export const deleteAircon = async (airconId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    const response = await fetch(
      `http://localhost:3001/delete-aircon/${airconId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (response.ok) {
      console.log("Aircon deleted successfully.");
    } else {
      console.error(
        "Failed to delete aircon:",
        response.status,
        response.statusText
      );
    }
  } catch (error: any) {
    console.error("Error deleting aircon:", error);
  }
};

export const deleteLight = async (lightId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    const response = await fetch(
      `http://localhost:3004/delete-light/${lightId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (response.ok) {
      console.log("Light deleted successfully.");
    } else {
      console.error(
        "Failed to delete light:",
        response.status,
        response.statusText
      );
    }
  } catch (error: any) {
    console.error("Error deleting light:", error);
  }
};

export const updateAircon = async (
  airconId: string,
  airconName: string,
  airconUnitUsage: number,
  airconCount: number
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    const response = await fetch(
      `http://localhost:3001/update-aircon/${airconId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          aircons_name: airconName,
          aircons_unit_usage: airconUnitUsage,
          aircons_count: airconCount,
        }),
      }
    );

    if (response.ok) {
      const updatedAircon = await response.json();
      console.log("Aircon updated successfully:", updatedAircon);
    } else {
      console.error(
        "Failed to update aircon:",
        response.status,
        response.statusText
      );
    }
  } catch (error: any) {
    console.error("Error updating aircon:", error);
  }
};


export const updateLight = async (
  lightId: string,
  lightName: string,
  lightUnitUsage: number,
  lightCount: number
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    const response = await fetch(
      `http://localhost:3004/update-light/${lightId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          lights_name: lightName,
          lights_unit_usage: lightUnitUsage,
          lights_count: lightCount,
        }),
      }
    );

    if (response.ok) {
      const updatedLight = await response.json();
      console.log("Light updated successfully:", updatedLight);
    } else {
      console.error(
        "Failed to update light:",
        response.status,
        response.statusText
      );
    }
  } catch (error: any) {
    console.error("Error updating light:", error);
  }
};
