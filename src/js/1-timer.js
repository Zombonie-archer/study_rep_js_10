import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate = null;
const startButton = document.querySelector('#start-button');
startButton.disabled = true;
startButton.addEventListener('click', () => {
  startTimer();
  updateTimerDisplay();
});

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < new Date()) {
      startButton.disabled = true;
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        timeout: 4000,
      });
    } else {
      userSelectedDate = selectedDates[0];
      startButton.disabled = false;
    }
    console.log(userSelectedDate);
  },
};

const datetime = document.querySelector('#datetime-picker');
flatpickr(datetime, options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

let timerInterval = null;
function startTimer() {
  if (userSelectedDate > new Date()) {
    timerInterval = setInterval(() => {
      updateTimerDisplay();
    }, 1000);
  }
}

function updateTimerDisplay() {
  if (userSelectedDate > new Date()) {
    startButton.disabled = true;
    datetime.disabled = true;
    const currentDate = new Date();
    const timeLeft = userSelectedDate - currentDate;
    if (timeLeft <= 0) {
      datetime.disabled = false;
      userSelectedDate = null;
      timerInterval && clearInterval(timerInterval);
      return;
    }
    const { days, hours, minutes, seconds } = convertMs(timeLeft);

    const daysElement = sessionStorage.getItem('days') || document.querySelector('[data-days]');
    const hoursElement = sessionStorage.getItem('hours') || document.querySelector('[data-hours]');
    const minutesElement = sessionStorage.getItem('minutes') || document.querySelector('[data-minutes]');
    const secondsElement = sessionStorage.getItem('seconds') || document.querySelector('[data-seconds]');

    sessionStorage.setItem('days', daysElement);
    sessionStorage.setItem('hours', hoursElement);
    sessionStorage.setItem('minutes', minutesElement);
    sessionStorage.setItem('seconds', secondsElement);

    daysElement.textContent = days
      .toString()
      .padStart(2, '0');
    hoursElement.textContent = hours
      .toString()
      .padStart(2, '0');
    minutesElement.textContent = minutes
      .toString()
      .padStart(2, '0');
    secondsElement.textContent = seconds
      .toString()
      .padStart(2, '0');
  }
}
