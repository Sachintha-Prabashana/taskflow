import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .string({
      message:
        "NEXT_PUBLIC_API_URL is missing. Please ensure .env or .env.local is present and configured.",
    })
    .url("NEXT_PUBLIC_API_URL must be a valid URL (e.g. http://localhost:3001)"),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => ` • ${i.message}`).join("\n");
  const errorMessage = [
    "\n=======================================================",
    "❌ ENVIRONMENT CONFIGURATION ERROR",
    "Missing or invalid environment variables detected:",
    issues,
    "",
    "Please verify that .env or .env.local exists in the web directory.",
    "You can copy .env.example to .env.local to get started.",
    "=======================================================\n",
  ].join("\n");

  console.error(errorMessage);
  throw new Error(errorMessage);
}

export const env = parsed.data;
