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
    var id_sel_dict = {};
    var selection = [];
    for (let i = 0; i < userEvents.length; i++) {
      if (userEvents[i].is_attend != 2) {
        id_sel_dict[userEvents[i].id] = userEvents[i].is_attend;
      }
    }
    // Collect event based on event it and return them
    coll = db.collection('events');
    var event = await coll.find({ '_id': { $in: Object.keys(id_sel_dict).map(Number) } }).sort({ startTimeRef: 1, _id: 1 }).toArray();
    // filter those upcoming events
    var upcomingEvent = Array();
    for (let index = 0; index < event.length; index++) {
      const cur = new Date(event[index].startTimeRef);
      const today = new Date();
      if (cur >= today) {
        upcomingEvent.push(event[index]);
      }
    }
    upcomingEvent.sort((a, b) => new Date(b.startTimeRef) - new Date(a.startTimeRef))
    upcomingEvent = upcomingEvent.slice(0,5)
    // Collecting selections:
    for (let index = 0; index < upcomingEvent.length; index++) {
      const sel = id_sel_dict[upcomingEvent[index]._id];
      selection.push(sel);
    }
    if (upcomingEvent.length > 0) {
      res.status(201).json({ message: 'Found', events: upcomingEvent, isAttend: selection });
    } else {
      //TODO-Add pseudo event when no event is in the list
      res.status(221).json({ message: 'Not Found' });
    }
  }
}

export default handler;