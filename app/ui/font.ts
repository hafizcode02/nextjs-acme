// Adding Custom Font
import { Inter, Lusitana } from "next/font/google";

// Inter is a default font
export const inter = Inter({ subsets: ["latin"] });

// Custom Font
export const lusitana = Lusitana({
  weight: ["400", "700"],
  subsets: ["latin"],
});
