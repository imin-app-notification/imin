import { connectToDatabase } from '../../lib/db';

/**
 * Fetch the upcoming event from database
 *
 * @param {object}   req         request info containing email list
 * @param {object}   res         respond info indicating whether success and events returned
 */
async function handler(req, res) {
  if (req.method == 'GET') {
    // Parse the input
    const user = JSON.parse(req.headers.users);
    // Connect to db
    const client = await connectToDatabase();
    const db = client.db();
    let coll = db.collection('users');
    // Find the user
    const curUser = await coll.findOne({
      email: user,
    });
    // Collect all event current user attend 
    // As well as user's selection on whether to attend
    const userEvents = curUser.events;
    var ids = [];
    var selection = [];
    for (let i = 0; i < userEvents.length; i++) {
      if (userEvents[i].is_attend != 2) {
        ids.push(userEvents[i].id);
        selection.push(userEvents[i].is_attend);
      }
    }
    // Collect event based on event it and return them
    coll = db.collection('events');
    var event = await coll.find({ '_id': { $in: ids } }).sort({ startTimeRef: 1, _id: 1 }).limit(5).toArray();
    if (event.length > 0) {
      res.status(201).json({ message: 'Found', events: event, isAttend: selection });
    } else {
      //TODO-Add pseudo event when no event is in the list
      res.status(221).json({ message: 'Not Found' });
    }
  }
}

export default handler;