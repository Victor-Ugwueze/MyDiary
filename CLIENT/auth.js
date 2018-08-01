
const redirect = (response) => {
  if (response.token) {
    localStorage.setItem('token', response.token);
    window.location.href = 'dashboard.html';
  }
};

const hideErrors = () => {
  [...document.querySelectorAll('.errors')]
    .forEach((inputField) => {
      inputField.nextElementSibling.addEventListener('focus', (event) => {
        inputField.classList.toggle('show');
        event.target.classList.toggle('input-error-border');
      });
    });
};

const showErrors = (errors, action) => {
  // const errorFlag = document.querySelector('#erro-flag');
  const emailError = document.querySelector('#email-error');
  if (action === 'login') {
    if (errors.email) {
      emailError.textContent = errors.email;
      const inputField = emailError.nextElementSibling;
      inputField.classList.toggle('input-error-border');
      hideErrors();
    }
  }
  if (action === 'response') {
    emailError.textContent = errors.message;
  }
};


const MakeNetworkRequest = (input = { url: '', method: '', data: '' }) => {
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
    .then(response => response.json())
    .catch(err => err);
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

const validateInput = (data) => {
  const errors = {};
  const fields = [
    { email: data.email },
    { password: data.password },
    { firstName: data.firstName },
    { lastName: data.lastName },
    { confirmPassword: data.confirmPassword },
  ];
  fields.forEach((input, index) => {
    const key = Object.keys(input)[0];
    if (input[key] === '') {
      errors[key] = `${key} can't be empty`;
    }
    if (input[key] && key === 'email') {
      /* This regex test for email is from
          https://forum.freecodecamp.org/t/regular-expression-is-stupid-help/100055/9
      */
      const regex = /^[\w.]+\w+@\w+\.com(\.(ru|cn))?$/;
      if (!regex.test(input[key])) {
        errors[key] = `Please enter a valid ${key}`;
      }
    }
  });
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
      if (errors.length > 0) {
        showErrors(errors, 'login');
        return;
      }
      const method = 'post';
      MakeNetworkRequest({ url, method, data })
        .then((response) => {
          if (response.message === 'success') {
            redirect(response);
          } else {
            showErrors(response, 'response');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  static doSingup() {
    // Login or sign up should redirect to dashboard
    const form = document.querySelector('#signup');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const url = 'https://my-diary-dev.herokuapp.com/auth/signup';
      const data = getFormInput(event.target);
      const errors = validateInput(data);
      if (errors.length > 0) {
        showErrors(errors);
        return;
      }
      const method = 'post';
      MakeNetworkRequest({ url, method, data })
        .then((response) => {
          if (response.status === 200 && response.message === 'success') {
            // redirect(response);
            console.log(response);
          } else {
            console.log(response);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
}
AuthClient.init();
