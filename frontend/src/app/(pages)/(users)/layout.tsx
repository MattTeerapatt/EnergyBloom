import Image from "next/image";
import './../../globals.css'; 

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <div key={'RootLayout_users'} className="flex min-h-screen w-full justify-between bg-white">
          {children}
          <div className="flex h-screen w-full sticky top-0 items-center justify-end bg-background max-lg:hidden">
            <Image
              src="/assets/images/auth/background-image.jpeg"
              alt="Auth image"
              width={1500}
              height={1000}
              className="object-cover h-screen w-full"
            />
          </div>
        </div>
      </body>
    </html>
  );
}
