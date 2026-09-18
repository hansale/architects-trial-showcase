"use strict";

const potions = {
  weakening_brew: {name:"Weakening Brew",category:"DAMAGE CONTROL",flavour:"Take the edge off their next attack.",effect:"The Champion gains 2 Weak."},
  brittle_brew: {name:"Fracture Flask",category:"EXPOSE A WEAKNESS",flavour:"A crack in the armour changes everything.",effect:"The Champion gains 2 Vulnerable."},
  updraft_tonic: {name:"Updraft Tonic",category:"ENEMY SUPPORT",flavour:"Give their problems a little lift.",effect:"Living enemies gain 5 Flight."},
  frailty_flask: {name:"Frailty Flask",category:"BREAK THEIR DEFENCES",flavour:"Not quite as safe as they thought.",effect:"The Champion gains 1 Frail."},
  sludge_bottle: {name:"Sludge Bottle",category:"DECK SABOTAGE",flavour:"A little something to muddy the draw.",effect:"Add 2 temporary Dazed to the Champion’s combat discard pile."},
  bottled_spite: {name:"Bottled Spite",category:"DECK SABOTAGE",flavour:"Some gifts keep on giving.",effect:"Shuffle 2 random Curses into the Champion’s draw pile for this combat."},
  timeworn_tonic: {name:"Timeworn Tonic",category:"PRESSURE OVER TIME",flavour:"Every card brings the danger closer.",effect:"Living enemies gain 1 Strength every 12 cards the Champion plays. The turn continues; reapplication preserves the counters."},
  fogbound_flask: {name:"Fogbound Flask",category:"HAND DISRUPTION",flavour:"Hard to plan with an empty hand.",effect:"Reduce the Champion’s next normal hand draw by 5, to a minimum of 0. Other draw effects are unaffected."}
};

document.querySelectorAll(".potion-choice").forEach(button => {
  button.addEventListener("click", () => {
    const key = button.dataset.potion;
    const potion = potions[key];
    if (!potion) return;
    document.querySelectorAll(".potion-choice").forEach(choice => choice.setAttribute("aria-pressed", String(choice === button)));
    document.getElementById("potion-image").src = `assets/potions/${key}.webp`;
    document.getElementById("potion-image").alt = `${potion.name} potion illustration`;
    for (const field of ["name", "category", "flavour", "effect"]) document.getElementById(`potion-${field}`).textContent = potion[field];
  });
});

const lightbox = document.getElementById("lightbox");
let previousFocus;
document.querySelectorAll(".screenshot-link").forEach(link => {
  link.addEventListener("click", event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !lightbox.showModal) return;
    event.preventDefault();
    previousFocus = link;
    document.getElementById("lightbox-image").src = link.href;
    document.getElementById("lightbox-image").alt = link.querySelector("img").alt;
    document.getElementById("lightbox-caption").textContent = link.dataset.caption;
    lightbox.showModal();
    document.body.style.overflow = "hidden";
  });
});
document.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", event => {
  if (event.target !== lightbox) return;
  const rect = lightbox.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) lightbox.close();
});
lightbox.addEventListener("close", () => {
  document.body.style.overflow = "";
  previousFocus?.focus({preventScroll:true});
});

document.querySelectorAll(".gif-toggle").forEach(button => {
  const img = button.parentElement.querySelector("img");
  const poster = img.getAttribute("src");
  const label = button.getAttribute("aria-label").replace("Play GIF: ", "");
  button.addEventListener("click", () => {
    const playing = button.getAttribute("aria-pressed") !== "true";
    img.src = playing ? img.dataset.gif : poster;
    button.setAttribute("aria-pressed", String(playing));
    button.setAttribute("aria-label", `${playing ? "Stop" : "Play"} GIF: ${label}`);
    button.textContent = playing ? "Ⅱ Stop GIF" : "▷ Play GIF";
  });
});

// GitHub Pages project paths work without hard-coding an account or repository.
// A custom domain can use the optional configuration instead.
function repositoryUrl() {
  const configured = (window.TRIAL_SITE?.repositoryUrl || "").trim().replace(/\/$/, "");
  if (/^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(configured)) return configured;
  if (!/^[A-Za-z0-9-]+\.github\.io$/.test(location.hostname)) return "";
  const owner = location.hostname.split(".")[0];
  const firstSegment = location.pathname.split("/").filter(Boolean)[0];
  const project = !firstSegment || firstSegment === "index.html" ? `${owner}.github.io` : firstSegment;
  return `https://github.com/${owner}/${encodeURIComponent(project)}`;
}
const repository = repositoryUrl();
if (repository) {
  document.querySelectorAll("[data-repo-path]").forEach(link => {
    let path = link.dataset.repoPath;
    if (path === "releases" && window.TRIAL_SITE?.showReleases === false) return;
    if (path === "releases" && window.TRIAL_SITE?.releaseTag) path += `/tag/${encodeURIComponent(window.TRIAL_SITE.releaseTag)}`;
    link.href = `${repository}${path ? `/${path}` : ""}`;
    link.hidden = false;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
}
