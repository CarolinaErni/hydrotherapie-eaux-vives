// Navigation et défilement fluide
document.addEventListener("DOMContentLoaded", function () {
    // Gestion du menu mobile
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const navMenu = document.querySelector(".nav-menu");

    if (mobileMenuBtn && navMenu) {
        // set appropriate ARIA attribute
        mobileMenuBtn.setAttribute("role", "button");
        mobileMenuBtn.setAttribute("aria-label", "Ouvrir le menu");
        mobileMenuBtn.setAttribute("aria-expanded", "false");

        mobileMenuBtn.addEventListener("click", function (e) {
            const isActive = navMenu.classList.toggle("active");
            mobileMenuBtn.classList.toggle("active", isActive);
            // update accessible state
            mobileMenuBtn.setAttribute(
                "aria-expanded",
                isActive ? "true" : "false"
            );
        });
    }

    // Défilement fluide
    function smoothScroll(target) {
        const element = document.getElementById(target);
        if (element) {
            const elementPosition = element.offsetTop;

            // Custom smooth scroll (1 second)
            const scrollDuration = 1000; // reduced from 1500ms to 1000ms
            const start = window.pageYOffset;
            const distance = elementPosition - start;
            let startTime = null;

            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / scrollDuration, 1);

                // Easing function for smoother animation
                const easeProgress =
                    progress < 0.5
                        ? 2 * progress * progress
                        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

                window.scrollTo(0, start + distance * easeProgress);

                if (timeElapsed < scrollDuration) {
                    requestAnimationFrame(animation);
                }
            }

            requestAnimationFrame(animation);
        }
    }

    // Gestion des clics sur les liens de navigation
    document.querySelectorAll("[data-section]").forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const section = this.getAttribute("data-section");
            smoothScroll(section);
            // Close mobile menu if open and restore button state
            if (navMenu && navMenu.classList.contains("active")) {
                navMenu.classList.remove("active");
            }
            if (mobileMenuBtn && mobileMenuBtn.classList.contains("active")) {
                mobileMenuBtn.classList.remove("active");
                mobileMenuBtn.setAttribute("aria-expanded", "false");
            }
        });
    });

    // Effet parallaxe
    function parallaxEffect() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll(".parallax-bg");

        parallaxElements.forEach((element) => {
            const speed = 0.5;
            const yPos = scrolled * speed;
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    // Animation au scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll(
            ".section-title, .section-content, .service-card"
        );

        elements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add("animate");
            }
        });
    }

    // Header transparent/opaque au scroll
    function handleHeaderScroll() {
        const header = document.querySelector("header");
        const scrolled = window.pageYOffset;

        if (scrolled > 100) {
            header.style.background = "rgba(255, 255, 255, 0.98)";
            header.style.boxShadow = "0 2px 20px rgba(0,0,0,0.1)";
        } else {
            header.style.background = "rgba(255, 255, 255, 0.95)";
            header.style.boxShadow = "none";
        }
    }

    // Événements de scroll
    window.addEventListener("scroll", function () {
        requestAnimationFrame(function () {
            parallaxEffect();
            animateOnScroll();
            handleHeaderScroll();
        });
    });

    // Animation initiale (startup only): déclenche après 2s pour laisser la page se stabiliser
    setTimeout(function () {
        animateOnScroll();
    }, 2000);

    // Délai pour les cartes de services
    const serviceCards = document.querySelectorAll(".service-card");
    serviceCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transitionDelay = `${index * 0.2}s`;
        }, 100);
    });

    // Gestion du redimensionnement
    window.addEventListener("resize", function () {
        navMenu.classList.remove("active");
    });
});

function targetBlank() {
    const _a = document.getElementsByTagName("a");
    const _siteHost = location.host.replace(/^www\./i, "");
    const internalRegex = new RegExp(_siteHost, "i");

    for (let i = 0; i < _a.length; i++) {
        let href = _a[i].href;
        let isExternal = false;

        if (/^mailto:/i.test(href)) {
            // Si le lien commence par mailto: il est forcément externe
            isExternal = true;
        } else if (location.protocol === "file:") {
            // Si on est en protocole file://
            // tous les liens http/https et protocol-relative sont externes
            isExternal = /^(https?:)?\/\//i.test(href);
        } else {
            // Logique normale pour http/https
            // Un lien est externe s’il a un host et que ce host ne correspond pas au site actuel
            let linkHost = _a[i].host;
            isExternal = linkHost && !internalRegex.test(linkHost);
        }

        if (isExternal) {
            _a[i].setAttribute("target", "_blank");
            _a[i].setAttribute("rel", "noopener");
        }
        // console.log(`${String(isExternal).padEnd(5)} ${_siteHost} ${href}`);
    }
}
targetBlank();

// Gestion de la limitation des paragraphes et du bouton "Afficher plus" avec affichage limité au repli
function truncateServiceCards() {
    const serviceCards = document.querySelectorAll(".service-card");

    serviceCards.forEach((card) => {
        const originalHTML = card.innerHTML;
        const serviceIcon = card.querySelector(".service-card img").outerHTML;
        const serviceTitle = card.querySelector(".service-card h3").outerHTML;

        if (originalHTML.length > 100) {
            const truncatedHTML = originalHTML.slice(0, 100);
            const fullTextContainer = document.createElement("span");
            fullTextContainer.innerHTML = originalHTML;
            fullTextContainer.style.display = "none";

            const truncatedTextContainer = document.createElement("span");
            truncatedTextContainer.innerHTML = serviceIcon + serviceTitle;

            const toggleButton = document.createElement("button");
            toggleButton.textContent = "Afficher plus";

            toggleButton.addEventListener("click", function () {
                if (fullTextContainer.style.display === "none") {
                    fullTextContainer.style.display = "inline";
                    truncatedTextContainer.style.display = "none";
                    toggleButton.textContent = "Afficher moins";
                    // After expanding, scroll the top of this service card to the top of the viewport
                    try {
                        const rect = card.getBoundingClientRect();
                        const scrollTo = window.pageYOffset + rect.top;
                        window.scrollTo({ top: scrollTo, behavior: "smooth" });
                    } catch (e) {
                        // fallback: no-op
                    }
                } else {
                    fullTextContainer.style.display = "none";
                    truncatedTextContainer.style.display = "inline";
                    toggleButton.textContent = "Afficher plus";
                    // After collapsing, scroll back to the top of the current service card
                    try {
                        const rect = card.getBoundingClientRect();
                        const scrollTo = window.pageYOffset + rect.top;
                        window.scrollTo({ top: scrollTo, behavior: "smooth" });
                    } catch (e) {
                        // fallback: no-op
                    }
                }
            });

            card.innerHTML = "";
            card.appendChild(truncatedTextContainer);
            card.appendChild(fullTextContainer);
            card.appendChild(toggleButton);
            // Ensure headings inside the newly inserted containers have anchors
            try {
                if (typeof addAnchorsToServiceCards === "function")
                    addAnchorsToServiceCards();
            } catch (e) {
                // safe no-op
            }
        }
    });
}

// Appeler la fonction après le chargement du DOM
document.addEventListener("DOMContentLoaded", truncateServiceCards);

// Add anchor links to h3 titles inside .service-card, pointing to the parent card id
function addAnchorsToServiceCards() {
    const cards = document.querySelectorAll(".service-card");

    cards.forEach((card) => {
        const heading = card.querySelector("h3");
        if (!heading) return;

        const cardId = card.id;
        if (!cardId) return;

        // skip if already contains a correct link
        const firstLink = heading.querySelector("a");
        if (
            firstLink &&
            (firstLink.getAttribute("href") === "#" + cardId ||
                firstLink.getAttribute("href") === cardId)
        ) {
            return;
        }

        const a = document.createElement("a");
        a.setAttribute("href", "#" + cardId);
        a.className = "heading-link";

        while (heading.firstChild) {
            a.appendChild(heading.firstChild);
        }

        // click: offset for fixed header
        a.addEventListener("click", function (e) {
            e.preventDefault();
            const rect = card.getBoundingClientRect();
            const scrollTo = window.pageYOffset + rect.top;
            window.scrollTo({ top: scrollTo, behavior: "smooth" });
            try {
                history.pushState(null, "", "#" + cardId);
            } catch (err) {
                location.hash = cardId;
            }
        });

        heading.appendChild(a);
    });
}

// Run on DOMContentLoaded (and immediately if already loaded)
document.addEventListener("DOMContentLoaded", addAnchorsToServiceCards);
if (document.readyState !== "loading") addAnchorsToServiceCards();

/**
 * cycleCarolinaPhoto()
 * - Liste en dur des images de Carolina (séquentiel)
 * - Stocke l'index courant dans localStorage pour la prochaine visite
 * - Met à jour l'image `img[alt="Carolina Erni"]`
 */
function cycleCarolinaPhoto() {
    const list = [
        "./images/3-1-carolina-erni-7498-warm.webp",
        "./images/3-1-carolina-erni-7504-warm.webp",
    ];

    const key = "carolina-photo-index";
    let idx = 0;
    try {
        const stored = localStorage.getItem(key);
        if (stored !== null) idx = (parseInt(stored, 10) + 1) % list.length;
    } catch (e) {
        idx = 0;
    }

    const img = document.querySelector('img[alt="Carolina Erni"]');
    if (!img) return;

    img.src = list[idx];

    try {
        localStorage.setItem(key, String(idx));
    } catch (e) {
        // ignore storage errors
    }
}

// Appel automatique : cycle de la photo au chargement
document.addEventListener("DOMContentLoaded", cycleCarolinaPhoto);
