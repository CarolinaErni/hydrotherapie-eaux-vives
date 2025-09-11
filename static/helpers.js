/*
    Activer les helpers dans baseof.html.
*/

// helpers.js
// Remplace l'URL ci-dessous par le lien brut (raw) de ton gist
const gistBaseURL = "https://gist.githubusercontent.com/CarolinaErni/3d0a6d7f82d4554cf814932010373323/raw/gistfile1.txt";

// Génère une valeur aléatoire (timestamp + nombre aléatoire)
const cacheBuster = `${Date.now()}-${Math.random().toString(36).substring(2)}`;

// Construit l’URL finale avec un paramètre query
const gistURL = `${gistBaseURL}?nocache=${cacheBuster}`;

async function chargerImages() {
    console.log("chargerImages");
    try {
        const response = await fetch(gistURL);
        const text = await response.text();
        const urls = text.split("\n");
        // Met à jour les images en fonction des URLs
        const imgs = document.querySelectorAll("img");
        urls.forEach((url, index) => {
            const img = imgs[index];
            if (url.trim()) {
                img.src = url.trim();
            }
            console.log(`${index} ${img.outerHTML}`);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des images :", error);
    }
}

// On exporte la fonction globalement
if (window.location.search.includes("i")) {
    document.addEventListener("DOMContentLoaded", chargerImages);
}

// Fonction pour tester rapidement les mix-blend-mode
// Click-to-cycle mix-blend-mode tester for all <h2> elements
(function () {
    const mixModes = [
        "normal",
        "multiply",
        "screen",
        "overlay",
        "darken",
        "lighten",
        "color-dodge",
        "color-burn",
        "hard-light",
        "soft-light",
        "difference",
        "exclusion",
        "hue",
        "saturation",
        "color",
        "luminosity",
    ];

    let current = -1;

    function applyMode(mode) {
        const headers = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
        headers.forEach((h) => {
            h.style.mixBlendMode = mode;
        });
        console.info("mix-blend-mode ->", mode);
    }

    document.addEventListener("click", function () {
        current = (current + 1) % mixModes.length;
        applyMode(mixModes[current]);
    });

    console.info(
        "mix-blend-mode tester active — click anywhere to cycle modes:\n",
        mixModes.join(", ")
    );
})();
