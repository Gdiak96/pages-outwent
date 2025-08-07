
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-110.7624, 43.4799],
    zoom: 7
});

fetch('itinerary.json')
    .then(response => response.json())
    .then(data => {
        const list = document.getElementById('itinerary-list');
        const coordinates = [];

        data.stops.forEach((stop, index) => {
            const li = document.createElement('li');
            li.textContent = `${stop.day}: ${stop.title}`;
            li.onclick = () => map.flyTo({ center: stop.coordinates, zoom: 10 });
            list.appendChild(li);

            // Create popup HTML with image
            const popupContent = `
                <div style="max-width:200px">
                    <strong>${stop.title}</strong><br/>
                    <p>${stop.description}</p>
                    ${stop.image ? `<img src="${stop.image}" alt="${stop.title}" style="width:100%; border-radius:4px;">` : ''}
                </div>
            `;

            new mapboxgl.Marker()
                .setLngLat(stop.coordinates)
                .setPopup(new mapboxgl.Popup().setHTML(popupContent))
                .addTo(map);

            coordinates.push(stop.coordinates);
        });

        // Draw the line connecting the stops
        map.on('load', () => {
            map.addSource('route', {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': coordinates
                    }
                }
            });

            map.addLayer({
                'id': 'route',
                'type': 'line',
                'source': 'route',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#888',
                    'line-width': 4
                }
            });
        });
    });
