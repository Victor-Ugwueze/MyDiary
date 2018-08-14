/* global validateInput, displayUserdetails, getFormInput, makeNetworkRequest */


class SettingsClient {
  static init() {
    SettingsClient.updateProfile();
    SettingsClient.changePassword();
  }

  static updateProfile() {
    const form = document.querySelector('#update-profiele');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const url = 'https://my-diary-dev.herokuapp.com/api/v1/users/profile';
      const data = getFormInput(event.target);
      const errors = validateInput(data);
      if (Object.entries(errors).length > 0) {
        // showErrors(Object.entries(errors), 'updateProfile');
        return;
      }
      const token = SettingsClient.checkToken();
      data.token = token;
      const method = 'put';
      makeNetworkRequest({ url, method, data })
        .then((response) => {
          if (response.status === 'Success') {
            displayUserdetails(response);
          } else {
            // showErrors(response, 'updateResponse');
          }
        })
        .catch(() => {
          // const errorMeaage = { message: `${err.message},
          // please check your network connection and try again` };
          // showErrors(errorMeaage, 'loginResponse');
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
      makeNetworkRequest({ url, method, data })
        .then()
        .catch(() => {
          /* const errorMeaage = { message: `${err.message},
           please check your network connection and try again` };
          */
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
SettingsClient.init();
