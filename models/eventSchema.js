const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const eventSchema = new mongoose.Schema({

  eventId: { type:String, required: true},
  event_name  :  {type: String, required: true},
  participants: {type: [String] , required: true},
  dateTime: {type: Date, required: true},
  location : {type: String, required: true},
  manager_mail:  {type: String, required: true, match: /.+\@.+\..+/ },
  manager_name  :  {type: String, required: true},
  description : {type: String, }


}, { timestamps: true });




const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
