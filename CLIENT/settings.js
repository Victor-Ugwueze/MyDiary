/* global makeNetworkRequest,
showResponse,
showErrors,
SelectElement,
showPageContent,
loadingIndicator */

const loadingIndicator = document.querySelector('.loading-indicator');

const displaySettings = (response) => {
  const journalCheckBox = document.querySelector('#reminder-journal');
  const newsletterCheckBox = document.querySelector('#receive-newsletter');
  const userSettings = response.notifications;
  userSettings.forEach((settings) => {
    if (settings.title === 'journal') {
      journalCheckBox.checked = settings.reminder || '';
    } else {
      newsletterCheckBox.checked = settings.reminder || '';
    }
  });
};

class SettingsClient {
  static init() {
    const settingsMenu = document.querySelector('.settings-page');
    const updateReminderSettings = document.querySelectorAll('.email-subscribe-update');
    settingsMenu.addEventListener('click', SettingsClient.getUserSettings);
    [...updateReminderSettings].forEach((checkBox) => {
      checkBox.addEventListener('click', SettingsClient.updateReminder);
    });
    // SettingsClient.updateProfile();
    // SettingsClient.changePassword();
  }

  static getUserSettings() {
    const url = '/api/v1/settings/notifications';
    const token = SettingsClient.checkToken();
    const data = {};
    data.token = token;
    const method = 'get';
    loadingIndicator.style.display = 'block';
    makeNetworkRequest({ url, method, data })
      .then((response) => {
        if (response.status === 'Success') {
          displaySettings(response);
        } else {
          showErrors(response, 'updateResponse');
        }
        showPageContent('settings');
        loadingIndicator.style.display = 'none';
      })
      .catch((err) => {
        const errorMeaage = {
          message: `${err.message},
          please check your network connection and try again`,
        };
        loadingIndicator.style.display = 'none';
        showErrors(errorMeaage, 'updateResponse');
      });
  }

  static updateReminder(event) {
    const indicator = event.target.nextElementSibling;
    SelectElement(indicator, null, 'show-inline');
    const token = SettingsClient.checkToken();
    const data = {};
    const title = event.target.id.split('-')[1];
    const reminder = event.target.checked;

    data.token = token;
    data.title = title;
    data.reminder = reminder;
    const url = '/api/v1/settings/notifications';
    const method = 'put';
    makeNetworkRequest({ url, method, data })
      .then((response) => {
        if (response.status === 'Success') {
          showResponse('success-flash', response.message);
        } else {
          showResponse('error-flash', response.message);
        }
        SelectElement(indicator, null, 'show-inline');
      })
      .catch((err) => {
        SelectElement(indicator, null, 'show-inline');
        const errorMeaage = { message: `${err.message},please check your network connection and try again` };
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
