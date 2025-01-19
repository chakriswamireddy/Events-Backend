require('dotenv').config();

const { Novu } = require("@novu/node");

const secretKey = `${process.env.NOVU_KEY}`

const novu = new Novu(secretKey );

// async function createSubscriber(user) {
//   await novu.subscribers.create({
//     subscriberId: user._id,
//     email: user.email,
//     firstName: user.username,
//     avatar: user.profileImg,
//   });
// }

async function createSubscriber(user) {
  await novu.subscribers.identify(user._id, {
    email: user.email,
    // firstName: user.username, needs to unique i.e commented
    avatar: user.profileImg,
  });
}

module.exports = createSubscriber;
