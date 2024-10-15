import {
  IconLayoutDashboard,
  IconBolt,
  IconReceipt,
} from "@tabler/icons-react";

export const SIDE_BAR_LINKS = [
  {
    label: "My Home",
    href: "/",
    icon: (
      <IconLayoutDashboard className="text-neutral-700 h-6 w-6 flex-shrink-0" />
    ),
  },
  {
    label: "My Smart Meter",
    href: "/my-smart-meter",
    icon: <IconBolt className="text-neutral-700 h-6 w-6 flex-shrink-0" />,
  },
  {
    label: "My Billing",
    href: "/billing",
    icon: <IconReceipt className="text-neutral-700 h-6 w-6 flex-shrink-0" />,
  },
];

// NOTE: BILLING
export const UNIT_PRICE = 2.9;
export const TAX = 0.07;
export const MAX_MONTHY_USAGE = 1000;

// NOTE: CRYPTOGRAPHY PROCESS FOR HASHING WITH BCRYPT PEPPER
export const SALT_ROUNDS = 10;
