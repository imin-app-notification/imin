import { connectToDatabase } from '../../lib/db';

/**
 * Add a new event to db and fetch event details
 *
 * @param {object}   req         request info containing event details
 * @param {object}   res         respond info indicating whether success
 */
async function handler(req, res) {
  if (req.method == 'POST') {
    // Add a new event
    const event = req.body.event;
    // connect to db
    const client = await connectToDatabase();
    const db = client.db();
    // send invitation to attendees 
    const emailList = req.body.guests;
    let curEmail = null;
    let coll = db.collection('groups');
    // Find group info
    if (event.groupRef != -1) {
      // Check if user exists
      const curGroup = await coll.findOne({
        _id: parseInt(event.groupRef),
      });
      // Add user from group
      for (let i = 0; i < curGroup.guestList.length; i++) {
        curEmail = curGroup.guestList[i];
        if (!emailList.includes(curEmail)) {
          emailList.push(curEmail);
        }
      }
    }
    event.guestList = emailList;
    // use event collection
    coll = db.collection('events');
    // estimate total number and assign id
    var c = await coll.estimatedDocumentCount(); // faster to estimate
    //var c = await coll.countDocuments(); // slower but accurate
    event._id = c;
    // insert event
    const result = await coll.insertOne(event);
    // Save info to users
    const user = JSON.parse(req.body.user);
    coll = db.collection('users');
    // Check if user exists
    const curUser = await coll.findOne({
      email: user,
    });
    // Update the event info to user profile for organizer
    if (!curUser) {
      res.status(200).json({ message: 'Failed!' });
    } else {
      await coll.updateOne(
        { email: user },
        { $push: { events: { id: event._id, is_attend: 1, is_organizer: true } } }
      );
    }
    
    for (let i = 0; i < emailList.length; i++) {
      // Update the event info to user profile for attendees 
      // if attendess is registered
      curEmail = emailList[i];
      const curUser = await coll.findOne({
        email: curEmail,
      });
      if (curUser) {
        await coll.updateOne(
          { email: curEmail },
          { $push: { events: { id: event._id, is_attend: 2, is_organizer: false } } }
        );
      }
    }
    res.status(201).json({ message: 'Created event!' });
    client.close();
    return 1;

  } else if (req.method == 'GET') {
    // Get event info
    // Parse event ids
    const ids = JSON.parse(req.headers.ids);
    var events = [];
    let len = ids.length;
    // connect to db
    const client = await connectToDatabase();
    const db = client.db();
    // use event collection
    let coll = db.collection('events');
    for (let i = 0; i < len; i++) {
      // find event and insert event into list to return 
      var result = await coll.findOne({ _id: parseInt(ids[i]) });
      if (result != null) {
        events.push(result);
      }
    }
    // Store event list in response with msg
    if (events.length > 0) {
      res.status(201).json({ message: 'Found', events: events });
    } else {
      res.status(221).json({ message: 'Not Found' });
    }
  }
}

export default handler;