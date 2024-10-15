"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/utils/cn";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/navigations/sidebar";
import { Logo } from "@/components/ui/logos/logo";
import { LogoIcon } from "@/components/ui/logos/logo-icon";
import { SIDE_BAR_LINKS } from "@/constants";
import BillingCard from "@/components/ui/cards/billing-card";
import { User } from "@/types/user";
import CreditCard from "@/components/ui/cards/credit-card";
import InvoiceCard from "@/components/ui/cards/invoice-card";
// import { MOCK_INVOICES } from "@/constants/mocks/mock-invoices";
import { getBillings } from "@/constants/billings";
import { getElectricityUsageByMonth } from "@/constants/electricity-usages";

const BillingPage = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [tax, setTax] = useState<number | null>(null);
  const [usage, setElectricityUsage] = useState<number | null>(null);
  const [invoices, setInvoices] = useState<{ date: string; amount: string }[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3007/get-login", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const usersData = await response.json();
          setUser(usersData);
        } else {
          console.error("Failed to fetch users:", response.statusText);
          router.push("/sign-in");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        router.push("/sign-in");
      }
    };

    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const fetchBillingData = async () => {
      const billingData = await getBillings();
      if (billingData.length > 0) {
          const lastBilling = billingData[billingData.length - 1];
          setTotalAmount(lastBilling.total);
          setTax(lastBilling.tax);
      }
  
      const formattedInvoices = billingData
          .filter(billing => billing.year === year)
          .map(billing => {
              const totalAmount = typeof billing.total === "number" ? billing.total : Number(billing.total);
              console.log("Total amount:", totalAmount);
              return {
                  date: new Date(year, billing.month - 1, 1).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
                  amount: `฿${totalAmount.toFixed(2)}`,
              };
          });
      
      setInvoices(formattedInvoices);
    };

    const fetchMonthlyElectricityUsage = async (month: number, year: number) => {
      try {
        const usage = await getElectricityUsageByMonth(month, year);
        setElectricityUsage(usage);
      } catch (error) {
        console.error("Error fetching monthly electricity usage:", error);
      }
    };

    fetchUsers();
    fetchBillingData();
    fetchMonthlyElectricityUsage(month, year);
  }, [router]);

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-white w-full flex-1 mx-auto border border-neutral-200 overflow-hidden",
        "h-screen max-w-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 bg-white">
          <div className="flex flex-col flex-1">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {SIDE_BAR_LINKS.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              className="pl-[0.5rem]"
              link={{
                label: user ? `${user.first_name} ${user.last_name}` : "John Doe",
                href: "#",
                image: (
                  <Image
                    src="https://images.unsplash.com/photo-1472491235688-bdc81a63246e?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    className="w-12 h-12 flex-shrink-0 rounded-full object-cover"
                    width={300}
                    height={300}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard user={user} totalAmount={totalAmount} tax={tax} usage={usage} invoices={invoices} /> {/* Pass invoices to Dashboard */}
    </div>
  );
};

export default BillingPage;

type DashboardProps = {
  user: User | null;
  totalAmount: number | null;
  tax: number | null;
  usage: number | null;
  invoices: { date: string; amount: string }[];
};

const Dashboard = ({ user, totalAmount, tax, usage, invoices }: DashboardProps) => {
  const handleViewAll = () => {
    console.log("View all invoices");
  };

  const fullAddress = `${user?.address1}, ${user?.city}, ${user?.postal_code}`;

  return (
    <div className="flex flex-1 ml-10 my-6 mr-6">
      <div className="flex flex-col gap-3 flex-1 w-full h-full rounded-3xl">
        {/* TOP ROW */}
        <div className="flex gap-3 h-[60%]">
          <BillingCard
            clientName={user ? `${user.first_name} ${user.last_name}` : "John Doe"}
            address={fullAddress}
            totalAmount={totalAmount || 0}
            tax={tax || 0}
            totalElectricityUsage={usage || 0}
          />
          <InvoiceCard invoices={invoices} onViewAll={handleViewAll} /> {/* Pass the real invoices data */}
        </div>

        {/* BOTTOM ROW */}
        <div className="flex gap-3 h-[40%]">
          <CreditCard
            cardType="MasterCard"
            lastFourDigits="0911"
            expirationDate="14/28"
            nextBillingDate="November 01, 2024"
          />
          <div className="relative h-full w-full rounded-3xl bg-transparent p-5 flex flex-col justify-between"></div>
        </div>
      </div>
    </div>
  );
};