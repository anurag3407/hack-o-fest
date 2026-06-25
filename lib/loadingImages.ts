/**
 * Marvel-themed loading screen images.
 * Add or remove entries freely — one is picked at random on each load.
 *
 * Format per entry:
 *   url    – full image URL (Cloudinary, local /public/loading/*, etc.)
 *   hero   – character name shown as the bottom-left label
 *   quote  – cinematic quote shown during the load
 */

export interface LoadingImage {
  url: string;
  hero: string;
  quote: string;
}

export const LOADING_IMAGES: LoadingImage[] = [
  {
    // Doctor Strange opening a golden portal on a rooftop at night
    url: "https://res.cloudinary.com/dt7ofzrtg/image/upload/v1782184706/2FBD2D70-E200-466C-A8FE-4FE2AA30B0F7_onz2mh.png",
    hero: "Doctor Strange",
    quote: "Dormammu, I've come to bargain.",
  },
  {
    // Iron Man soaring over a futuristic cityscape at sunset
    url: "https://res.cloudinary.com/dt7ofzrtg/image/upload/v1782184697/A7A6FC03-5BD2-4B19-BDCC-A85BDC9B76EC_ngoimu.png",
    hero: "Iron Man",
    quote: "I am Iron Man.",
  },
  {
    // The six Infinity Stones floating in the cosmos — Infinity Saga
    url: "https://res.cloudinary.com/dt7ofzrtg/image/upload/v1782184696/C3C73180-BC3D-4C3C-BC7C-E8519D5A5C1E_eb03xw.png",
    hero: "The Infinity Saga",
    quote: "Perfectly balanced, as all things should be.",
  },
];

/** Tips that cycle during the loading bar fill */
export const LOADING_TIPS: string[] = [
  "Assembling the Avengers...",
  "Calibrating the Infinity Gauntlet...",
  "Opening a portal to the Multiverse...",
  "Waking up the Guardians of the Galaxy...",
  "Syncing with S.H.I.E.L.D. servers...",
  "Charging the Arc Reactor...",
  "Unlocking Wakanda's vibranium vaults...",
  "Scanning for anomalies in the Quantum Realm...",
  "Deploying Spider-Bots...",
  "Initiating Pym Particle sequence...",
];
