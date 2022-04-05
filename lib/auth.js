import { hash, compare } from 'bcryptjs';

/**
 * Encode the user password by hashing.
 *
 * @param {string}   password           Password of user
 *
 * @return {string} Hashed password
 */
export async function hashPassword(password) {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
}

/**
 * Verify the correctness of password
 *
 * @param {string}   password           Input password of user
 * @param {string}   hashedPassword     Encoded password
 *
 * @return {boolean} whether two password match each other
 */
export async function verifyPassword(password, hashedPassword) {
  const isValid = await compare(password, hashedPassword);
  return isValid;
}