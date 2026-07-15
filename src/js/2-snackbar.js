import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

function promiseGenerator(delay, state) {
  return new Promise((resolve, reject) => {
    console.log(`Promise ${state} after ${delay}ms`);
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(state);
      } else {
        reject(state);
      }
    }, parseInt(delay));
  });
}

const formElement = document.querySelector('.form');
formElement.addEventListener('submit', event => {
  event.preventDefault();
  const formData = new FormData(formElement);
  const delay = formData.get('delay');
  if (!delay || parseInt(delay) < 0) {
    iziToast.error({
      title: 'Error',
      message: 'Invalid delay value',
      timeout: 4000,
    });
    return;
  }

  const state = formData.get('state');
  const promise = promiseGenerator(delay, state);
  formElement.reset();
  promise
    .then(state => {
      iziToast.success({
        title: 'Notification',
        message: `✅ Fulfilled promise in ${delay}ms`,
        timeout: 4000,
      });
    })
    .catch(state => {
      iziToast.error({
        title: 'Notification',
        message: `❌ Rejected promise in ${delay}ms`,
        timeout: 4000,
      });
    });
});
