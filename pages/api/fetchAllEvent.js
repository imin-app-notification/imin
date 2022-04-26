import { connectToDatabase } from '../../lib/db';
import Moment from 'moment';

/**
 * Fetch the all events from database to display in calendar 
 *
 * @param {object}   req         request info containing event detail and email list
 * @param {object}   res         respond info indicating whether success
 */
async function handler(req, res) {
  if (req.method == 'POST') {
    // Parse the input
    const user = JSON.parse(req.body.user);
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
    var isAttend = [];
    for (let i = 0; i < userEvents.length; i++) {
        ids.push(userEvents[i].id);
        isAttend.push(userEvents[i].is_attend);
    }
    // Collect event based on event it and return them
    coll = db.collection('events');
    var event = await coll.find({'_id':{$in: ids}}).toArray();
    // Only fetch date and name of event
    var simpleEvent = []
    for (let i=0; i<event.length; i++) {
      var color = "blue";
      if (isAttend[i] == false) {
        color = "red";
      }
      simpleEvent.push({title: event[i].eventNameRef,
                        start: Moment(event[i].startTimeRef).format('YYYY-MM-DD'),
                        end: Moment(event[i].endTimeRef).format('YYYY-MM-DD'),
                        color: color});
    }
    // Check if any event is returned
    if (event.length > 0) {
      res.status(201).json({message: 'Found', events: simpleEvent});
    } else {
      res.status(221).json({message: 'Not Found'});
    }
  }
}

export default handler;