const showLoading = () => {
  const loading = document.querySelector("#loadingIndicator");
  if (loading) loading.style.display = "block";
};

const hideLoading = () => {
  const loading = document.querySelector("#loadingIndicator");
  if (loading) loading.style.display = "none";
};

const showAlert = (message) => {
  alert(message);
};

const navigateToHome = () => {
  window.location.hash = "#/";
};

const renderMap = async () => {
  const mapDiv = document.getElementById("map");
  if (!mapDiv) return;

  const defaultCoords = { lat: -7.9523, lng: 112.614 };

  const map = L.map("map").setView([defaultCoords.lat, defaultCoords.lng], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  let marker = null;

  // 🔽 Gunakan icon kustom di sini
  const storyIcon = L.icon({
    iconUrl: "images/location.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const updateLatLonInputs = (lat, lon) => {
    const latInput = document.querySelector("#lat");
    const lonInput = document.querySelector("#lon");
    if (latInput && lonInput) {
      latInput.value = lat;
      lonInput.value = lon;
    }
  };

  map.on("click", function (e) {
    const { lat, lng } = e.latlng;

    if (marker) {
      marker.setLatLng([lat, lng]);
    } else {
      marker = L.marker([lat, lng], { icon: storyIcon }).addTo(map);
    }

    updateLatLonInputs(lat, lng);
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      map.setView([latitude, longitude], 15);

      // 🔽 Tambahkan marker awal dengan icon kustom
      marker = L.marker([latitude, longitude], { icon: storyIcon }).addTo(map);
      updateLatLonInputs(latitude, longitude);
    });
  }
};


export { showLoading, hideLoading, showAlert, navigateToHome, renderMap };
