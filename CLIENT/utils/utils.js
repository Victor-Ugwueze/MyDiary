
const makeNetworkRequest = (input = { url: '', method: '', data: '' }) => {
  const serverErrors = [404, 400, 401, 422, 419, 200, 201];
  const reqObject = {
    method: input.method,
    mode: 'cors',
    headers: {
      'content-type': 'application/json',
      'x-access-token': input.data.token,
    },
  };
  if (input.method === 'post' || input.method === 'put') {
    reqObject.body = JSON.stringify(input.data);
  }
  return fetch(input.url, reqObject)
    .then((response) => {
      if (serverErrors.indexOf(response.status) === -1) {
        throw new Error(response);
      } else {
        console.log(response);
        return response.json();
      }
    })
    .catch((err) => {
      console.log(err.message);
      throw new Error('Problem loading request');
    });
};

const hideErrors = (form, inputField, errorFlag) => {
  inputField.addEventListener('focus', (event) => {
    errorFlag.classList.add('hide-error');
    event.target.classList.remove('input-error-border');
  });
};

const showResponse = (action, message) => {
  const responseFlash = document.querySelector(`.${action}`);
  responseFlash.classList.remove('hide-error');
  responseFlash.classList.add('show-error');
  responseFlash.textContent = message;
  setTimeout(() => {
    responseFlash.classList.add('hide-error');
  }, 5000);
};
