import { hashPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';

/**
 * Create an user
 *
 * @param {object}   req         request info containing event detail and email list
 * @param {object}   res         respond info indicating whether success
 */
async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  // Fetch the input info
  const data = req.body;
  let { name, email, password } = data;
  console.log({ name, email, password });

  // Check validness
  if (
    !email ||
    !email.includes('@') ||
    !password ||
    password.trim().length < 6
  ) {
    res.status(422).json({
      message:
        'Invalid input - password should also be at least 7 characters long.',
    });
    return;
  }

  // Reformat
  email = email.toLowerCase();
  // Connect to db
  const client = await connectToDatabase();
  const db = client.db();
  // Check existing user
  const existingUser = await db.collection('users').findOne({ email: email });
  if (existingUser) {
    res.status(422).json({ message: 'User exists already!' });
    client.close();
    return;
  }
  // Hash password
  const hashedPassword = await hashPassword(password);
  // Insert user to db
  const result = await db.collection('users').insertOne({
    email: email,
    first_name: null,
    last_name: null,
    user_name: name,
    details: null,
    password: hashedPassword,
    events: [],
    groups: []
  });

  res.status(201).json({ message: 'Created user!' });
  client.close();
}

export default handler;
