/* global validateInput,
displayUserdetails,
getFormInput,
makeNetworkRequest,
showResponse */


const showErrors = (errors, action) => {
  // const errorFlag = document.querySelector('#erro-flag');
  const singupErrorFlag = document.querySelector(`#${action} .errors`);
  const fieldError = errors[0][1];
  singupErrorFlag.textContent = fieldError
    .replace('lastName', 'Last Name')
    .replace('firstName', 'First Name');
  singupErrorFlag.classList.remove('hide-error');
  singupErrorFlag.classList.add('show-error');
  const inputField = document.querySelector(`input[name=${errors[0][0]}]`);
  inputField.classList.add('input-error-border');
  hideErrors('change-password', inputField, singupErrorFlag);
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
        showErrors(Object.entries(errors), 'update-profiele');
        return;
      }
      const token = ProfileClient.checkToken();
      data.token = token;
      const method = 'put';
      makeNetworkRequest({ url, method, data })
        .then((response) => {
          if (response.status === 'Success') {
            displayUserdetails(response);
            showResponse('success-flash', response.message);
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
        // const errorFlag = document.querySelector('#');
        showErrors(Object.entries(errors), 'update-password');
        return;
      }
      const method = 'put';
      makeNetworkRequest({ url, method, data })
        .then((response) => {
          if (response.status === 'success') {
            showResponse('success-flash', response.message);
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
