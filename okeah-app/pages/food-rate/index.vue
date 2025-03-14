<template>
    <div>
        <h1>Food Rate</h1>
        <Map :onRestaurantsFound="handleRestaurantsFound" />

        <!-- Champ de recherche -->
        <input v-model="searchQuery" type="text" placeholder="Rechercher un restaurant..." class="border p-2" />

        <!-- Liste des restaurants filtrée -->
        <div v-if="filteredRestaurants.length > 0">
            <ul>
                <li v-for="(restaurant, index) in filteredRestaurants" :key="index">
                    <p><strong>{{ restaurant.name }}</strong></p>
                    <p>{{ restaurant.cuisine }} - {{ restaurant.location }}</p>
                </li>
            </ul>
        </div>
        <div v-else>
            <p>Aucun restaurant trouvé</p>
        </div>
    </div>
</template>

<script>
import Map from '~/components/Map.vue';

export default {
    components: {
        Map
    },
    data() {
        return {
            restaurants: [], // Liste des restaurants récupérés dynamiquement
            searchQuery: "", // Contient le texte de recherche
        };
    },
    computed: {
        // Calcul dynamique des restaurants filtrés en fonction du texte saisi
        filteredRestaurants() {
            return this.restaurants.filter((restaurant) => {
                const query = this.searchQuery.toLowerCase();
                return (
                    restaurant.name.toLowerCase().includes(query) ||
                    restaurant.cuisine.toLowerCase().includes(query) ||
                    restaurant.location.toLowerCase().includes(query)
                );
            });
        },
    },
    methods: {
        // Fonction pour récupérer la liste des restaurants depuis Map.vue
        handleRestaurantsFound(restaurants) {
            this.restaurants = restaurants.map((restaurant) => {
                const { tags } = restaurant;
                const name = tags.name || "Restaurant sans nom";
                const location = tags.addr || "Adresse inconnue";
                const cuisine = tags.cuisine || "Cuisine inconnue";

                return { name, location, cuisine };
            });
        },

        // Charger la carte avec des coordonnées spécifiques
        loadMapWithCoords(lat, lon) {
            import('leaflet').then(L => {
                const map = L.map('map').setView([lat, lon], 13);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                L.marker([lat, lon]).addTo(map).bindPopup('Lieu recherché').openPopup();

                this.getRestaurants(map, lat, lon); // Rechercher les restaurants autour de ces coordonnées
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

                    L.marker([lat, lon])
                        .addTo(map)
                        .bindPopup(`<b>${name}</b><br>${address}`);
                });

                // Mettre à jour la liste des restaurants
                this.handleRestaurantsFound(restaurants);

            } catch (error) {
                console.error("Erreur lors de la récupération des restaurants : ", error);
            }
        }
    }
}
</script>

<style scoped>
/* Ajout de styles pour l'input et la liste */
input {
    width: 100%;
    margin-bottom: 20px;
}

ul {
    list-style-type: none;
    padding-left: 0;
}

li {
    margin-bottom: 15px;
}
</style>
