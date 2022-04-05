import { connectToDatabase } from '../../lib/db';

/**
 * Update the whether to attend an event
 *
 * @param {object}   req         request info containing event detail and email list
 * @param {object}   res         respond info indicating whether success
 */
async function handler(req, res) {
  if (req.method == 'POST') {
    // Get event info
    const details = req.body;
    const email = eval(details.user);
    const idx = details.idx;
    const select = eval(details.select);
    // Connect to db
    const client = await connectToDatabase();
    const db = client.db();
    // Use event collection
    let coll = db.collection('users');
    // Check if current user exist
    console.log(email)
    const curUser = await coll.findOne({
      email: email,
    });
    // If not failed
    if (!curUser) {
      client.close();
      res.status(200).json({ message: 'Failed' });
    } else {
      // If not update the options
      const status = await coll.findOneAndUpdate(
        { email: email, "events.id": idx },
        { $set: { "events.$.is_attend": select } }
      );
      console.log(status);
      res.status(201).json({ message: 'Update Success' });
    }
    client.close();

    return 1;
  }
}

export default handler;