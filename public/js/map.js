
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: 'map',                      // HTML container ID
  center: listing.geometry.coordinates,                   // Center of the map (must be [lng, lat])
  zoom: 2,                                // Initial zoom level
});               // For debugging

const marker = new mapboxgl.Marker({color:"red"})
    // .setLngLat(coordinates)
    // .setPopup( new mapboxgl.Popup({offset:25})
    // .setHTML('<h1>Exact Location provided after booking </h1>'))  
    // .addTo(map);
