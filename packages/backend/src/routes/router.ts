import { Router } from "express";
import { searchStations } from "../controllers/searchStationController";
import {
  createTrip,
  getAllTrips,
  getTripByName,
} from "../controllers/tripsControllers";

const router = Router();
router.get("/stations", searchStations);
router.get("/get-trips", getAllTrips);
router.get("/get-trips/:tripName", getTripByName);
router.post("/create-new-trip", createTrip);
export default router;
