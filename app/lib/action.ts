"use server";

import { createInvoiceSchema, updateInvoiceSchema } from "./validation";
import { query } from "./db-client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = createInvoiceSchema.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  const amoutInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  await query(
    `INSERT INTO invoices (customer_id, amount, status, date) VALUES ($1, $2, $3, $4)`,
    [customerId, amoutInCents, status, date]
  );

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function updateInvoice(invoicesId: string, formData: FormData) {
  const {amount, status } = updateInvoiceSchema.parse({
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amoutInCents = amount ? amount * 100 : 0;

  await query(`UPDATE invoices SET amount = $1, status = $2 WHERE id = $3`, [
    amoutInCents,
    status,
    invoicesId,
  ]);

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}
