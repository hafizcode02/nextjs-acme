"use server";

import { createInvoiceSchema, updateInvoiceSchema } from "./validation";
import { query } from "./db-client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export type State2 = {
  errors?: {
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  try {
    // Validate form using Zod schema
    const validatedFields = createInvoiceSchema.safeParse({
      customerId: formData.get("customerId"),
      amount: formData.get("amount"),
      status: formData.get("status"),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Missing Fields. Failed to Create Invoice.",
      };
    }

    const { customerId, amount, status } = validatedFields.data;

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

export async function updateInvoice(
  invoicesId: string,
  prevState: State2,
  formData: FormData
) {
  try {
    const validatedFields = updateInvoiceSchema.safeParse({
      amount: formData.get("amount"),
      status: formData.get("status"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Missing Fields. Failed to Update Invoice.",
      };
    }

    const { amount, status } = validatedFields.data;

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
