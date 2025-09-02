// Navigation et défilement fluide
document.addEventListener("DOMContentLoaded", function () {
    // Gestion du menu mobile
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const navMenu = document.querySelector(".nav-menu");

    mobileMenuBtn.addEventListener("click", function () {
        navMenu.classList.toggle("active");
    });

    // Défilement fluide
    function smoothScroll(target) {
        const element = document.getElementById(target);
        if (element) {
            const headerHeight = document.querySelector(".header").offsetHeight;
            const elementPosition = element.offsetTop - headerHeight;

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
                const easeProgress = progress < 0.5
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
            navMenu.classList.remove("active");
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
        const header = document.querySelector(".header");
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

    // Animation initiale
    animateOnScroll();

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
    var a = document.getElementsByTagName("a");

    for (var i = 0; i < a.length; i++) {
        var href = a[i].href;
        var isExternal = false;

        // Si le lien commence par mailto: il est forcément externe
        if (/^mailto:/i.test(href)) {
            isExternal = true;
        }
        // Si on est en protocole file://
        else if (location.protocol === "file:") {
            // Tous les liens http/https et protocol-relative sont externes
            isExternal = /^(https?:)?\/\//i.test(href);
        } else {
            // Logique normale pour http/https
            var internal = location.host.replace("www.", "");
            internal = new RegExp(internal, "i");
            var linkHost = a[i].host;
            // Un lien est externe s’il a un host et que ce host ne correspond pas au site actuel
            isExternal = linkHost && !internal.test(linkHost);
        }

        if (isExternal) {
            a[i].setAttribute("target", "_blank");
            a[i].setAttribute("rel", "noopener noreferrer");
        }
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
            toggleButton.style.marginLeft = "10px";

            toggleButton.addEventListener("click", function () {
                if (fullTextContainer.style.display === "none") {
                    fullTextContainer.style.display = "inline";
                    truncatedTextContainer.style.display = "none";
                    toggleButton.textContent = "Afficher moins";
                } else {
                    fullTextContainer.style.display = "none";
                    truncatedTextContainer.style.display = "inline";
                    toggleButton.textContent = "Afficher plus";
                }
            });

            card.innerHTML = "";
            card.appendChild(truncatedTextContainer);
            card.appendChild(fullTextContainer);
            card.appendChild(toggleButton);
        }
    });
}

// Appeler la fonction après le chargement du DOM
document.addEventListener("DOMContentLoaded", truncateServiceCards);
