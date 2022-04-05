import { connectToDatabase } from '../../lib/db';

/**
 * Fetch the next event from db
 *
 * @param {object}   req         requests contains the user information
 * @param {object}   res         return value of requests including success or not.
 *
 */
async function handler(req, res) {
  if (req.method == 'POST') {
    // Parse user info
    const user = JSON.parse(req.body.user.user);
    // Connect to db
    const client = await connectToDatabase();
    const db = client.db();
    // Use event collection
    let coll = db.collection('users');
    // Find the user in db
    const curUser = await coll.findOne({
      email: user,
    });
    
    // Get all the event of an user as a list of event id number
    const userEvents = curUser.events;
    var ids = [];
    for (let i = 0; i < userEvents.length; i++) {
        ids.push(userEvents[i].id);
    }
    // Fetch all the event according to the list
    coll = db.collection('events');
    // Sort based on starting time.
    var event = await coll.find({'_id':{$in: ids}}).sort({startTimeRef: 1, _id: 1 }).limit(1).toArray();
    // Check if an event is found
    if (event.length > 0) {
      res.status(201).json({message: 'Found', events: event});
    } else {
      event = {
        "_id":"-1",
        "eventNameRef": "No Event",
        "startTimeRef": "2022-02-14T14:56",
        "endTimeRef": "2022-02-14T17:53",
        "groupRef": "1",
        "maxAttendeeRef": "2",
        "recurEventRef": "on",
        "waitlistRef": "on",
        "eventDetailsRef": "None",
        "location": ["40.1", "-76.9958"]
      }
      res.status(221).json({message: 'Not Found', events: [event]});
    }
  }
}

export default handler;