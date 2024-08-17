import { Request, Response } from "express";
import Trip from "../models/Trip";

// Controller to create a new trip
export const createTrip = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tripName } = req.query;
    const { stations } = req.body;

    if (
      !tripName ||
      typeof tripName !== "string" ||
      tripName.trim().length === 0
    ) {
      res.status(400).json({ error: "Please provide a name for the trip" });
      return;
    }

    // Validate stations
    if (!Array.isArray(stations) || stations.length === 0) {
      res
        .status(400)
        .json({ error: "At least one station should be selected" });
      return;
    }

    // Create a new trip
    const newTrip = new Trip({
      name: tripName,
      stations,
    });

    await newTrip.save();

    res.status(201).json(newTrip);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the trip." });
  }
};

// Controller to get all trips
export const getAllTrips = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const trips = await Trip.find();

    res.status(200).json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching trips." });
  }
};

export const getTripByName = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tripName } = req.params;
console.log("tripname",tripName)
    if (
      !tripName ||
      typeof tripName !== "string" ||
      tripName.trim().length === 0
    ) {
      res
        .status(400)
        .json({
          error: "Invalid trip name. Trip name must be a non-empty string.",
        });
      return;
    }

    const trip = await Trip.findOne({ name: tripName});


    if (!trip) {
      res.status(404).json({ error: "Trip not found." });
      return;
    }

    res.status(200).json(trip);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the trip." });
  }
};
