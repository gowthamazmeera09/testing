import React, { useEffect, useState } from "react";

const API_URL = "https://your-backend-url.com/api/workers"; // Replace with your actual API URL
const RADIUS = 15; // Radius in kilometers

// Haversine formula to calculate the distance between two coordinates
function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function WorkersList({ role }) {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  // Fetch user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("Please enable location services for accurate results.");
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // Fetch worker data from API
  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setWorkers(data.workers);
        } else {
          console.error("Failed to fetch workers from API");
        }
      })
      .catch((error) => console.error("Error fetching workers:", error));
  }, []);

  // Filter workers based on user's location
  useEffect(() => {
    if (userLocation && workers.length > 0) {
      const nearbyWorkers = workers.filter((worker) => {
        const workerLocation = worker.location.coordinates; // Ensure this is [longitude, latitude]
        const distance = haversineDistance(
          userLocation.lat,
          userLocation.lon,
          workerLocation[1], // Latitude
          workerLocation[0] // Longitude
        );
        return distance <= RADIUS;
      });
      setFilteredWorkers(nearbyWorkers);
    }
  }, [userLocation, workers]);

  return (
    <div>
      <h2>Workers for role: {role}</h2>
      {userLocation ? (
        <>
          <p>
            Your Location: Lat {userLocation.lat}, Lon {userLocation.lon}
          </p>
          {filteredWorkers.length > 0 ? (
            filteredWorkers.map((worker) => (
              <div key={worker._id} style={{ border: "1px solid #ccc", padding: "10px" }}>
                <h3>{worker.username}</h3>
                <p>Email: {worker.email}</p>
                <p>Phone: {worker.phonenumber}</p>
                <p>Experience: {worker.addwork[0].experience} years</p>
                {worker.addwork[0].photos.map((photo, index) => (
                  <img key={index} src={photo} alt="work" width="100" />
                ))}
              </div>
            ))
          ) : (
            <p>No workers found within your area.</p>
          )}
        </>
      ) : (
        <p>Loading your location...</p>
      )}
    </div>
  );
}

export default WorkersList;
