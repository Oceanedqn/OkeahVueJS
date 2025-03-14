<template>
    <div>
        <h1>Restaurants à proximité</h1>
        <div id="map" style="height: 600px;"></div>
    </div>
</template>

<script>
export default {
    props: ['onRestaurantsFound'],  // Prop pour envoyer les restaurants à la page parent

    mounted() {
        if (process.client) {
            this.loadMap();
        }
    },
    methods: {
        loadMap() {
            // Coordonnées de Nancy par défaut
            const nancyLat = 48.6921;
            const nancyLon = 6.1844;

            // Vérifier si la géolocalisation est disponible
            if (navigator.geolocation) {
                const options = {
                    enableHighAccuracy: true, // Demander une géolocalisation plus précise
                    timeout: 10000,           // Timeout après 10 secondes
                    maximumAge: 0             // Pas de cache de position (force une nouvelle géolocalisation à chaque fois)
                };

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const userLat = position.coords.latitude;
                        const userLon = position.coords.longitude;
                        const accuracy = position.coords.accuracy;

                        console.log(`Précision de la géolocalisation : ${accuracy} mètres`);

                        // Si la précision est faible, utiliser Nancy par défaut
                        if (accuracy > 100) {
                            alert("La précision de la géolocalisation est faible, direction Nancy.");
                            this.loadMapWithCoords(nancyLat, nancyLon); // Utiliser Nancy par défaut
                        } else {
                            this.loadMapWithCoords(userLat, userLon); // Utiliser la géolocalisation
                        }
                    },
                    (error) => {
                        console.error("Erreur de géolocalisation: ", error);
                        this.loadMapWithCoords(nancyLat, nancyLon); // Charger Nancy en cas d'erreur
                    },
                    options
                );
            } else {
                console.error("La géolocalisation n'est pas supportée par ce navigateur.");
                this.loadMapWithCoords(nancyLat, nancyLon); // Charger Nancy par défaut
            }
        },

        // Charger la carte avec des coordonnées spécifiques (Nancy par défaut)
        loadMapWithCoords(lat, lon) {
            import('leaflet').then(L => {
                const map = L.map('map').setView([lat, lon], 13);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                // Marquer la position de l'utilisateur (ou Nancy)
                L.marker([lat, lon]).addTo(map).bindPopup('Votre position').openPopup();

                // Récupérer les restaurants autour de cette position
                this.getRestaurants(map, lat, lon);
            });
        },

        // Récupère les restaurants via Overpass API
        async getRestaurants(map, lat, lon) {
            const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];(node["amenity"="restaurant"](around:5000,${lat},${lon}););out;`;

            try {
                const response = await fetch(overpassUrl);
                const data = await response.json();
                const restaurants = data.elements;

                // Ajouter des marqueurs pour chaque restaurant sur la carte
                restaurants.forEach(restaurant => {
                    const { lat, lon, tags } = restaurant;
                    const name = tags.name || "Restaurant sans nom";
                    const address = tags.addr || "Adresse inconnue";

                    // Ajouter à la liste des restaurants
                    if (this.onRestaurantsFound) {
                        this.onRestaurantsFound(restaurants);
                    }

                    L.marker([lat, lon])
                        .addTo(map)
                        .bindPopup(`<b>${name}</b><br>${address}`);
                });
            } catch (error) {
                console.error("Erreur lors de la récupération des restaurants : ", error);
            }
        }
    }
}
</script>

<style scoped>
#map {
    width: 100%;
    height: 100%;
}
</style>