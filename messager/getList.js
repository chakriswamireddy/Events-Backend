require('dotenv').config();
const {Novu} = require('@novu/node');

const secretKey = `${process.env.NOVU_KEY}`


const novu = new Novu(secretKey);

const page = 0;
const limit = 20;

const getList = async (page, limit) => {
    try {
      const response = await novu.subscribers.list(page, limit);
      return response.data;
    } catch (error) {
      console.error('Error fetching subscriber list:', error);
      return [];
    }
  };
  
  const getSubscriberId = async (email) => {
    const page = 0;  
    const limit = 100;  
    let subscriber = null;
    let currentPage = page;
  
    while (!subscriber ) {
      const subscribers = await getList(currentPage, limit);

      if (subscribers.length === 0 && page>10) {
        break;
      }

    //   console.log(new Array(...Object.entries(subscribers)))
    if (typeof subscribers=='object' && subscribers.length!==0 && subscribers != undefined)
        {
        // console.log(typeof subscribers)
        subscriber =subscribers.data.find((i) => i.email === email).subscriberId;
        // console.log(subscriber)
    }
  
      if (!subscriber) {
        currentPage += 1;
      }
    }
  
    if (subscriber) {
      console.log('Subscriber found:');
    } else {
      console.log('Subscriber not found.');
    }
  
    return subscriber;
  };
  


module.exports = {getList,getSubscriberId}

