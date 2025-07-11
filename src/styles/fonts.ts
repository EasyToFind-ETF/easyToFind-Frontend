import localFont from "next/font/local";

export const oneShinhan = localFont({
  src: [
    {
      path: "../assets/fonts/ONESHINHANLIGHT 2.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/ONESHINHANMEDIUM 2.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/ONESHINHANBOLD 2.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-one-shinhan",
});
