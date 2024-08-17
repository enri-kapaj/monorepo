import { Request, Response } from "express";
import stationsData from "../stations.json";
import { Station } from "../interfaces/generalInterfaces";
import { haversineDistance } from "../utils/helperFunctions";
const stations: Station[] = stationsData.station;
export const searchStations = (req: Request, res: Response): void => {
  const { currentLocationX, currentLocationY, search } = req.query;

  if (!currentLocationX || !currentLocationY) {
    res.status(400).json({ error: "Current location is required" });
    return;
  }

  const currentX = parseFloat(currentLocationX as string);
  const currentY = parseFloat(currentLocationY as string);
  const searchTerm = (search as string)?.toLowerCase() || "";

  // Calculate distances from the current location
  const stationsWithDistance = stations.map((station) => {
    const distance = haversineDistance(
      currentY,
      currentX,
      parseFloat(station.locationY as string),
      parseFloat(station.locationX as string)
    );
    return { ...station, distance };
  });

  // Sort by distance
  const sortedStations = stationsWithDistance.sort(
    (a, b) => a.distance - b.distance
  );

  // Filter by search term
  const filteredStations = searchTerm
    ? sortedStations.filter((station) =>
        station.name.toLowerCase().includes(searchTerm)
      )
    : sortedStations;

  res.json(filteredStations);
};
