import { z } from "zod";

export const formSchema = z.object({
    title:      z.string().min(3).max(100),
    description:z.string().min(20).max(500),
    category:   z.string().min(3).max(20),
    link: z
      .string()
      .url({ message: "Please enter a valid URL." })
      .refine((url) => {
        try {
          const pathname = new URL(url).pathname;
          return /\.(jpe?g|png|gif|webp|svg)$/i.test(pathname);
        } catch {
          return false;
        }
      }, { message: "URL must point to a .jpg/.png/.gif/.webp/.svg file" }),
    pitch:      z.string().min(10),
  });
  