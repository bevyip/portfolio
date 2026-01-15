import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import pfp1 from "./assets/img/pfp1.png";
import pfp2 from "./assets/img/pfp2.png";
import pfp3 from "./assets/img/pfp3.png";
import pfp4 from "./assets/img/pfp4.png";
import pfp5 from "./assets/img/pfp5.png";

// Array of logo images matching Nav component
const logoImages = [pfp1, pfp2, pfp3, pfp4, pfp5];

// Function to update favicon based on logo index
const updateFavicon = () => {
  const savedIndex = localStorage.getItem("navLogoIndex");
  const logoIndex = savedIndex ? parseInt(savedIndex, 10) : 0;
  const logoImage = logoImages[logoIndex] || logoImages[0];

  let link = document.querySelector("link[rel~='icon']");
  if (link) {
    link.href = logoImage;
  } else {
    const newLink = document.createElement("link");
    newLink.rel = "icon";
    newLink.type = "image/png";
    newLink.href = logoImage;
    document.getElementsByTagName("head")[0].appendChild(newLink);
  }
};

// Set initial favicon
updateFavicon();

// Listen for logo changes from Nav component
window.addEventListener("logoChanged", updateFavicon);

// Also listen for storage events (in case logo changes in another tab)
window.addEventListener("storage", (e) => {
  if (e.key === "navLogoIndex") {
    updateFavicon();
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
