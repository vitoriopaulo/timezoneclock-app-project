let timezones = [];

// Comprehensive mapping of user-friendly names to IANA time zones
const timezoneMap = {
  "California": "America/Los_Angeles",
  "New York": "America/New_York",
  "Germany": "Europe/Berlin",
  "France": "Europe/Paris",
  "Italy": "Europe/Rome",
  "Spain": "Europe/Madrid",
  "United Kingdom": "Europe/London",
  "Switzerland": "Europe/Zurich",
  "Argentina": "America/Argentina/Buenos_Aires",
  "Brazil": "America/Sao_Paulo",
  "Chile": "America/Santiago",
  "Colombia": "America/Bogota",
  "Mexico": "America/Mexico_City",
  "Japan": "Asia/Tokyo",
  "Australia": "Australia/Sydney",
  "India": "Asia/Kolkata",
  // Add more mappings as needed
};

const addTimezoneButton = document.getElementById('addTimezone');
addTimezoneButton.addEventListener('click', showPromptModal);

const aboutButton = document.getElementById('aboutButton');
aboutButton.addEventListener('click', showAboutModal);

const promptModal = document.getElementById('promptModal');
const promptInput = document.getElementById('promptInput');
const promptOkButton = document.getElementById('promptOk');
const promptCancelButton = document.getElementById('promptCancel');
const aboutModal = document.getElementById('aboutModal');
const aboutCloseButton = document.getElementById('aboutClose');

document.addEventListener('DOMContentLoaded', () => {
  const storedTimezones = JSON.parse(localStorage.getItem('clockList'));
  if (storedTimezones) {
    timezones = storedTimezones;
    updateTimezones();
  } else {
    timezones = ['America/New_York'];
    updateTimezones();
  }
});

function showPromptModal() {
  promptModal.style.display = 'block';
}

function showAboutModal() {
  aboutModal.style.display = 'block';
}

function addTimezone() {
  const newTimezone = promptInput.value.trim();
  const matchedTimezone = Object.keys(timezoneMap).find(key => key.toLowerCase() === newTimezone.toLowerCase());
  
  if (matchedTimezone) {
    const ianaTimezone = timezoneMap[matchedTimezone];
    if (timezones.length < 7) {
      timezones.push(ianaTimezone);
      updateTimezones();
      promptModal.style.display = 'none';
      localStorage.setItem('clockList', JSON.stringify(timezones));
    } else {
      showWarningMessage('Maximum number of clocks set to 7. Attempt to create new clock failed!');
    }
  } else {
    showWarningMessage('Invalid timezone. Please enter a valid region or country name.');
  }
}

promptOkButton.addEventListener('click', () => {
  addTimezone();
  promptInput.value = ''; // Clear the input field after adding
});

promptCancelButton.addEventListener('click', () => {
  promptModal.style.display = 'none';
  promptInput.value = ''; // Clear the input field on cancel
});

aboutCloseButton.addEventListener('click', () => {
  aboutModal.style.display = 'none'; // Close the About modal
});

window.addEventListener('click', (event) => {
  if (event.target === promptModal) {
    promptModal.style.display = 'none';
  }
  if (event.target === aboutModal) {
    aboutModal.style.display = 'none';
  }
});

function updateTimezones() {
  const timezonesContainer = document.getElementById('timezones');
  timezonesContainer.innerHTML = '';

  if (timezones.length > 0) {
    timezones.forEach((timezone, index) => {
      const container = document.createElement('div');
      container.classList.add('timezone-container');

      const name = document.createElement('h2');
      name.classList.add('timezone-name');
      name.textContent = timezone;

      const removeButton = document.createElement('button');
      removeButton.classList.add('remove-button');
      removeButton.textContent = 'Remove Clock';
      removeButton.addEventListener('click', () => {
        if (timezones.length === 1) {
          showWarningMessage('This is the ONLY clock available in the list, Remove attempt failed!');
        } else {
          removeTimezone(index);
          localStorage.setItem('clockList', JSON.stringify(timezones));
        }
      });

      const clockContainer = document.createElement('div');
      clockContainer.classList.add('clock');

      const hourHand = document.createElement('div');
      hourHand.classList.add('hour-hand');

      const minuteHand = document.createElement('div');
      minuteHand.classList.add('minute-hand');

      clockContainer.appendChild(hourHand);
      clockContainer.appendChild(minuteHand);

      container.appendChild(name);
      container.appendChild(removeButton);
      container.appendChild(clockContainer);
      timezonesContainer.appendChild(container);

      updateClockHands(hourHand, minuteHand, timezone);
    });
  } else {
    // Display a message if no timezones are selected
    timezonesContainer.textContent = 'Please add a timezone to display the clock.';
  }
}

function getCurrentTime(timezone) {
  const now = new Date().toLocaleString('en-US', { timeZone: timezone });
  return new Date(now).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
}

function updateClockHands(hourHand, minuteHand, timezone) {
  const now = new Date().toLocaleString('en-US', { timeZone: timezone });
  const date = new Date(now);
  const hour = date.getHours();
  const minute = date.getMinutes();

  const hourDegrees = (hour % 12) * 30 + (minute * 0.5);
  const minuteDegrees = minute * 6;

  hourHand.style.transform = `rotate(${hourDegrees}deg)`;
  minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
}

// Update clocks every minute
setInterval(() => {
  updateTimezones();
}, 60000);

function removeTimezone(index) {
  timezones.splice(index, 1);
  updateTimezones();
}

// Warning Message Functionality
function showWarningMessage(message) {
  const warningMessage = document.getElementById('warningMessage');
  const warningText = document.getElementById('warningText');
  warningText.textContent = message;
  warningMessage.style.display = 'block';
  
  setTimeout(() => {
    warningMessage.style.display = 'none';
  }, 5000); // Display for 5 seconds
}