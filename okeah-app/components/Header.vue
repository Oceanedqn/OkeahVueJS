<template>
    <header :style="{ backgroundColor: `var(--background-alternatif)` }" class="text-white p-4 shadow-md">
        <div class="flex w-full justify-between items-center">
            <!-- Texte Okeah à gauche -->
            <div class="text-xl font-bold" :style="{ color: 'var(--primary)' }">Okeah</div>

            <!-- Liens de navigation à droite -->
            <nav class="flex space-x-4 items-center">
                <NuxtLink to="/">Accueil</NuxtLink>
                <NuxtLink to="/blog">Blog</NuxtLink>
                <ThemeSelector />
            </nav>
        </div>
    </header>
</template>

<script>
export default {
    data() {
        return {
            // Choisis ton thème ici, exemple vintage-theme
            themeClass: 'vintage-theme', // Utilise la classe de ton thème préféré
        };
    },
    mounted() {
        // Applique la classe du thème au body pour activer le thème
        document.body.classList.add(this.themeClass);
    },
    beforeDestroy() {
        // Enlève la classe du thème lorsque le composant est détruit
        document.body.classList.remove(this.themeClass);
    }
};
</script>