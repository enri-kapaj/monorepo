import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Pagination,
} from "@mui/material";
import { Container } from "react-bootstrap";
import Navigation from "../components/Navigation";

interface Station {
  locationX: string;
  locationY: string;
  id: string;
  name: string;
  standardname: string;
}

const HomeScreen: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [bookedStations, setBookedStations] = useState<Station[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentLocation, setCurrentLocation] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [stationsPerPage] = useState<number>(10);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] =
    useState<boolean>(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [tripName, setTripName] = useState<string>("");

  useEffect(() => {
    if (currentLocation) {
      fetchStations();
    }
  }, [currentLocation, searchTerm, currentPage]);

  const fetchStations = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:8081/stations", {
        params: {
          currentLocationX: currentLocation?.x,
          currentLocationY: currentLocation?.y,
          search: searchTerm,
        },
      });
      setStations(response.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch stations.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  const handleLocationSuccess = (position: GeolocationPosition) => {
    setCurrentLocation({
      x: position.coords.longitude,
      y: position.coords.latitude,
    });
  };

  const handleLocationError = (error: GeolocationPositionError) => {
    setError("Failed to get current location.");
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        handleLocationSuccess,
        handleLocationError
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Pagination logic
  const indexOfLastStation = currentPage * stationsPerPage;
  const indexOfFirstStation = indexOfLastStation - stationsPerPage;
  const currentStations = stations.slice(
    indexOfFirstStation,
    indexOfLastStation
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  const pageCount = Math.ceil(stations.length / stationsPerPage);

  const handleAddStation = (station: Station) => {
    setBookedStations((prev) => {
      return [...prev, station];
    });
    setSnackbarMessage(`Station ${station.name} added successfully!`);
    setOpenSuccessSnackbar(true);
    setOpenErrorSnackbar(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSuccessSnackbar(false);
    setOpenErrorSnackbar(false);
  };

  // Function to save the trip
  const handleSaveTrip = async () => {
    if (!tripName) {
      setSnackbarMessage("Trip name is required.");
      setOpenErrorSnackbar(true);
      return;
    }

    const tripData = {
      stations: bookedStations,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:8081/create-new-trip?tripName=${tripName}`,
        tripData
      );
      setSnackbarMessage("Trip saved successfully!");
      setOpenSuccessSnackbar(true);
      setBookedStations([]);
      setLoading(false);
    } catch (error) {
      setSnackbarMessage("Failed to save trip.");
      setOpenErrorSnackbar(true);
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Navigation />
      <Container>
        <h2>My Trip</h2>

        <TextField
          label="Trip Name"
          variant="outlined"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
          required
          style={{ marginTop: 20 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveTrip}
          style={{ marginTop: 20 }}
        >
          Save Trip
        </Button>

        {/* New Table for Stored Stations */}
        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper} style={{ marginTop: 20 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Location X</TableCell>
                  <TableCell>Location Y</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookedStations.length > 0 ? (
                  bookedStations.map((station: Station, index) => (
                    <TableRow key={station.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{station.id}</TableCell>
                      <TableCell>{station.name}</TableCell>
                      <TableCell>{station.locationX}</TableCell>
                      <TableCell>{station.locationY}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4}>No stored stations found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
      <h1>Station List</h1>
      {openSuccessSnackbar && (
        <Snackbar
          open={openSuccessSnackbar}
          autoHideDuration={1000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      )}

      {openErrorSnackbar && (
        <Snackbar
          open={openErrorSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="error">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      )}
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: 20 }}
      />
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Location X</TableCell>
                  <TableCell>Location Y</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stations.length > 0 ? (
                  currentStations.map((station) => (
                    <TableRow key={station.id}>
                      <TableCell>{station.id}</TableCell>
                      <TableCell>{station.name}</TableCell>
                      <TableCell>{station.locationX}</TableCell>
                      <TableCell>{station.locationY}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleAddStation(station)}
                        >
                          Add
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5}>No stations found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            style={{ marginTop: 20 }}
          />
        </>
      )}
    </div>
  );
};

export default HomeScreen;
