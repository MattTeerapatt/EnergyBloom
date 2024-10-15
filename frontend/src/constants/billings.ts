import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Billing } from "@/types/billing";
import { set } from "zod";

export const getBillings = async (): Promise<{ total: number; tax: number, month: number, year: number }[]> => {
    try {
      const response = await fetch(`http://localhost:3002/billings`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
  
      if (response.ok) {
        const billingData: Billing[] = await response.json();
        console.log("Billing data:", billingData);
  
        const sortedBillingData = billingData.sort((a: Billing, b: Billing) => {
            if (a.year === b.year) {
                return a.month - b.month; // Sort by month if the year is the same
            }
            return a.year - b.year; // Otherwise, sort by year
        });
  
        const totals = sortedBillingData.map((billing: Billing) => {
          return {
            total: billing.total, // Assuming total contains the total amount (usage + tax)
            tax: billing.tax, // Assuming tax contains the tax amount
            month: billing.month,
            year: billing.year
          };
        });
  
        return totals;
      } else {
        console.error("Failed to fetch billing data:", response.statusText);
        return [];
      }
    } catch (error) {
      console.error("Error fetching billing data:", error);
      return [];
    }
  };
  


export const AddBilling = async (month: number, year: number) => {

    try {
        const response = await fetch("http://localhost:3002/add-billing", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({ month, year }),
        });

        if (response.ok) {
            const billingData = await response.json();
            console.log("Billing data:", billingData);
            return billingData;
        } else {
            console.error("Failed to add billing data:", response.statusText);
            return null;
        }
    } catch (error) {
        console.error("Error adding billing data:", error);
        return null;
    }
};