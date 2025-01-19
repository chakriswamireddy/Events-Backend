require('dotenv').config();


const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const User = require('../models/UserSchema.js')

const JWT_SECRET = `${process.env.JWT_SECRET}`; 

const express = require('express');
const createSubscriber = require('../messager/CreateSubscriber');

const {getList,getSubscriberId} = require('../messager/getList');
const sendNotification = require('../messager/SendNotifcs');

const router = express.Router();




router.post('/register', async (req, res) => {
  const { username, email, password, role, profileImg } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await User.create({ username, email, password: hashedPassword, role, profileImg });
    
    const token = jwt.sign({ id: newUser._id, role: newUser.role, email: newUser.email, username: newUser.username,profileImg }, JWT_SECRET, { expiresIn: '1h' });


    createSubscriber(newUser);

      sendNotification('', email , 'Welcome', 'Explore our Portal')
  .then(() => {
    console.log('Notification sent successfully.');
  })
  .catch((error) => {
    console.error('Error sending notification:', error);
  });


    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error registering user', error });
  }
});


router.post('/login', async (req, res) => {
  const {  email, password} = req.body;

  // console.log(await getList)

  // const list = await getList;

  // console.log((await list.subscriberId()).data)

  // subscriberId('fornot@gmail.com').then((res) => console.log(res))

  // const sId = await getSubscriberId('fornot@gmail.com');

  // console.log(sId)

  // sendNotification( 'manager_name','fornot@gmail.com',`Event Invitation`, 'Youve been invited for a new Event :${event_name}. organizer: ${manager_mail} ')

  // sendNotification('fromName','hello@gmail.com' , 'subject', 'message')
  // .then(() => {
  //   console.log('Notification sent successfully.');     
  // })
  // .catch((error) => {
  //   console.error('Error sending notification:', error);
  // });
  // clg

  // console.log(getList.subscriberId('fornot@gmail.com'))

  try {
    //check

    const userExists = await User.findOne({ email });

    if ( ! userExists) return res.status(404).json({ message: 'User Not exists ,register' });

    const isPasswordCorrect = await bcryptjs.compare(password, userExists.password);

    if ( !isPasswordCorrect) {
      return res.status(404).json({ message: 'Wrong Password' });
    }
    

    const token = jwt.sign({  id: userExists._id, email: userExists.email, role: userExists.role, username: userExists.username, profileImg: userExists.profileImg }, JWT_SECRET, { expiresIn: '1h' });

   
    
    res.status(201).json({ message: 'User Login successfully', token });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error Login user', error });
  }
});






module.exports = {router}
