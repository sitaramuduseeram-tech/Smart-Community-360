/* =========================================================
   SMART COMMUNITY 360°
   Main JavaScript
   ========================================================= */


/* =========================
   MOBILE MENU
   ========================= */

const menuBtn = document.getElementById("menuBtn");

const navLinks = document.querySelector(".nav-links");

if (menuBtn && navLinks) {

    menuBtn.addEventListener("click", function () {

        navLinks.classList.toggle("mobile-active");

    });

}


/* =========================
   CLOSE MOBILE MENU
   ========================= */

if (navLinks) {

    const links = navLinks.querySelectorAll("a");

    links.forEach(function (link) {

        link.addEventListener("click", function () {

            navLinks.classList.remove("mobile-active");

        });

    });

}


/* =========================
   ACTIVE NAVIGATION
   ========================= */

const sections = document.querySelectorAll("section[id]");

const navigationLinks = document.querySelectorAll(".nav-links a");

function updateActiveNavigation() {

    let currentSection = "";

    sections.forEach(function (section) {

        const sectionTop = section.offsetTop - 150;

        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {

            currentSection = section.getAttribute("id");

        }

    });


    navigationLinks.forEach(function (link) {

        link.classList.remove("active");

        const target = link.getAttribute("href");

        if (target === "#" + currentSection) {

            link.classList.add("active");

        }

    });

}


window.addEventListener("scroll", updateActiveNavigation);


/* =========================
   SCROLL REVEAL
   ========================= */

const revealElements = document.querySelectorAll(
    ".service-card, .step, .impact-stat, .about-card"
);

function revealOnScroll() {

    const windowHeight = window.innerHeight;

    revealElements.forEach(function (element) {

        const elementTop =
            element.getBoundingClientRect().top;

        if (elementTop < windowHeight - 80) {

            element.classList.add("visible");

        }

    });

}

window.addEventListener("scroll", revealOnScroll);

revealOnScroll();


/* =========================
   BUTTON CLICK EFFECT
   ========================= */

const buttons = document.querySelectorAll(
    ".primary-btn, .secondary-btn, .register-btn, .login-btn"
);

buttons.forEach(function (button) {

    button.addEventListener("click", function () {

        button.style.transform = "scale(0.97)";

        setTimeout(function () {

            button.style.transform = "";

        }, 120);

    });

});


/* =========================
   CURRENT YEAR
   ========================= */

const yearElement = document.querySelector(".footer-bottom p");

if (yearElement) {

    const currentYear = new Date().getFullYear();

    yearElement.innerHTML =
        "© " +
        currentYear +
        " Smart Community 360°. Academic Project.";

}


/* =========================
   PAGE LOADED
   ========================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log(
        "Smart Community 360° loaded successfully."
    );

});