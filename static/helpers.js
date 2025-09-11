/*
    Activer les helpers dans baseof.html.
*/

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
