let timezones = ['America/New_York'];

const addTimezoneButton = document.getElementById('addTimezone');
addTimezoneButton.addEventListener('click', showPromptModal);

const promptModal = document.getElementById('promptModal');
const promptInput = document.getElementById('promptInput');
const promptOkButton = document.getElementById('promptOk');
const promptCancelButton = document.getElementById('promptCancel');

document.addEventListener('DOMContentLoaded', updateTimezones);

function showPromptModal() {
  promptModal.style.display = 'block';
}

function addTimezone() {
  const newTimezone = promptInput.value.trim();
  if (newTimezone) {
    if (timezones.length < 7) { // Check if the limit is reached
      try {
        const now = new Date().toLocaleString('en-US', { timeZone: newTimezone });
        timezones.push(newTimezone);
        updateTimezones();
        promptModal.style.display = 'none';
      } catch (error) {
        showWarningMessage('City, State or Region not available. Try again!');
      }
    } else {
      showWarningMessage('Maximum number of clocks set to 7. Attempt to create new clock failed!');
    }
  }
}

promptOkButton.addEventListener('click', addTimezone);

promptCancelButton.addEventListener('click', () => {
  promptModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === promptModal) {
    promptModal.style.display = 'none';
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
  const warningMessage = document.createElement('div');
  warningMessage.className = 'warning-message';
  warningMessage.textContent = message;
  document.body.appendChild(warningMessage);
  
  warningMessage.style.display = 'block';
  
  setTimeout(() => {
    warningMessage.style.display = 'none';
    document.body.removeChild(warningMessage);
  }, 5000); // Display for 5 seconds
}