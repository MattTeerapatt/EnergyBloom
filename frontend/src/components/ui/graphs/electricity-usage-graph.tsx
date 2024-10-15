import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { BackgroundGradientAnimation } from "../backgrounds/background-gradient-animation";
import { getElectricityUsages, addElectricityUsage, updateElectricityUsage } from "@/constants/electricity-usages";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ElectricityUsageGraph = () => {
  const [unitUsageData, setUnitUsageData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState<number>(dayjs().month() + 1); // Month index starts from 0
  const [currentYear, setCurrentYear] = useState<number>(dayjs().year());
  const [daysInMonth, setDaysInMonth] = useState<number>(dayjs().date());

  useEffect(() => {
    const fetchData = async () => {
      const unitUsages = await getElectricityUsages(2024); 
      console.log("Unit usages:", unitUsages);
      setUnitUsageData(unitUsages);
    };

    fetchData();

    const today = dayjs();
    const dayOfMonth = today.date();
    const labelData = Array.from({ length: daysInMonth }, (_, i) =>
      today.set("month", i + 1).format("MMM") // Only format the month
    );
    setLabels(labelData);

  
    if (dayOfMonth === 1) {
      addElectricityUsage(currentMonth, currentYear, Math.floor(Math.random() * 100));
    }

    const interval = setInterval(() => {
      updateElectricityUsage(currentMonth, currentYear, Math.floor(Math.random() * 100));
      
      setCurrentMonth(today.month() + 1);
      setCurrentYear(today.year());      
      setDaysInMonth(today.date());      
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const data = {
    labels: labels, // Dynamically generated labels
    datasets: [
      {
        label: "Energy Usage (kWh)",
        data: unitUsageData,
        borderColor: "rgba(255, 255, 255, 1)",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        pointBackgroundColor: "rgba(255, 255, 255, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#fff",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          color: "#fff", // White color for X axis labels
        },
        grid: {
          display: false, // Hide grid lines
        },
      },
      y: {
        ticks: {
          color: "#fff", // White color for Y axis labels
        },
        grid: {
          display: false, // Hide grid lines
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide legend
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `${tooltipItem.raw} kWh`;
          },
        },
      },
    },
  };

  return (
    <div className="h-full w-full">
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(64, 64, 64)" // Dark gray start
        gradientBackgroundEnd="rgb(10, 25, 47)" // Dark blue end
        firstColor="64, 64, 64" // Gray
        secondColor="10, 25, 47" // Dark blue
        thirdColor="30, 30, 30" // Medium gray
        fourthColor="50, 50, 100" // Darker blue
        fifthColor="10, 25, 47" // Dark blue
        pointerColor="255, 255, 255" // White for the pointer highlight
      >
        <div className="z-50 w-full flex flex-1 justify-start items-center">
          <div className="w-full flex flex-1 scale-[80%] -translate-x-16 -translate-y-5">
            <Line data={data} options={options} />
          </div>
        </div>
      </BackgroundGradientAnimation>
    </div>
  );
};

export default ElectricityUsageGraph;
