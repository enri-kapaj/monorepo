import { Document } from "mongoose";
export interface Station {
  locationX: string;
  locationY: string;
  id: string;
  name: string;
  standardname: string;
  //'@id': string;
}
export interface TripModel extends Document {
  name: string;
  stations: {
    locationX: string;
    locationY: string;
    name: string;
  }[];
  createdAt: Date;
}
