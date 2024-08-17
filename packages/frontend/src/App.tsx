import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import TripList from "./screens/Trips";

function App() {
  return (
    <Router>
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/trips" element={<TripList />} />
          </Routes>
        </Container>
      </main>
    </Router>
  );
}

export default App;
