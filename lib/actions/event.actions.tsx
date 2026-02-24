'use server';

import Event from "@/database/event.model";
import connectDB from "../mongodb";

/**
 * Get all events sorted by creation date (newest first)
 */
export const getAllEvents = async () => {
  try {
    await connectDB();
    const events = await Event.find().sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    console.error("getAllEvents failed", error);
    return [];
  }
};

export const getSimilarEventsBySlug = async (slug: string) => {
  try {
    await connectDB();
    const event = await Event.findOne({ slug }).lean();

    if (!event) return [];

    const similarEvents = await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    }).lean().limit(3);

    // Convert non-serializable fields to plain strings
    return JSON.parse(JSON.stringify(similarEvents));

  } catch (error) {
    console.error("getSimilarEventsBySlug failed", error);
    return [];
  }
}