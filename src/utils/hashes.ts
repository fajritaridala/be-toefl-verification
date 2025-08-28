import crypto from "crypto";

// memastikan urutan dari data yg akan dihash
const constantStringify = (obj: Record<string, any>): string => {
  const allKeys = Object.keys(obj).sort();
  const result: Record<string, any> = {};
  for (const k of allKeys) result[k] = obj[k];
  return JSON.stringify(result);
};

export function generateHash(input: Record<string, any>): string {
  const data = constantStringify(input);
  return crypto.createHash("sha256").update(data).digest("hex");
}
