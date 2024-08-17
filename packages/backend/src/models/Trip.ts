import mongoose, { Schema } from 'mongoose';
import { TripModel } from '../interfaces/generalInterfaces';

// Define the schema for a Trip
const tripSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    stations: [
        {
            locationX: {
                type: String, 
                required: true
            },
            locationY: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the model
const Trip = mongoose.model<TripModel>('Trip', tripSchema);



export default Trip;
