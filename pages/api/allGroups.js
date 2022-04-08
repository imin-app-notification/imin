import { connectToDatabase } from '../../lib/db';

/**
 * Function for getting all groups from the database for a specific user
 * @param {*} req request info containing guestlist and group ID
 * @param {*} res respond info indicating whether api call was successful
 */
async function handler(req, res) {
  if (req.method == 'GET') {
    // connect to db
    const user = JSON.parse(req.headers.users);
    const client = await connectToDatabase();
    const db = client.db();

    //Find the user
    let coll = db.collection('users');
    const curUser = await coll.findOne({
      email: user,
    });

    //Get that user's groups
    const userGroups = curUser.groups;
    var ids = [];
    for (let i = 0; i < userGroups.length; i++) {
        ids.push(userGroups[i].id);
    }

    // use group collection to find all groups
    let coll_groups = db.collection('groups');
    var group = await coll_groups.find({'_id':{$in: ids}}).limit(10).toArray();
    if (group.length > 0) {
      res.status(201).json({message: 'Found', groups: group});
    } else {
      res.status(221).json({message: 'Not Found'});
    }
  }
}

export default handler;