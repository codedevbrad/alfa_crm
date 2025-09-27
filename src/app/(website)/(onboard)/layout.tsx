import type { Metadata } from "next"
import Header from "./(layout)/header"

export const metadata: Metadata = {
  title: "The code bootcamp",
  description: "Learning Application",
};

export default async function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <div>
            <Header />
            <div className="">
               {children}
            </div>
        </div>
  );
}