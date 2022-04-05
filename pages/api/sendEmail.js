import sendgrid from "@sendgrid/mail";
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
              <div>Start Time: ${req.body.startTime}</div>
              <div>Group: ${req.body.group}</div>
              <div>Details: ${req.body.eventDetails}</div>`,
      });
    }
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
  return res.status(200).json({ error: "" });

}

export default sendEmail;