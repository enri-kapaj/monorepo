import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Snackbar,
  Alert,
  Modal,
  Button,
} from "@mui/material";
import Navigation from "../components/Navigation";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";

interface Station {
  locationX: string;
  locationY: string;
  name: string;
  _id: string;
}

interface Trip {
  _id: string;
  name: string;
  stations: Station[];
  createdAt: string;
}

const TripList: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get("http://localhost:8081/get-trips");
        setTrips(response.data);
      } catch (err) {
        setError("Failed to fetch trips.");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleOpenModal = async (tripName: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/get-trips/${tripName}`
      );
      setSelectedTrip(response.data);
      setOpenModal(true);
    } catch (err) {
      setSnackbarMessage("Failed to fetch trip details.");
      setOpenSnackbar(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTrip(null);
  };

  const renderContent = () => {
    if (loading) {
      return <Typography>Loading...</Typography>;
    }

    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Created At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trips.map((trip) => (
            <TableRow
              key={trip.name}
              onClick={() => handleOpenModal(trip.name)}
              style={{ cursor: "pointer" }}
            >
              <TableCell>{trip._id}</TableCell>
              <TableCell>{trip.name}</TableCell>
              <TableCell>{new Date(trip.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div>
      <Navigation />
      <Paper style={{ padding: 20 }}>
        <Typography variant="h4" gutterBottom>
          My Trips
        </Typography>
        {renderContent()}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="error">
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <Modal open={openModal} onClose={handleCloseModal}>
          <Paper
            style={{
              padding: 20,
              margin: "auto",
              marginTop: "5%",
              maxWidth: "90%",
              maxHeight: "90%",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h5">Trip Details</Typography>
            {selectedTrip ? (
              <>
                <Typography variant="h6">Name: {selectedTrip.name}</Typography>
                <Typography variant="h6">Stations:</Typography>
                <MapContainer
                  center={[parseFloat(selectedTrip.stations[0].locationX), parseFloat(selectedTrip.stations[0].locationY)]} // Ensure this is a valid center point
                  zoom={10}
                  scrollWheelZoom={true}
                  style={{ height: "400px", width: "100%" }} // Ensure height is set
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {selectedTrip.stations.map((station) => (
                    <Marker
                      key={station._id}
                      position={[
                        parseFloat(station.locationX),
                        parseFloat(station.locationY),
                      ]}
                    >
                      <Popup>{station.name}</Popup>
                    </Marker>
                  ))}
                {selectedTrip.stations.length > 1 && (
                    <Polyline
                      positions={selectedTrip.stations.map((station) => [
                        parseFloat(station.locationX),
                        parseFloat(station.locationY),
                      ])}
                      color="red"
                      weight={3}
                      dashArray="5,10"
                    />
                  )}
                </MapContainer>
              </>
            ) : (
              <Typography>No trip details available.</Typography>
            )}
            <Button
              onClick={handleCloseModal}
              variant="contained"
              color="primary"
              style={{ marginTop: 20 }}
            >
              Close
            </Button>
          </Paper>
        </Modal>
      </Paper>
    </div>
  );
};

export default TripList;
