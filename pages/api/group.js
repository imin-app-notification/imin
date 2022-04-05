import { connectToDatabase } from '../../lib/db';

/**
 * Function for creating and getting groups from the database
 * @param {*} req request info containing guestlist and group ID
 * @param {*} res respond info indicating whether api call was successful
 * @returns 
 */
async function handler(req, res) {
  if (req.method == 'POST') {
    // get event info
    const group= req.body.group;
    // connect to db
    const client = await connectToDatabase();
    const db = client.db();
    // use event collection
    let coll = db.collection('groups');
    // estimate total number and assign id
    var c = await coll.estimatedDocumentCount(); // faster to estimate
    //var c = await coll.countDocuments(); // slower but accurate
    group._id = c
    //console.log({ group });
    
    // insert group
    const result = await coll.insertOne(group);
    const user = JSON.parse(req.body.user);
    coll = db.collection('users');
    const curUser = await coll.findOne({
      email: user,
    });
    if (!curUser) {
      res.status(200).json({ message: 'Failed!' });
    } else {
      await coll.updateOne(
        { email: user },
        { $push: { groups: { id: group._id } } }
      );

      res.status(201).json({ message: 'Created group!' });
    }
    //res.status(201).json({ message: 'Created group!' });

    client.close();

    return 1;
  } else if (req.method == 'GET') {
    // get group ID
    const ids= JSON.parse(req.headers.ids);
    
    var groups = [];
    let len = ids.length;
    // connect to db
    const client = await connectToDatabase();
    const db = client.db();
    // use event collection
    let coll = db.collection('groups');
    for (let i = 0; i < len; i++) {
      // Find group in the collection
      var result = await coll.findOne({_id:parseInt(ids[i])});
      if (result != null) {
        groups.push(result);
      }
    }
    console.log(groups)
    if (groups.length > 0) {
      res.status(201).json({message: 'Found', groups: groups});
    } else {
      res.status(221).json({message: 'Not Found'});
    }
    console.log(groups)

  }
}

export default handler;