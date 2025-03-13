<template>
    <div>
        <!-- Icône de sélection de la langue -->
        <button @click="openModal" class="text-2xl">
            <i class="fas fa-language text-primary cursor-pointer hover:text-primary-light"></i>
        </button>

        <!-- Modal de sélection de langue -->
        <div v-if="isModalOpen" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div class="bg-white p-6 rounded-lg relative z-50 w-11/12 sm:w-1/2 md:w-1/3 lg:w-1/4">
                <!-- Icône de fermeture en haut à droite -->
                <button @click="closeModal" class="absolute top-2 right-3 text-2xl text-gray-600 hover:text-primary">
                    <i class="fas fa-times cursor-pointer"></i>
                </button>

                <h2 class="text-lg font-bold mb-4 text-title-text">{{ $t('change_language') }}</h2>

                <!-- Liste des langues -->
                <div class="grid grid-cols-2 gap-4">
                    <div v-for="lang in languages" :key="lang.code" @click="selectLanguage(lang.code)"
                        class="cursor-pointer text-center p-2 rounded-lg">
                        <p class="text-text">{{ lang.name }}</p>
                    </div>
                </div>

                <button @click="closeModal"
                    class="mt-4 p-2 rounded-full w-full bg-primary hover:bg-primary-light text-white cursor-pointer">
                    {{ $t('close') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

// Ouverture et fermeture du modal
const isModalOpen = ref(false)
const openModal = () => isModalOpen.value = true
const closeModal = () => isModalOpen.value = false

// Langues disponibles
const languages = [
    { name: "Français", code: "fr" },
    { name: "English", code: "en" }
]

// Récupération de la fonction `i18n` de vue-i18n
const { locale } = useI18n()

// Fonction pour obtenir la langue depuis le chemin de l'URL
const getLanguageFromUrl = () => {
    const pathParts = window.location.pathname.split('/')
    return pathParts[1] // Récupère la première partie du chemin, qui est la langue
}

// Changer la langue
const selectLanguage = (code) => {
    // Mettre à jour la langue dans Vue I18n
    locale.value = code
    localStorage.setItem('locale', code)  // Sauvegarder la langue dans le localStorage

    // Forcer la mise à jour de la vue avec nextTick après avoir changé la langue
    nextTick(() => {
        // Mettre à jour l'URL avec la langue choisie
        window.history.pushState(null, '', `/${code}${window.location.pathname.substring(3)}`)
        window.location.reload()
    })

    closeModal()
}

// Charger la langue à partir du chemin de l'URL ou du localStorage
onMounted(() => {
    let savedLocale = getLanguageFromUrl() || localStorage.getItem('locale') || 'fr'
    locale.value = savedLocale
})
</script>
