import sendgrid from "@sendgrid/mail";
import { connectToDatabase } from '../../lib/db';
import Moment from 'moment';
// Set the api key
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send invitation email to user
 *
 * @param {object}   req         request info containing event detail and email list
 * @param {object}   res         respond info indicating whether success
 */
async function sendEmail(req, res) {
  // Get all the email to send
  const emailList = req.body.emails;
  let email = null;
  // connect to db
  const client = await connectToDatabase();
  const db = client.db();
  let curGroup = null;
  // Find group info
  if (req.body.group != -1) {
    const coll = db.collection('groups');
    // Check if user exists
    curGroup = await coll.findOne({
      _id: parseInt(req.body.group),
    });
    // Add user from group
    for (let i = 0; i < curGroup.guestList.length; i++) {
      email = curGroup.guestList[i];
      if (!emailList.includes(email)) {
        emailList.push(email);
      }
    }
  }
  var groupInfo = 'No Group';
  if (curGroup != null) {
    groupInfo = curGroup;
  }
  // Iteratively to send email to users
  try {
    for (let i = 0; i < emailList.length; i++) {
      email = emailList[i];
      // Send email
      await sendgrid.send({
        to: `${email}`, // Your email where you'll receive emails
        from: "imin.app.notifications@gmail.com", // your website email address here
        subject: `${req.body.subject}`,
        html: `<div>You have been invited to the following event:</div>
              <div>Event: ${req.body.eventName}</div>
              <div>Start Time: ${Moment(req.body.startTime).format('lll')}</div>
              <div>Group: ${groupInfo}</div>
              <div>Details: ${req.body.eventDetails}</div>`,
      });
    }
  } catch (error) {
    console.log(error.message)
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
  return res.status(200).json({ error: "" });

}

export default sendEmail;