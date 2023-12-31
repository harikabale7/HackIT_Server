import { model } from "./model.js"
import { userModel } from "./model.js";
import eventsModel from "../events/model.js";

export const createEvent = (event) => model.create(event);
export const findAllEvents = () => model.find();
export const findUserById = (userId) => userModel.findById(userId);
export const findEventById = async (eventId, userId) => {
  const userEvent = await model.findOne({ eventId, userId });
  return userEvent;
};
export const isUserRegisteredForEvent = async (userId, eventId) => {
  const count = await model.countDocuments({ userId, eventId });
  return count > 0;
};

export const getUserRegistrationStatus = async (userId, eventId) => {
  const userEvent = await model.findOne({ userId, eventId });
  return userEvent ? userEvent.registered : false;
};

export const getBookmarkedStatus = async (userId, eventId) => {
  const userEvent = await model.findOne({ userId, eventId });
  return userEvent ? userEvent.bookmarked : false;
};

export const deRegisterForEvent = async (userId, eventId) => {
  const response = await model.findOneAndUpdate(
    { eventId, userId },
    { $set: { registered: false } },
    { new: true }
  );
  return response.registered;
}

export const registerUserForEvent = async (userId, eventId) => {
  try {
    const isRegistered = await isUserRegisteredForEvent(userId, eventId);

    if (!isRegistered) {
      await model.create({
        userId,
        eventId,
        registered: true,
        bookmarked: false,
      });
    }
    else {
      await model.findOneAndUpdate(
        { eventId, userId },
        { $set: { registered: true } },
        { new: true }
      );
    }
    const isRegisteredLater = await isUserRegisteredForEvent(userId, eventId);
    return isRegisteredLater;
  } catch (error) {
    console.error('Error registering user for event:', error);
    throw error;
  }
};

export const bookmarkEvent = async (userId, eventId) => {
  try {
    const isBookmarked = await isUserRegisteredForEvent(userId, eventId);

    if (!isBookmarked) {
      await model.create({
        userId,
        eventId,
        registered: false,
        bookmarked: true,
      });
    }
    else {
      await model.findOneAndUpdate(
        { eventId, userId },
        { $set: { bookmarked: true } },
        { new: true }
      );
    }
    const isBookmarkedLater = await getBookmarkedStatus(userId, eventId);
    return isBookmarkedLater;
  } catch (error) {
    console.error('Error bookmarking user for event:', error);
    throw error;
  }
};

export const deBookmarkEvent = async (userId, eventId) => {
  const response = await model.findOneAndUpdate(
    { eventId, userId },
    { $set: { bookmarked: false } },
    { new: true }
  );
  return response.bookmarked;


 
}

 export const getEventsRegisteredByUser = async (userId) => {
    // console.log(userId);
    const eventsRegisteredByUser = await model.find({ userId });
    // Extract eventIds from userEvents
    const eventIds = eventsRegisteredByUser.map((userEvent) => userEvent.eventId);
    // Fetch event details based on eventIds from the "Events" collection
    const eventDetails = await eventsModel.find({ _id: { $in: eventIds } });

    // Combine event details with user events
    const combinedEvents = eventsRegisteredByUser.map((userEvent) => {
      const eventDetail = eventDetails.find((event) => event._id.toString() === userEvent.eventId.toString());
      return {
        ...userEvent.toObject(),
        eventDetail: eventDetail || null,
      };
    });

    // console.log(combinedEvents);

    return combinedEvents;
  }

  export const updateRatings = async (userId, eventId, rating) => {
    console.log("Ratinggggg", rating);
    try {
      const isregistered = await isUserRegisteredForEvent(userId, eventId);
  
      if (!isregistered) {
        await model.create({
          userId,
          eventId,
          registered: false,
          bookmarked: false,
          userRating: rating,
        });
      }
      else {
        await model.findOneAndUpdate(
          { eventId, userId },
          { $set: { userRating: rating } },
          { new: true }
        );
      }
      const userratinglater = await getUserRating(userId, eventId);
      console.log("user rating in dao",userratinglater);
      return userratinglater;
    } catch (error) {
      console.error('Error bookmarking user for event:', error);
      throw error;
    }
    
  };

  export const getUserRating = async (userId, eventId) => {
    const userRating = await model.findOne({ userId, eventId });
    return userRating ? userRating.userRating : '';
  };

  export const getOverallRating = async (eventId) => {
    const eventsWithSameId = await model.find({ eventId });
    
    if (eventsWithSameId.length === 0) {
      return 0; // No events with the specified eventId
    }
  
    const ratedEvents = eventsWithSameId.filter((event) => event.userRating > 0);
  
    if (ratedEvents.length === 0) {
      return 0; // No rated events
    }
  
    const totalRating = ratedEvents.reduce((sum, event) => sum + event.userRating, 0);
    const overallRating = totalRating / ratedEvents.length;
  
    return overallRating;
  };






