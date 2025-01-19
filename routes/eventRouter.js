require('dotenv').config();


const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

const express = require("express");
const Event = require("../models/eventSchema");
const User = require("../models/UserSchema");

const sendNotification = require("../messager/SendNotifcs");

const eventRouter = express.Router();

const { v4: uuidv4 } = require("uuid");

const randomEventId = uuidv4();

const secretKey =`${process.env.JWT_SECRET}`; 

eventRouter.get("/verify-jwt", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Token not provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) res.status(401).send({ message: "Token not found" });
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err);
      return res.status(401).send({ message: "Invalid Token", err });
    } else {
      return res.status(200).send(decoded);
    }
  });
});

eventRouter.get("/all", async (req, res) => {
  try {
    const { email } = req.query;

    const organisedEvents = await Event.find({ manager_mail: email });
    const participatedEvents = await Event.find({ participants: email });

    // console.log(organisedEvents);

    res.status(200).json({
      organisedEvents: organisedEvents,
      participatedEvents: participatedEvents,
    });
  } catch (error) {
    return res.status(401).send({ message: "Some error happened", error });
  }
});

eventRouter.post("/", async (req, res) => {
  const {
    manager_mail,
    dateTime,
    location,
    participants,
    manager_name,
    description,
    event_name,
  } = req.body;
  // console.log(req.body);
  if (
    manager_mail &&
    manager_name &&
    location &&
    participants &&
    description &&
    dateTime &&
    event_name
  ) {
    try {
      await Event.create({
        event_name,
        manager_mail,
        dateTime,
        location,
        participants,
        manager_name,
        description,
        eventId: randomEventId,
      });
      //sending notfic

      participants.forEach((mail) => {
        // sendNotification( manager_name,mail,`Event Invitation`, `You've been invited for a new Event
        //    :${event_name}. organizer: ${manager_mail} `)
        sendNotification(manager_name, mail, 'Event Invitation', `You've been invited for a new Event, ${event_name}. organizer: ${manager_mail} `)
          .then(() => {
            console.log("Notification sent successfully.");
          })
          .catch((error) => {
            console.error("Error sending notification:", error);
          });
      });

      res.status(201).json({ message: "Event Created Successfully" });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Error Creating Event", error });
    }
  } else {
    res.status(400).json({ message: "Event Fields are Invalid" });
  }
});

eventRouter.delete("/", async (req, res) => {
  const { manager_mail, eventId } = req.query;

  if (manager_mail && eventId) {
    try {
      const deletedOne = await Event.findOne({ eventId: eventId });

      if (!deletedOne)
        res
          .status(404)
          .json({
            message: "Error Deleting Event : Event Didnt Found",
            eventId,
          });

      if (deletedOne.manager_mail == manager_mail) {
        await Event.deleteOne({ eventId: eventId });


        deletedOne.participants.forEach((mail) => {
          // sendNotification( manager_name,mail,`Event Invitation`, `You've been invited for a new Event
          //    :${event_name}. organizer: ${manager_mail} `)
          sendNotification(deletedOne.manager_name, mail, 'Event Cancelled', `The ${deletedOne.event_name} Event has been called off. organizer: ${manager_mail} `)
            .then(() => {
              console.log("Notification sent successfully.");
            })
            .catch((error) => {
              console.error("Error sending notification:", error);
            });
        });

        res.status(201).json({ message: "Event Deleted Successfully" });
      } else {
        res.status(401).json({
          message: "Error Deleting Event : You don'\t have access",
          manager_mail,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Error Deleting Event", error });
    }
  } else {
    res.status(404).json({ message: "Event Fields are Invalid" });
  }
});

eventRouter.put("/", async (req, res) => {
  const {
    manager_mail,
    dateTime,
    location,
    participants,
    description,
    eventId,
    event_name,
  } = req.body;

  if (manager_mail && eventId) {
    try {
      const event_idd = eventId + "";
      const existsOne = await Event.findOne({ eventId: `${eventId}` });

      if (!existsOne)
        return res
          .status(400)
          .json({
            message: "Error Updating Event : Event Didnt Found",
            eventId,
          });

      if (existsOne.manager_mail == manager_mail) {
        await Event.updateOne(
          { eventId: eventId },
          {
            $set: {
              location: location || existsOne.location,
              description: description || existsOne.description,
              participants: participants || existsOne.participants,
              dateTime: dateTime || existsOne.dateTime,
              event_name: event_name || existsOne.event_name,
            },
          }
        );

        existsOne.participants.forEach((mail) => {
          // sendNotification( manager_name,mail,`Event Invitation`, `You've been invited for a new Event
          //    :${event_name}. organizer: ${manager_mail} `)
          sendNotification(existsOne.manager_name, mail, 'Event Updation', `The ${existsOne.event_name} Event Details has been changed. organizer: ${manager_mail} `)
            .then(() => {
              console.log("Notification sent successfully.");
            })
            .catch((error) => {
              console.error("Error sending notification:", error);
            });
        });

        res.status(201).json({ message: "Event updated Successfully" });
      } else {
        res.status(400).json({
          message: "Error Updating Event : You don't have access",
          manager_mail,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Error Updating Event", error });
    }
  } else {
    res.status(400).json({ message: "Event Fields are Invalid" });
  }
});

eventRouter.get("/:id", async (req, res) => {
  const eventId = req.params.id;

  if (eventId) {
    try {
      const existsOne = await Event.findOne({ eventId: eventId });

      if (!existsOne)
        return res.status(400).json({
          message: "Error Retreiving Event : Event Didn'\t Found",
          eventId,
        });

      res.status(200).send(existsOne);
      return;
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Error Fetching Event", error });
    }
  } else {
    res.status(400).json({ message: "Event Fields are Invalid" });
  }
});

eventRouter.put("/opt-out", async (req, res) => {
  const { eventId, manager_mail } = req.body;

  if (eventId) {
    try {
      const existsOne = await Event.findOne({ eventId: eventId });

      if (!existsOne)
        return res.status(404).json({
          message: "Error Retreiving Event : Event Didn'\t Found",
          eventId,
        });

      if (!existsOne.participants.includes(manager_mail)) {
        return res.status(400).json({
          message: "You are not associated in that event",
        });
      }

      await Event.updateOne(
        { eventId: eventId },
        {
          $pull: { participants: manager_mail },
        }
      );
      
      sendNotification(manager_mail, existsOne.manager_mail, 'Participant Left', `From the ${existsOne.event_name}, ${manager_mail} has been left. `)
      .then(() => {
        console.log("Notification sent successfully.");
      })
      .catch((error) => {
        console.error("Error sending notification:", error);
      });


      res.status(201).json({ message: "Event Opted out Successfully" });

      return;
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Error Fetching Event", error });
    }
  } else {
    res.status(400).json({ message: "Event Fields are Invalid" });
  }
});

module.exports = { eventRouter };
