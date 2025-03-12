<template>
    <div>
        <!-- Icône de sélection du thème -->
        <button @click="openModal" class="text-2xl">
            <i class="fas fa-palette text-primary cursor-pointer hover:text-primary-light"></i>
        </button>

        <!-- Modal d'options de thèmes -->
        <div v-if="isModalOpen" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <!-- Contenu du modal -->
            <div class="bg-white p-6 rounded-lg relative z-60 w-11/12 sm:w-1/2 md:w-1/3 lg:w-1/4">
                <!-- Icône de fermeture en haut à droite -->
                <button @click="closeModal" class="absolute top-2 right-3 text-2xl text-gray-600 hover:text-primary">
                    <i class="fas fa-times cursor-pointer"></i>
                </button>

                <h2 class="text-lg font-bold mb-4 text-dark-text">Choisir un thème</h2>

                <!-- Liste des thèmes avec icônes -->
                <div class="grid grid-cols-3 gap-4">
                    <div v-for="theme in themes" :key="theme.name" @click="selectTheme(theme.className)"
                        class="cursor-pointer text-center p-2 rounded-lg">
                        <i :class="theme.icon + ' text-xl text-secondary hover:text-secondary-light'"></i>
                        <p class="text-text">{{ theme.name }}</p>
                    </div>
                </div>

                <button @click="closeModal"
                    class="mt-4 p-2 rounded-full w-full bg-primary cursor-pointer">Fermer</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const selectedTheme = ref('vintage-theme');
const isModalOpen = ref(false);

const themes = ref([
    { name: "Vintage", className: "vintage-theme", icon: "fas fa-cogs" },
    { name: "Plexiglas Orange", className: "plexiglas-orange-theme", icon: "fas fa-fire" },
    { name: "Futuriste", className: "futurist-theme", icon: "fas fa-rocket" },
    { name: "Noël", className: "christmas-theme", icon: "fas fa-tree" },
    { name: "Animal Crossing", className: "animal-crossing-theme", icon: "fas fa-paw" },
    { name: "Candy", className: "candy-theme", icon: "fas fa-candy-cane" },
    { name: "Années 60", className: "sixties-theme", icon: "fas fa-guitar" },
]);

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};

const selectTheme = (theme) => {
    selectedTheme.value = theme;
    changeTheme(theme);
    closeModal();
};

const changeTheme = (theme) => {
    // Supprime toutes les anciennes classes de thème
    document.body.className = document.body.className
        .split(' ')
        .filter(c => !c.endsWith('-theme'))
        .join(' ');

    // Ajoute la nouvelle classe de thème
    document.body.classList.add(theme);

    // Sauvegarde le thème dans le localStorage pour persistance
    localStorage.setItem('theme', theme);
};

// Appliquer le thème sauvegardé au chargement de la page
onMounted(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        selectedTheme.value = savedTheme;
        changeTheme(savedTheme);
    }
});
</script>

<style scoped>
/* Ajoute du z-index pour s'assurer que le fond et le modal apparaissent correctement */

.fixed {
    z-index: 50;
    /* Fond semi-transparent */
    background-color: rgba(0, 0, 0, 0.5);
    /* Ajout d'une couleur avec transparence */
}

.relative {
    z-index: 60;
    /* Contenu du modal */
}

/* Correction : Fond du modal avec opacité */
.bg-white {
    background-color: white;
    /* Ou bien un fond semi-transparent si tu préfères */
}
</style>