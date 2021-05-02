// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const canvas = document.getElementById('user-image');
const ctx = canvas.getContext('2d');
const input = document.getElementById('image-input');
const form = document.getElementById('generate-meme');
const topText = document.getElementById('text-top');
const botText = document.getElementById('text-bottom');
const clearButton = document.querySelector("[type='reset']");
const generateButton = document.querySelector("[type='submit']");
const readTextButton = document.querySelector("[type='button']");
const voiceSelection = document.getElementById('voice-selection');
const volImg = document.querySelector('div img');
const vol = document.querySelector("[type='range']");

var synth = window.speechSynthesis;
var voices = synth.getVoices();
var utterThis = new SpeechSynthesisUtterance();

function populateVoiceList() {

  for(var i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.value = voices[i].lang;
    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelection.appendChild(option);
  }
}

synth.addEventListener("voiceschanged", () => {
  voiceSelection.disabled = false;
  voices = synth.getVoices();
  populateVoiceList();
});

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const dimmension = getDimmensions(canvas.width, canvas.height, img.width, img.height)
  ctx.drawImage(img, dimmension.startX, dimmension.startY, dimmension.width, dimmension.height);
  clearButton.disabled = false;
});

input.addEventListener('change', () => {
  img.src = URL.createObjectURL(input.files[0]);
  img.alt = input.files[0].name;
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  ctx.font = '30px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText(topText.value, 200, 50);
  ctx.fillText(botText.value, 200, 370);
  ctx.fillStyle = 'black';
  ctx.strokeText(topText.value, 200, 50);
  ctx.strokeText(botText.value, 200, 370);
  clearButton.disabled = false;
  readTextButton.disabled = false;
  generateButton.disabled = true;
});

clearButton.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  clearButton.disabled = true;
  readTextButton.disabled = true;
  generateButton.disabled = false;
});

readTextButton.addEventListener('click', () => {
  utterThis.text = (topText.value + " " + botText.value);
  utterThis.lang = voiceSelection.value;
  utterThis.volume = vol.value/100;
  speechSynthesis.speak(utterThis);
});

vol.addEventListener('input', () => {
  if (vol.value == 0) {
    volImg.src = "icons/volume-level-0.svg";
    volImg.alt = "Volume Level 0";
  } else if (vol.value < 34) {
    volImg.src = "icons/volume-level-1.svg";
    volImg.alt = "Volume Level 1";
  } else if (vol.value < 67) {
    volImg.src = "icons/volume-level-2.svg";
    volImg.alt = "Volume Level 2";
  } else {
    volImg.src = "icons/volume-level-3.svg";
    volImg.alt = "Volume Level 3";
  }
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
