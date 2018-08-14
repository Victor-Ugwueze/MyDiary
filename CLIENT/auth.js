/* global  getFormInput, validateInput, makeNetworkRequest, hideErrors */

const redirect = (response) => {
  if (response.token) {
    localStorage.setItem('token', response.token);
    window.location.href = 'dashboard.html';
  }
};

const loadingIndicator = document.querySelector('.loading-indicator');

const showErrors = (errors, action) => {
  // const errorFlag = document.querySelector('#erro-flag');
  const loginErrorFlag = document.querySelector('#email-error');
  const singupErrorFlag = document.querySelector('#signup-error');
  if (action === 'login') {
    const fieldError = errors[0][1];
    loginErrorFlag.textContent = fieldError;
    loginErrorFlag.classList.remove('hide-error');
    loginErrorFlag.classList.add('show-error');
    const inputField = document.querySelector(`#login input[name=${errors[0][0]}]`);
    inputField.classList.add('input-error-border');
    hideErrors('login', inputField, loginErrorFlag);
  } else if (action === 'signup') {
    const fieldError = errors[0][1];
    singupErrorFlag.textContent = fieldError;
    singupErrorFlag.classList.remove('hide-error');
    singupErrorFlag.classList.add('show-error');
    const inputField = document.querySelector(`#signup input[name=${errors[0][0]}]`);
    inputField.classList.add('input-error-border');
    hideErrors('signup', inputField, singupErrorFlag);
  }
  if (action === 'loginResponse') {
    loginErrorFlag.classList.remove('hide-error');
    loginErrorFlag.classList.add('show-error');
    loginErrorFlag.textContent = errors.message;
  }
  if (action === 'singupResponse') {
    singupErrorFlag.classList.remove('hide-error');
    singupErrorFlag.classList.add('show-error');
    singupErrorFlag.textContent = errors.message;
  }
};


class AuthClient {
  static init() {
    AuthClient.doSingup();
    AuthClient.doLogin();
  }

  static doLogin() {
    const form = document.querySelector('#login');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const url = 'https://my-diary-dev.herokuapp.com/auth/login';
      const data = getFormInput(event.target);
      const errors = validateInput(data, 'login');
      if (Object.entries(errors).length > 0) {
        showErrors(Object.entries(errors), 'login');
        return;
      }
      loadingIndicator.style.display = 'block';
      const method = 'post';
      makeNetworkRequest({ url, method, data })
        .then((response) => {
          loadingIndicator.style.display = 'none';
          if (response.status === 'success') {
            redirect(response);
          } else {
            console.log(response);
            showErrors(response, 'loginResponse');
          }
        })
        .catch((err) => {
          loadingIndicator.style.display = 'none';
          console.log(err);
          const errorMeaage = { message: `${err.message}, please check your network connection and try again` };
          showErrors(errorMeaage, 'loginResponse');
        });
    });
  }

  static doSingup() {
    const form = document.querySelector('#signup');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const url = 'https://my-diary-dev.herokuapp.com/auth/signup';
      const data = getFormInput(event.target);
      const errors = validateInput(data);

      if (Object.entries(errors).length > 0) {
        showErrors(Object.entries(errors), 'signup');
        return;
      }
      const method = 'post';
      makeNetworkRequest({ url, method, data })
        .then((response) => {
          if (response.status === 'success') {
            redirect(response);
          } else {
            console.log(response);
            showErrors(response, 'singupResponse');
          }
        })
        .catch((err) => {
          console.log(err);
          const errorMeaage = { message: `${err.message}, please check your network connection and try again` };
          showErrors(errorMeaage, 'singupResponse');
        });
    });
  }
}
AuthClient.init();
