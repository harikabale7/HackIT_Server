// Import the necessary modules
import * as dao from "./dao.js";
import mongoose from "mongoose";

function EventRoutes(app) {
  const findAllEvents = async (req, res) => {
    try {
      const events = await dao.findAllEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const findOrganizerEvents = async (req, res) => {
    try {
      const organizerId = new mongoose.Types.ObjectId(req.params.organizerId);
      const events = await dao.findAllOrganizerEvents({ organizerId });
      res.json(events);
    } catch (err) {
      console.error("Error fetching organizer events:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  app.get("/api/events/organizer/:organizerId", findOrganizerEvents);
  

  const findEventById = async (req, res) => {
    try {
      const event = await dao.findEventById(req.params.eventId);
      // console.log("The events are", event);
      res.json(event);
    } catch (error) {
      console.error("Error fetching event details:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const createEvent = async (req, res) => {
    try {
      const event = await dao.createEvent(req.body);
      res.json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const getExternalEvents = async (request, response) => {
    try {
      const externalEventsDetails = await dao.getAllEvents();
      // console.log("externalEventsDetails", externalEventsDetails);
      response.json(externalEventsDetails);
    } catch (error) {
      console.log("error", error);
      res.status(500).send("Internal Server Error");
    }
  };

  const deleteEvents = async (req, res) => {
    try {
      const { eventId } = req.params;
      const status = await dao.deleteEvent(eventId);
      res.json(status);
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  app.delete("/api/:eventId/deleteEvent", deleteEvents);
  app.get("/api/getEvents", getExternalEvents);

  app.post("/api/events/create", createEvent);
  app.get("/api/events/:eventId", findEventById);

  

  // app.post("/api/events", createEvent);
  //app.get("/api/events/organizer/:organizerId", findAllOrganizerEvents);
  //app.post("/api/events", createEvent);
  app.get("/api/events", findAllEvents);

  const updateEvent = async (req, res) => {
    try{
      const { eventId } = req.params;
      const event = await dao.updateEvent(eventId, req.body);
      console.log("After update res: ", event);
      res.json(event);
    }
    catch(error){
      console.log("updateEvent error ", error);
      res.status(500).send("Internal Server Error");
    }

  }
  app.put("/api/events/:eventId/updateEvent", updateEvent);


  const deleteEvent = async (req, res) => {
    try{
      const { eventId } = req.params;
      const status = await dao.deleteEvent(eventId);
      console.log("deleteEvent ", status);
      res.json(status);
    }
    catch(error) {
      console.log("deleteEvent error ", error);
      res.status(500).send("Internal Server Error");
    }
  };
  app.delete("/api/events/:eventId/deleteEvent", deleteEvent);


}

export default EventRoutes;
