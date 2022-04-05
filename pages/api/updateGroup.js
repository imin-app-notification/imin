import { connectToDatabase } from '../../lib/db';

/**
 * API for updating the guest list of a group
 * @param {*} req request info containing guestlist and group ID
 * @param {*} res respond info indicating whether api call was successful
 * @returns 
 */
async function handler(req, res) {
    if (req.method == 'POST') {
        const id = JSON.parse(req.body.id);
        const guestList = req.body.guestList;
        // connect to db
        const client = await connectToDatabase();
        const db = client.db();
        // use event collection
        let coll = db.collection('groups');
          // Find group
        var result = await coll.findOne({_id: id});
        if (result != null) {
          //Update group with new guest list
          await coll.updateOne(
            {_id: id},{$set:{guestList: guestList}});
          res.status(201).json({ message: 'Update Success' });
        } else{
          res.status(200).json({ message: 'Failed' });
        }
        client.close();
        return 1;
    } 
  }
  
  export default handler;