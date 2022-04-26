import { connectToDatabase } from '../../lib/db';

/**
 * Fetch the invitation of events for a user from db
 *
 * @param {object}   req         request info containing event detail and email list
 * @param {object}   res         respond info indicating whether success
 */
async function handler(req, res) {
  if (req.method == 'POST') {
    // Parse the email addr of current user
    const email = JSON.parse(req.body.user.user);
    // connect to db
    const client = await connectToDatabase();
    const db = client.db();
    // Use event collection
    let coll = db.collection('users');
    // Find the user
    var user = await coll.findOne({email: email})
    let event_id = []
    var selection = [];
    // Fetch all the event id that is has not 
    // selection of whether to attend (invited event)
    for (var i = 0; i < user.events.length; i++) {
      if (user.events[i].is_attend == 2) {
        event_id.push(user.events[i].id);
      }
    }
    // Find all event by id
    coll = db.collection('events');
    var event = await coll.find({'_id':{$in: event_id}}).sort({startTimeRef: 1, _id: 1 }).toArray();
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
      selection.push(2);
    }
    if (upcomingEvent.length > 0) {
      res.status(201).json({message: 'Found', events: upcomingEvent, isAttend: selection});
    } else {
      res.status(221).json({message: 'Not Found'});
    }
  }
}

export default handler;