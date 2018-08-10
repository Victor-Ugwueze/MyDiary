
const redirect = (response) => {
  if (response.token) {
    localStorage.setItem('token', response.token);
    window.location.href = 'dashboard.html';
  }
};

const hideErrors = (form, inputField, errorFlag) => {
  inputField.addEventListener('focus', (event) => {
    errorFlag.classList.add('hide-error');
    event.target.classList.remove('input-error-border');
  });
};

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
  const loadingIndicator = document.querySelector('.loading-indicator');
  loadingIndicator.style.display = 'block';
  const reqObject = {
    method: input.method,
    mode: 'cors',
  };

  if (input.method === 'get') {
    reqObject.headers = {
      'content-type': 'application/json',
      'x-access-token': input.data.token,
    };
  } else {
    reqObject.headers = {
      'content-type': 'application/json',
    };
    reqObject.body = JSON.stringify(input.data);
  }
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

const getFormInput = (input, action) => {
  const formInput = new FormData(input);
  const data = {
    firstName: formInput.get('firstName'),
    lastName: formInput.get('lastName'),
    email: formInput.get('email'),
    password: formInput.get('password'),
    confirmPassword: formInput.get('confirmPassword'),
    action,
  };
  return data;
};

const validateEmail = (email) => {
  /* This regex test for email is from
          https://forum.freecodecamp.org/t/regular-expression-is-stupid-help/100055/9
  */
  const regex = /^[\w.]+\w+@\w+\.com(\.(ru|cn))?$/;
  if (!regex.test(email)) return false;
  return true;
};

const validateInput = (data) => {
  const errors = {};
  const fields = [
    { firstName: data.firstName },
    { lastName: data.lastName },
    { email: data.email },
    { password: data.password },
    { confirmPassword: data.confirmPassword },
  ];
  fields.forEach((input) => {
    const key = Object.keys(input)[0];
    if (input[key] === '' && key !== 'confirmPassword') {
      errors[key] = `${key} can't be empty`;
    }
    if (input[key] && key === 'email') {
      if (!validateEmail(input[key])) {
        errors[key] = `Please enter a valid ${key}`;
      }
    }
    if (input[key] && key === 'firstName' && input[key].length < 2) {
      errors[key] = `Please ${key} should be 2 characters and above`;
    }
    if (input[key] && key === 'lastName' && input[key].length < 2) {
      errors[key] = `Please ${key} should be 2 characters and above`;
    }
    if (input[key] === 'password' && input[key].length < 2) {
      errors[key] = `Please enter a valid ${key}`;
    }
  });
  if (fields[3].password !== fields[4].confirmPassword && fields[4].confirmPassword) {
    errors.password = "password dosen't match";
  }
  return errors;
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
      const errors = validateInput(data);
      if (Object.entries(errors).length > 0) {
        showErrors(Object.entries(errors), 'login');
        return;
      }
      const method = 'post';
      MakeNetworkRequest({ url, method, data })
        .then((response) => {
          if (response.message === 'success') {
            redirect(response);
          } else {
            console.log(response);
            showErrors(response, 'loginResponse');
          }
        })
        .catch((err) => {
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
      MakeNetworkRequest({ url, method, data })
        .then((response) => {
          if (response.message === 'success') {
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
