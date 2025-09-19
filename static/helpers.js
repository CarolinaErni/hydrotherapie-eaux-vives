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

async function testPhotosPortrait() {
    let imageList = [];
    let currentIndex = 0;
    const baseURL = "https://ernicarolina.ch/photographe_christian_bromley/edited/";

    try {
        // Fetch the image list
        const response = await fetch(
            `${baseURL}list.php`
        )
        const data = await response.json();
        imageList = data.map((filename) => baseURL + filename);

        console.log("testPhotosPortrait: loaded", imageList.length, "images");

        // Check if URL contains a specific image parameter
        const urlParams = new URLSearchParams(window.location.search);
        const imageParam = urlParams.get("image");
        if (imageParam) {
            const index = data.indexOf(imageParam);
            if (index !== -1) {
                currentIndex = index;
                console.log(
                    "testPhotosPortrait: starting at image",
                    imageParam,
                    "index",
                    currentIndex
                );
            }
        }

        // Apply the current image
        updateCarolinaImage();
    } catch (error) {
        console.error("testPhotosPortrait: failed to load image list", error);
        // Fallback to hardcoded list
        const fallbackList = [
            "small_DSC7487.jpg",
            "small_DSC7488.jpg",
            "small_DSC7489.jpg",
            "small_DSC7490.jpg",
            "small_DSC7491.jpg",
            "small_DSC7492.jpg",
            "small_DSC7493.jpg",
            "small_DSC7494.jpg",
            "small_DSC7495.jpg",
            "small_DSC7496.jpg",
            "small_DSC7497.jpg",
            "small_DSC7498.jpg",
            "small_DSC7499.jpg",
            "small_DSC7500.jpg",
            "small_DSC7501.jpg",
            "small_DSC7502.jpg",
            "small_DSC7503.jpg",
            "small_DSC7504.jpg",
            "small_DSC7505.jpg",
            "small_DSC7506.jpg",
            "small_DSC7507.jpg",
        ];
        imageList = fallbackList.map((filename) => baseURL + filename);
        updateCarolinaImage();
    }

    function updateCarolinaImage() {
        const carolinaImg = document.querySelector('img[alt="Carolina Erni"]');
        if (carolinaImg && imageList.length > 0) {
            carolinaImg.src = imageList[currentIndex];
            console.log(
                "testPhotosPortrait: updated to",
                imageList[currentIndex]
            );

            // Update URL parameter
            const filename = imageList[currentIndex].split("/").pop();
            const url = new URL(window.location);
            url.searchParams.set("image", filename);
            window.history.replaceState({}, "", url);
        }
    }

    // Keyboard navigation
    document.addEventListener("keydown", function (e) {
        if (imageList.length === 0) return;

        if (e.key === "ArrowLeft") {
            e.preventDefault();
            currentIndex =
                (currentIndex - 1 + imageList.length) % imageList.length;
            updateCarolinaImage();
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            currentIndex = (currentIndex + 1) % imageList.length;
            updateCarolinaImage();
        }
    });
}

// On exporte la fonction globalement
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("i")) {
    document.addEventListener("DOMContentLoaded", chargerMedias);
} else if (urlParams.has("j")) {
    document.addEventListener("DOMContentLoaded", testPhotosPortrait);
}

// // Fonction pour tester rapidement les mix-blend-mode
// // Click-to-cycle mix-blend-mode tester for all <h2> elements
// (function () {
//     const mixModes = [
//         "normal",
//         "multiply",
//         "screen",
//         "overlay",
//         "darken",
//         "lighten",
//         "color-dodge",
//         "color-burn",
//         "hard-light",
//         "soft-light",
//         "difference",
//         "exclusion",
//         "hue",
//         "saturation",
//         "color",
//         "luminosity",
//     ];

//     let current = -1;

//     function applyMode(mode) {
//         const headers = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
//         headers.forEach((h) => {
//             h.style.mixBlendMode = mode;
//         });
//         console.info("mix-blend-mode ->", mode);
//     }

//     document.addEventListener("click", function () {
//         current = (current + 1) % mixModes.length;
//         applyMode(mixModes[current]);
//     });

//     console.info(
//         "mix-blend-mode tester active — click anywhere to cycle modes:\n",
//         mixModes.join(", ")
//     );
// })();
