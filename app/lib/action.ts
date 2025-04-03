"use server";

import { createInvoiceSchema, updateInvoiceSchema } from "./validation";
import { query } from "./db-client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createInvoice(formData: FormData) {
  try {
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
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw new Error("Failed to create invoice");
  }
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function updateInvoice(invoicesId: string, formData: FormData) {
  try {
    const { amount, status } = updateInvoiceSchema.parse({
      amount: formData.get("amount"),
      status: formData.get("status"),
    });

    const amoutInCents = amount ? amount * 100 : 0;

    await query(`UPDATE invoices SET amount = $1, status = $2 WHERE id = $3`, [
      amoutInCents,
      status,
      invoicesId,
    ]);
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw new Error("Failed to update invoice");
  }
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(invoicesId: string) {
  try {
    await query(`DELETE FROM invoices WHERE id = $1`, [invoicesId]);
    console.log("Invoice found, proceeding to delete.");
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw new Error("Failed to delete invoice");
  }

  revalidatePath("/dashboard/invoices");
}
