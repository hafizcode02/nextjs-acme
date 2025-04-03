import { date, z } from "zod";

export const createInvoiceSchema = z
  .object({
    id: z.string(),
    customerId: z.string().min(1, { message: "Customer is required" }),
    amount: z.coerce
      .number()
      .min(0.01, { message: "Amount must be greater than 0" }),
    status: z.enum(["pending", "paid"], {
      required_error: "Status is required",
    }),
    date: z.coerce.date().default(() => new Date()),
  })
  .omit({ id: true, date: true })
  .strict();

export const updateInvoiceSchema = z.object({
  id: z.string(),
  amount: z.coerce.number().optional(),
  status: z.enum(["pending", "paid"]),
}).omit({ id: true })
.strict();
