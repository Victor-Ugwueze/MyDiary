/* global validateInput,
displayUserdetails,
getFormInput,
SelectElement,
hideErrors,
makeNetworkRequest,
modal,
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
    const form = document.querySelector('#update-profile');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const url = '/api/v1/users/profile';
      const data = getFormInput(event.target);
      const errors = validateInput(data);
      if (Object.entries(errors).length > 0) {
        showErrors(Object.entries(errors), 'update-profile');
        return;
      }
      const token = ProfileClient.checkToken();
      data.token = token;
      const indicator = event.currentTarget.querySelector('.saving-settings-indicator');
      SelectElement(indicator, null, 'show-inline');
      const method = 'put';
      makeNetworkRequest({ url, method, data })
        .then((response) => {
          if (response.status === 'Success') {
            displayUserdetails(response);
            showResponse('success-flash', response.message);
          } else {
            showResponse('error-flash', response.message);
          }
          SelectElement(indicator, null, 'show-inline');
        })
        .catch((err) => {
          const errorMeaage = { message: `${err.message}, please check your network connection and try again` };
          showErrors(errorMeaage, 'loginResponse');
          SelectElement(indicator, null, 'show-inline');
        });
    });
  }

  static changePassword() {
    const form = document.querySelector('#change-password');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const url = '/api/v1/users/profile/password';
      const data = getFormInput(event.target);
      const errors = validateInput(data);
      if (Object.entries(errors).length > 0) {
        // const errorFlag = document.querySelector('#');
        showErrors(Object.entries(errors), 'update-password');
        return;
      }
      const token = ProfileClient.checkToken();
      data.token = token;
      const indicator = event.currentTarget.querySelector('.saving-settings-indicator');
      SelectElement(indicator, null, 'show-inline');
      const method = 'put';
      const passwordModal = event.target.parentNode.parentNode;
      makeNetworkRequest({ url, method, data })
        .then((response) => {
          if (response.status === 'Success') {
            modal.hide(passwordModal, 'show');
            event.target.reset();
            showResponse('success-flash', response.message);
          } else {
            modal.hide(passwordModal, 'show');
            showResponse('error-flash', response.message);
          }
          SelectElement(indicator, null, 'show-inline');
        })
        .catch((err) => {
          SelectElement(indicator, null, 'show-inline');
          const errorMeaage = { message: `${err.message}, please check your network connection and try again` };
          modal.hide(passwordModal, 'show');
          showResponse('error-flash', errorMeaage.message);
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
