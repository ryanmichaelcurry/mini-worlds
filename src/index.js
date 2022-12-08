import "normalize.css";
import Game from "./Game";
import Planet from "./Planet";
import Entity from "./Entity";

// StackOverflow
function get(name) {
  if (
    (name = new RegExp("[?&]" + encodeURIComponent(name) + "=([^&]*)").exec(
      location.search
    ))
  ) {
    return decodeURIComponent(name[1]);
  } else {
    return undefined;
  }
}

// https://learnersbucket.com/examples/interview/convert-hex-color-to-rgb-in-javascript/
const hex2rgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // return {r, g, b}
  return { r, g, b };
};

// Create Game Object

const game = new Game();

document.addEventListener("DOMContentLoaded", function () {
  const detail =
    get("detail") === undefined
      ? document.getElementById("detail").value
      : get("detail");
  const seed =
    get("seed") === undefined
      ? document.getElementById("seed").value
      : get("seed");
  const surfaceColor =
    get("surfaceColor") === undefined
      ? document.getElementById("surfaceColor").value
      : get("surfaceColor");
  const oceanColor =
    get("oceanColor") === undefined
      ? document.getElementById("oceanColor").value
      : get("oceanColor");
  const seaLevelOffset =
    get("seaLevelOffset") === undefined
      ? document.getElementById("seaLevelOffset").value
      : get("seaLevelOffset");
  const heightOffset =
    get("heightOffset") === undefined
      ? document.getElementById("heightOffset").value
      : get("heightOffset");

  document.getElementById("detail").value = detail;
  document.getElementById("seed").value = seed;
  console.log("surfaceColor", surfaceColor);
  document.getElementById("surfaceColor").value = surfaceColor;
  document.getElementById("oceanColor").value = oceanColor;
  document.getElementById("seaLevelOffset").value = seaLevelOffset;
  document.getElementById("heightOffset").value = heightOffset;

  // Create Initial Planet
  var planet = new Planet(
    "planet",
    1,
    detail,
    seed,
    hex2rgb(surfaceColor),
    hex2rgb(oceanColor),
    seaLevelOffset,
    heightOffset
  );

  game.addEntity(planet);

  // Start the Game
  game.start();

  // Listeners
  document.getElementById("seed").addEventListener("input", updatePlanetEvent);
  document
    .getElementById("surfaceColor")
    .addEventListener("input", updatePlanetEvent);
  document
    .getElementById("oceanColor")
    .addEventListener("input", updatePlanetEvent);
  document
    .getElementById("seaLevelOffset")
    .addEventListener("input", updatePlanetEvent);
  document
    .getElementById("heightOffset")
    .addEventListener("input", updatePlanetEvent);
  document
    .getElementById("detail")
    .addEventListener("input", updatePlanetEvent);

  // Copy Link
  document.getElementById("link").addEventListener("click", generateURL);
});

// Function for when the initial planet info changes
function updatePlanetEvent() {
  console.log("updatePlanetEvent");
  console.log(document.getElementById("detail").value);
  updatePlanet(
    1,
    document.getElementById("detail").value,
    document.getElementById("seed").value,
    document.getElementById("surfaceColor").value,
    document.getElementById("oceanColor").value,
    document.getElementById("seaLevelOffset").value,
    document.getElementById("heightOffset").value
  );
}

function updatePlanet(
  radius,
  detail,
  seed,
  surfaceColor,
  oceanColor,
  seaLevelOffset,
  heightOffset
) {
  game.removeEntity("planet");

  // Create New Planet
  var planet = new Planet(
    "planet",
    radius,
    detail,
    seed,
    hex2rgb(surfaceColor),
    hex2rgb(oceanColor),
    seaLevelOffset,
    heightOffset
  );

  console.log("planet", planet);

  game.addEntity(planet);
}

// Return copy of URL for sharing online
async function generateURL() {
  const tld = "https://miniworlds.ryanmichaelcurry.com/";
  const detail = document.getElementById("detail").value;
  const seed = document.getElementById("seed").value;
  const surfaceColor = document.getElementById("surfaceColor").value;
  const oceanColor = document.getElementById("oceanColor").value;
  const seaLevelOffset = document.getElementById("seaLevelOffset").value;
  const heightOffset = document.getElementById("heightOffset").value;

  const url =
    tld +
    "?detail=" +
    detail +
    "&seed=" +
    encodeURIComponent(seed) +
    "&surfaceColor=" +
    encodeURIComponent(surfaceColor) +
    "&oceanColor=" +
    encodeURIComponent(oceanColor) +
    "&seaLevelOffset=" +
    seaLevelOffset +
    "&heightOffset=" +
    heightOffset;

  console.log(url);

  try {
    await navigator.clipboard.writeText(url);
    console.log("Content copied to clipboard");
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
}
