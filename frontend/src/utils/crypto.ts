import crypto from "crypto";

export const PEPPER = process.env.PEPPER;

export const hashData = (data) => {
  const hash = crypto.createHash("sha256");
  hash.update(data + PEPPER);
  return hash.digest("hex");
};

export const verifyData = (data, storedHash) => {
  const hash = hashData(data);
  return hash === storedHash;
};