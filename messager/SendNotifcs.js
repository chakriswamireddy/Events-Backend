require('dotenv').config();

const { Novu } = require("@novu/node");
const { getSubscriberId } = require("./getList");

const secretKey = `${process.env.NOVU_KEY}`

// console.log(secretKey)

const novu = new Novu(secretKey);

const sendNotification = async (fromName, toEmail,subj,msg) => {

  // console.log(fromName,  toEmail,subj,msg )

console.log(secretKey)
  const sId = await getSubscriberId(toEmail);

  console.log(sId);

  // const notifications   = await novu.subscribers.getNotifications('678cbe0b155d5c102cac805b');
  // console.log(notifications);

//   const subscriber = await novu.subscribers.get('678cbe0b155d5c102cac805b');
// console.log(subscriber);

  
    await novu.trigger("onboarding-demo-workflow", {
    to: {
      subscriberId: sId ,
    },
    payload: {
      // subject: subj, // Replace {{payload.subject}} with this value
      // body: `From ${fromName}: \n ${msg}`, // Replace {{payload.body}} with this value
      // primaryActionLabel: "Take Action", // Example value
      // secondaryActionLabel: "Ignore", // Example value

      // "subject": "{{payload.subject}}",
      // "body": "{{payload.body}}",
      // "primaryActionLabel": "{{payload.primaryActionLabel}}",
      // "secondaryActionLabel": "{{payload.secondaryActionLabel}}"

      "subject": `${subj}`,
      "body": `From ${fromName}, ${msg}`,
      "primaryActionLabel": "Ok",
      "secondaryActionLabel": "✅"
    },
  });
};


module.exports = sendNotification
