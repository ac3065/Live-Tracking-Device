console.log("Initializing map...");

// Initialize socket connection
const socket = io("https://192.168.8.165:3000");
// Ensure socket.io is initialized

// Initialize the map
const map = L.map("map").setView([0, 0], 10);
console.log("Map initialized:", map);

// Add tile layer to the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "OpenStreetMap",
}).addTo(map);
console.log("Tile layer added to map");

if (navigator.geolocation) {
  console.log("Geolocation is supported");

  navigator.geolocation.watchPosition(
    (position) => {
      console.log("Position retrieved:", position);
      const { latitude, longitude } = position.coords;

      // Send location to server via socket
      socket.emit("send-location", { latitude, longitude });

      // Update map view to user's current location
      map.setView([latitude, longitude], 13);

      // Add a marker for the user's location
      L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup("You are here")
        .openPopup();
    },
    (error) => {
      console.error("Error getting location:", error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
} else {
  console.error("Geolocation is not supported by this browser.");
}
