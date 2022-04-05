import { connectToDatabase } from '../../lib/db';

/**
 * API to get and update user profiles
 *
 * @param {object}   req         request info containing event detail and email list
 * @param {object}   res         respond info indicating whether success
 */
async function handler(req, res) {
  if (req.method == 'POST') {
    // get user info
    const user = req.body;
    console.log(user);
    // connect to db
    const client = await connectToDatabase();
    const db = client.db();
    // use user collection
    let coll = db.collection('users');
    // find user through email addr
    const curUser = await coll.findOne({
      email: user.email,
    });
    if (!curUser) {
      // If not exist, fail
      client.close();
      res.status(200).json({ message: 'Failed' });
    } else {
      // If exist, update info
      await coll.updateOne(
        { email: user.email },
        { $set: user });
      res.status(201).json({ message: 'Update Success' });
    }
    client.close();

    return 1;
  } else if (req.method == 'GET') {
    // get user info
    const inEmail = JSON.parse(req.headers.email);
    // connect to db
    const client = await connectToDatabase();
    const db = client.db();
    // use user collection
    let coll = db.collection('users');
    // find user through email addr
    var user = await coll.findOne({ email: inEmail });
    if (user != null) {
      // return user info if found
      res.status(201).json({ message: 'Found', user: user });
    } else {
      // otherwuse failed
      res.status(221).json({ message: 'Not Found' });
    }
  }
}

export default handler;