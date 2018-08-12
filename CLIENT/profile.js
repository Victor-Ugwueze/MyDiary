/* global validateInput, displayUserdetails, hideErrors, getFormInput */


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

const MakeNetworkRequest = (input = { url: '', method: '', data: '' }) => {
  const serverErrors = [404, 400, 401, 422, 419, 200, 201];
  const loadingIndicator = document.querySelector('.loading_spinner');
  loadingIndicator.style.display = 'block';
  const reqObject = {
    method: input.method,
    mode: 'cors',
    headers: {
      'content-type': 'application/json',
      'x-access-token': input.data.token,
    },
    body: JSON.stringify(input.data),
  };

  return fetch(input.url, reqObject)
    .then((response) => {
      loadingIndicator.style.display = 'none';
      if (serverErrors.indexOf(response.status) === -1) {
        throw new Error(response);
      } else {
        console.log(response);
        return response.json();
      }
    })
    .catch((err) => {
      console.log(err.message);
      loadingIndicator.style.display = 'none';
      throw new Error('Problem loading request');
    });
};


class ProfileClient {
  static init() {
    ProfileClient.updateProfile();
    ProfileClient.changePassword();
  }

  static updateProfile() {
    const form = document.querySelector('#update-profiele');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const url = 'https://my-diary-dev.herokuapp.com/api/v1/users/profile';
      const data = getFormInput(event.target);
      const errors = validateInput(data);
      if (Object.entries(errors).length > 0) {
        showErrors(Object.entries(errors), 'updateProfile');
        return;
      }
      const token = ProfileClient.checkToken();
      data.token = token;
      const method = 'put';
      MakeNetworkRequest({ url, method, data })
        .then((response) => {
          if (response.status === 'Success') {
            displayUserdetails(response);
          } else {
            showErrors(response, 'updateResponse');
          }
        })
        .catch((err) => {
          const errorMeaage = { message: `${err.message}, please check your network connection and try again` };
          showErrors(errorMeaage, 'loginResponse');
        });
    });
  }

  static changePassword() {
    const form = document.querySelector('#change-password');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const url = 'https://my-diary-dev.herokuapp.com/api/v1/users/profile/password';
      const data = getFormInput(event.target);
      const errors = validateInput(data);
      if (Object.entries(errors).length > 0) {
        // showErrors(Object.entries(errors), 'signup');
        return;
      }
      const method = 'post';
      MakeNetworkRequest({ url, method, data })
        .then((response) => {
          if (response.status === 'success') {
            // redirect(response);
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

  static checkToken() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'index.html';
      return null;
    }
    return token;
  }
}
ProfileClient.init();
