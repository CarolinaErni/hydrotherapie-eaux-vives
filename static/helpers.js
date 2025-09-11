/*
    Activer les helpers dans baseof.html.
*/

async function chargerMedias() {
    const mediaType = window.location.search.includes("i")
        ? "img"
        : window.location.search.includes("v")
        ? "source"
        : null;

    const gistBaseURL =
        mediaType === "img"
            ? "https://gist.githubusercontent.com/CarolinaErni/3d0a6d7f82d4554cf814932010373323/raw/gistfile1.txt"
            : mediaType === "source"
            ? "https://gist.githubusercontent.com/CarolinaErni/d604e0bc3ae0bcfd3f2713f5b3d62d65/raw/gistfile1.txt"
            : null;

    const cacheBuster = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}`;
    const gistURL = `${gistBaseURL}?nocache=${cacheBuster}`;

    console.log("chargerMedias");
    console.log(mediaType);
    try {
        const response = await fetch(gistURL);
        const text = await response.text();
        const urls = text.split("\n");
        // Met à jour les images en fonction des URLs
        const medias = document.querySelectorAll(mediaType);
        medias.forEach((media, index) => {
            if (index >= urls.length) return;
            const url = urls[index];
            if (url.trim()) {
                media.src = url.trim();
            }
            if (mediaType === "source") {
                media.srcset = url.trim();
            }
            console.log(`${index} ${media.outerHTML}`);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des images :", error);
    }
}

// On exporte la fonction globalement
const params = ["i", "v"];
if (params.some((param) => window.location.search.includes(param))) {
    document.addEventListener("DOMContentLoaded", chargerMedias);
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
