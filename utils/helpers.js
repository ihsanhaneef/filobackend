import bcrypt from "bcrypt";
import { JWT_SECRET } from "../constants/index.js";
import jwt from "jsonwebtoken";

export async function comparePasswords(enteredPassword, savedPasswordHash) {
  try {
    return await bcrypt.compare(enteredPassword, savedPasswordHash);
  } catch (error) {
    return false;
  }
}

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}