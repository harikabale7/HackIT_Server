// Import the necessary modules
import * as dao from "./dao.js";

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

//   const findAllOrganizerEvents = async (req, res) => {
//     try {
//       const allEvents = await dao.findAllEvents();
//       console.log("000003", req.params.organizerId);
//       console.log("777", allEvents);
  
//       // Filter events based on organizerid
//       const filteredEvents = allEvents.filter(event => {
//         console.log("HHHHIIIIIII",typeof event.organizerId, typeof req.params.organizerId);
//         //const extractedId = objectId.toString();

// //console.log(extractedId);
// console.log("AAAAA",event._id);
//         console.log("BBBBB",event.organizerId);
//         return event.organizerId === req.params.organizerId;
//       });
  
//       console.log("444", filteredEvents);
//       res.json(filteredEvents);
//     } catch (error) {
//       console.error("Error fetching events:", error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   };
  
  const findOrganizerEvents = async (req,res) => {
    console.log("came in",req.params.organizerId);
    try{
  const events = dao.findAllOrganizerEvents({organizerId:req.params.organizerId});
  console.log("Organizer events",events);
  res.json(events);
    }
    catch(err){
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  app.get("/api/events/organizer/:organizerId",findOrganizerEvents);
  

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
      console.log("externalEventsDetails",externalEventsDetails);
      response.json(externalEventsDetails);
    } catch (error) {
      console.log("error",error);
      res.status(500).send("Internal Server Error");
    }
  };
  app.get("/api/getEvents", getExternalEvents);

  app.post("/api/events", createEvent);
  app.get("/api/events/:eventId", findEventById);
  //app.get("/api/events/organizer/:organizerId", findAllOrganizerEvents);
  app.post("/api/events", createEvent);
  app.get("/api/events", findAllEvents);
}

export default EventRoutes;
