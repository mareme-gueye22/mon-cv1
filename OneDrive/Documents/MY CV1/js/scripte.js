/**
 * ============================================================
 * FICHIER SCRIPT.JS - CV Interactif
 * Auteur : Sokhna Marieme Gueye
 * Module : Développement Web - Licence 2 Informatique
 * ============================================================
 */

// ============================================================
// 1. MODE SOMBRE / CLAIR
// ============================================================

const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// Vérifier le thème sauvegardé dans localStorage
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  body.classList.add("dark-mode");
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

// Changer de thème au clic
themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    localStorage.setItem("theme", "light");
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
});
// ============================================================
// ANIMATION DES BARRES DE PROGRESSION AU SCROLL
// ============================================================

const progressBars = document.querySelectorAll(".progression");

const observerBars = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const niveau = bar.getAttribute("data-niveau");

        // Réinitialiser puis animer
        bar.style.width = "0%";
        setTimeout(() => {
          bar.style.width = niveau;
        }, 200);

        observerBars.unobserve(bar); // Une seule animation
      }
    });
  },
  { threshold: 0.4 },
);

progressBars.forEach((bar) => observerBars.observe(bar));

// ============================================================
// MENU DYNAMIQUE - SECTION ACTIVE SOULIGNÉE
// ============================================================

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("#navList a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= sectionTop - 150) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// ============================================================
// 2. MENU HAMBURGER (Mobile)
// ============================================================

const menuToggle = document.getElementById("menuToggle");
const navList = document.getElementById("navList");

menuToggle.addEventListener("click", () => {
  navList.classList.toggle("active");
});

// Fermer le menu quand on clique sur un lien
document.querySelectorAll("#navList a").forEach((link) => {
  link.addEventListener("click", () => {
    navList.classList.remove("active");
  });
});

// ============================================================
// 3. BOUTON RETOUR EN HAUT
// ============================================================

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// ============================================================
// 4. INITIALISATION EMAILJS
// ============================================================

// Initialiser EmailJS avec votre clé publique
// REMPLACEZ "VOTRE_CLE_PUBLIQUE_ICI" par votre vraie clé
(function () {
  emailjs.init("rEVmRBcdV_UUqlsd5");
})();

// ============================================================
// 5. FORMULAIRE DE CONTACT - VALIDATION + ENVOI EMAIL
// ============================================================

// Récupération des éléments du formulaire (UNE SEULE FOIS)
const contactForm = document.getElementById("contactForm");
const nomInput = document.getElementById("nom");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const nomError = document.getElementById("nomError");
const emailError = document.getElementById("emailError");
const messageError = document.getElementById("messageError");
const btnSubmit = document.querySelector(".btn-submit");

// UN SEUL gestionnaire d'événement submit
contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let isValid = true;

  // --- Valider le nom ---
  if (nomInput.value.trim() === "") {
    nomError.textContent = "Le nom est obligatoire";
    nomInput.classList.add("error");
    isValid = false;
  } else {
    nomError.textContent = "";
    nomInput.classList.remove("error");
  }

  // --- Valider l'email ---
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailInput.value.trim() === "") {
    emailError.textContent = "L'email est obligatoire";
    emailInput.classList.add("error");
    isValid = false;
  } else if (!emailRegex.test(emailInput.value.trim())) {
    emailError.textContent =
      "Veuillez entrer un email valide (ex: nom@domaine.com)";
    emailInput.classList.add("error");
    isValid = false;
  } else {
    emailError.textContent = "";
    emailInput.classList.remove("error");
  }

  // --- Valider le message ---
  if (messageInput.value.trim() === "") {
    messageError.textContent = "Le message est obligatoire";
    messageInput.classList.add("error");
    isValid = false;
  } else {
    messageError.textContent = "";
    messageInput.classList.remove("error");
  }

  // --- Si tout est valide ---
  if (isValid) {
    // Désactiver le bouton pendant l'envoi
    btnSubmit.disabled = true;
    btnSubmit.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

    // Préparer les données
    const contactData = {
      nom: nomInput.value.trim(),
      email: emailInput.value.trim(),
      message: messageInput.value.trim(),
      date: new Date().toLocaleString(),
    };

    // ==== 1. SAUVEGARDE LOCALSTORAGE ====
    localStorage.setItem("contactData", JSON.stringify(contactData));

    // ==== 2. ENVOI PAR EMAILJS ====
    // Envoi EmailJS
    const templateParams = {
      from_name: decodeURIComponent(contactData.nom),
      from_email: decodeURIComponent(contactData.email),
      message: decodeURIComponent(contactData.message),
      to_email: "gmareme2710@gmail.com",
      date: contactData.date,
    };
    // REMPLACEZ PAR VOS VRAIS ID
    emailjs
      .send(
        "service_096t1v9", // Service ID
        "template_m0cxtwv", // Template ID
        templateParams,
      )
      .then(function (response) {
        console.log("✅ Email envoyé avec succès !", response);
        alert("✅ Votre message a été envoyé avec succès !");
        contactForm.reset();
      })
      .catch(function (error) {
        console.error("❌ Erreur d'envoi :", error);
        alert("⚠️ Message sauvegardé localement mais non envoyé par email.");
      })
      .finally(function () {
        // Réactiver le bouton
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer';
      });
  } else {
    alert("❌ Veuillez corriger les erreurs dans le formulaire.");
  }
});

// ============================================================
// 6. SUPPRIMER LES ERREURS EN TEMPS RÉEL
// ============================================================

nomInput.addEventListener("input", () => {
  if (nomInput.value.trim() !== "") {
    nomError.textContent = "";
    nomInput.classList.remove("error");
  }
});

emailInput.addEventListener("input", () => {
  if (emailInput.value.trim() !== "") {
    emailError.textContent = "";
    emailInput.classList.remove("error");
  }
});

messageInput.addEventListener("input", () => {
  if (messageInput.value.trim() !== "") {
    messageError.textContent = "";
    messageInput.classList.remove("error");
  }
});

// ============================================================
// 7. AFFICHER LE DERNIER MESSAGE STOCKÉ (optionnel)
// ============================================================

function afficherDernierMessage() {
  const storedData = localStorage.getItem("contactData");
  if (storedData) {
    const data = JSON.parse(storedData);
    console.log("📩 Dernier message :", data);
    console.log(`De : ${data.nom} (${data.email})`);
    console.log(`Message : ${data.message}`);
    console.log(`Envoyé le : ${data.date}`);
  }
}

// Afficher le dernier message au chargement
afficherDernierMessage();

console.log("✅ CV Interactif chargé avec succès !");
