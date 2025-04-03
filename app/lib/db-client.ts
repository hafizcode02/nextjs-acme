import { db, QueryResultRow } from "@vercel/postgres";

export const client = db;

export async function query<T extends QueryResultRow>(
  text: string,
  params?: (string | number | null)[]
): Promise<T[]> {
  const result = await db.query<T>(text, params);
  return result.rows;
}
