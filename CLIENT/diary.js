/* global SelectElement, modal */

// Function used to make network request
const makeNetworkRequest = (input = { url: '', method: '', data: '' }) => {
  const reqObject = {
    method: input.method,
    mode: 'cors',
  };
  if (input.method === 'get' || input.method === 'delete') {
    reqObject.headers = {
      'content-type': 'application/json',
      'x-access-token': input.data.token,
      page: 1,
      perPage: 5,
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


const spinner = document.querySelector('.loading_spinner');
const spinnerEdit = document.querySelector('.loading_spinner_edit');


// Populate Edit button
const populateModalFoEdit = (targetEditButton, editModal) => {
  DiaryClient.getSingleEntry(targetEditButton.dataset.id.split('-')[1])
    .then((entry) => {
      // get refrence to modal and ppulate conten
      const editModalTitle = editModal.querySelector('#diary-title');
      const editModalBody = editModal.querySelector('#diary-body');
      const entryInputId = editModal.querySelector('#entry-id');
      editModalTitle.value = entry.dairyEntry.title;
      editModalBody.textContent = entry.dairyEntry.body;
      entryInputId.value = entry.dairyEntry.id;
    });
};

// Edit Diary Add Event Method
const addEventListenerToEditButton = () => {
  const editButtons = document.querySelectorAll('.action-edit');
  [...editButtons].forEach((editButton) => {
    editButton.addEventListener('click', (event) => {
      const editDiaryModal = document.querySelector(`#${event.currentTarget.dataset.target}`);
      SelectElement(editDiaryModal, null, 'show');
      populateModalFoEdit(event.currentTarget, editDiaryModal);
    });
  });
};

// show a single Diary Entry
const showDiaryEntry = (containerDiv) => {
  const itemId = (containerDiv.dataset.id).split('-')[1];
  const viewEntryModal = document.querySelector(`#${containerDiv.dataset.target}`);
  // get refrence to elements
  const titleContainer = viewEntryModal.querySelector('#diary-content h4');
  const bodyContainer = viewEntryModal.querySelector('#diary-content #body');
  const dateContainer = viewEntryModal.querySelector('.date');
  DiaryClient.getSingleEntry(itemId)
    .then((response) => {
      console.log(dateContainer);
      titleContainer.textContent = response.dairyEntry.title;
      bodyContainer.textContent = response.dairyEntry.body;
      dateContainer.textContent = new Date(response.dairyEntry.created_at).toDateString();
    })
    .catch(() => {

    });

  modal.show(viewEntryModal, 'show');
};

const addEventListenerToviewEntry = () => {
  const showDiaryEntryClicks = document.querySelectorAll('.diary-text');
  [...showDiaryEntryClicks].forEach((showEntryButton) => {
    showEntryButton.addEventListener('click', (event) => {
      showDiaryEntry(event.target.parentNode);
    });
  });
};

// Edit functionality block

//            Delete a modal Entry

const deleteModalItem = (targetDeleteButton) => {
  const diaryList = document.querySelector('#dairy-entries');
  const confirmDeleteBox = document.querySelector('#confirm-delete');
  const confirmDeleteButton = confirmDeleteBox.querySelector('.dailog-ok');
  const entryId = targetDeleteButton.dataset.target.split('-')[1];
  modal.show(confirmDeleteBox, 'show');
  confirmDeleteButton.addEventListener('click', () => {
    const diaryItem = diaryList.querySelector(`#${targetDeleteButton.dataset.target}`);
    DiaryClient.deleteEntry(entryId)
      .then((response) => {
        diaryItem.style.display = 'none';
      })
      .catch((err) => {
        console.log(err);
      });
    modal.hide(confirmDeleteBox, 'show');
  });
};
const addEventListenerToDeleteButton = () => {
  const deleteEntryButtons = document.querySelectorAll('.action-delete');
  [...deleteEntryButtons].forEach((deleteEntryButton) => {
    deleteEntryButton.addEventListener('click', (event) => {
      deleteModalItem(event.currentTarget);
    });
  });
};
const displayUserdetails = (userDetails) => {
  const detailsContainer = document.querySelector('.profile-details');
  const firstName = detailsContainer.querySelector("input[name='firstName']");
  const lasttName = detailsContainer.querySelector("input[name='lastName']");
  const email = detailsContainer.querySelector("input[name='email']");
  const location = detailsContainer.querySelector("input[name='location']");
  const joinedDate = document.querySelector('#date-registered');
  const menuFirstName = document.querySelector('#menu-firstname');

  joinedDate.textContent = new Date(userDetails.user.created_at).toDateString();
  firstName.value = userDetails.user.first_name;
  menuFirstName.textContent = userDetails.user.first_name;
  lasttName.value = userDetails.user.last_name;
  email.value = userDetails.user.email;
  location.value = userDetails.user.location;
  spinner.style.display = 'none';
};


class DiaryClient {
  static init() {
    document.querySelector('#add-entry-form')
      .addEventListener('submit', DiaryClient.addEntry);
    document.querySelector('#edit-diary-entry-form')
      .addEventListener('submit', DiaryClient.updateEntry);
    document.querySelector('#logout')
      .addEventListener('click', DiaryClient.logout);
    [...document.querySelectorAll('.prof-page')]
      .forEach((profilemenu) => {
        profilemenu.addEventListener('click', DiaryClient.getUserDetails);
      });
    DiaryClient.getAllEntries();
  }

  static logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  }

  static getAllEntries() {
    spinner.style.display = 'block';
    const token = DiaryClient.checkToken();
    const method = 'get';
    const url = 'https://my-diary-dev.herokuapp.com/api/v1/entries';
    const data = {
      token,
    };
    makeNetworkRequest({ url, method, data })
      .then((response) => {
        console.log(response);
        //  updatePaginate(response);
        if (response.err === 'Session expired') {
          DiaryClient.logout();
        }
        displayListEntries(response);
        addEventListenerToEditButton();
        addEventListenerToviewEntry();
        addEventListenerToDeleteButton();
        DiaryClient.getUserDetails('main');
        spinner.style.display = 'none';
      })
      .catch((err) => {
        console.log(err);
        spinner.style.display = 'none';
      });
  }

  static addEntry(event) {
    const addEntryModal = document.querySelector('#add-new-entry');
    addEntryModal.classList.toggle('show');
    event.preventDefault();
    const inputData = new FormData(event.target);
    const title = inputData.get('title');
    const body = inputData.get('body');
    // console.log(body);
    // /^[0-9]+$/
    const regx = /^[0-9]/;
    if (title === '' || regx.test(title) || regx.test(body) || body === '') {
      console.log('yes');
      return;
    }
    const token = DiaryClient.checkToken();
    const method = 'post';
    const url = 'https://my-diary-dev.herokuapp.com/api/v1/entries';
    const data = {
      token,
      title,
      body,
    };
    makeNetworkRequest({ url, method, data })
      .then((response) => {
        if (response.message === 'success') {
          console.log(response);
          window.location.reload();
        }
      })
      .catch(err => err);
  }

  static deleteEntry(id) {
    const token = DiaryClient.checkToken();
    const method = 'delete';
    const url = `https://my-diary-dev.herokuapp.com/api/v1/entries/${id}`;
    const data = {
      token,
    };
    return makeNetworkRequest({ url, method, data })
      .then((response) => {
        if (response.message === 'success') {
          return response;
        }
      })
      .catch(err => err);
  }

  static getSingleEntry(id) {
    spinnerEdit.style.display = 'block';
    const token = DiaryClient.checkToken();
    const method = 'get';
    const url = `https://my-diary-dev.herokuapp.com/api/v1/entries/${id}`;
    const data = {
      token,
    };
    return makeNetworkRequest({ url, method, data })
      .then((response) => {
        if (response.status === 'success') {
          spinnerEdit.style.display = 'none';
          return response;
        }
      })
      .catch((err) => {
        spinnerEdit.style.display = 'none';
        return err;
      });
  }

  static updateEntry(event) {
    const addEntryModal = document.querySelector('#edit-diary-entry');
    addEntryModal.classList.toggle('show');
    event.preventDefault();
    const form = new FormData(event.target);
    const id = form.get('entry-id');
    const title = form.get('title');
    const body = form.get('body');
    const regx = /^[0-9]/;
    if (title === '' || regx.test(title) || regx.test(body) || body === '') {
      console.log('yes');
      return;
    }
    const token = DiaryClient.checkToken();
    const method = 'put';
    const url = `https://my-diary-dev.herokuapp.com/api/v1/entries/${id}`;
    const data = {
      token,
      title,
      body,
    };
    makeNetworkRequest({ url, method, data })
      .then((response) => {
        if (response.message === 'success') {
          window.location.reload();
        }
      })
      .catch(err => err);
  }

  static checkToken() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'index.html';
      return null;
    }
    return token;
  }

  static getUserDetails(page) {
    if (page !== 'main') {
      spinner.style.display = 'block';
    }
    const token = DiaryClient.checkToken();
    const method = 'get';
    const url = 'https://my-diary-dev.herokuapp.com/api/v1/users/profile';
    const data = {
      token,
    };
    makeNetworkRequest({ url, method, data })
      .then((response) => {
        if (response.status === 'Success') {
          if (page === 'main') {
            const menuFirstName = document.querySelector('#menu-firstname');
            menuFirstName.textContent = response.user.first_name;
          } else {
            displayUserdetails(response);
          }
          DiaryClient.getNumberEntriesCeated(page);
        }
      })
      .catch(err => err);
  }

  static getNumberEntriesCeated(page) {
    const token = DiaryClient.checkToken();
    const method = 'get';
    const url = 'https://my-diary-dev.herokuapp.com/api/v1/users/profile/entries';
    const data = {
      token,
    };
    makeNetworkRequest({ url, method, data })
      .then((response) => {
        if (response.status === 'Success') {
          console.log(response);
          const showEntryCount = document.querySelector('#entries_created');
          if (page !== 'main') {
            if (response.entries > 1) {
              showEntryCount.textContent = ` You have created ${response.entries} entries`;
            } else if (response.entries === 1) {
              showEntryCount.textContent = ` You have created ${response.entries} entry`;
            } else {
              showEntryCount.innerHTML = `You haven't created an entry, <br> 
              Start creating entry now.`;
            }
          }
        }
      })
      .catch(err => err);
  }
}


const bindEntryData = (entry) => {
  let EntryTitle = entry.title;
  let EntryBody = entry.body;
  if (entry.title.length > 40) {
    EntryTitle = `${entry.title.substring(0, 40)} ...`;
  }
  if (entry.body.length > 40) {
    EntryBody = `${entry.body.substring(0, 40)} ...`;
  }
  const entryWrap = `<li class="entry-item" id="diary-${entry.id}">
                      <div class="" data-id="diary-${entry.id}" data-target="view-single-diary">
                          <h4 class="sing-diary-title diary-text">${EntryTitle}</h4>
                          <p class="sing-diary-body diary-text">${EntryBody}</p>
                      </div>
                      <p class="created-at">${entry.created_at}</p>
                      <a class="action">
                        <span data-id="diary-${entry.id}" data-target="edit-diary-entry" class="btn btn-primary action-edit">
                          <img class="diary-edit icon-edit" src="Resources/images/edit.png">
                          <span class="edit-text">Edit</span>
                        </span>
                         | 
                        <span data-target="diary-${entry.id}" class="btn btn-danger action-delete">
                          <img class="diary-edit icon-edit" src="Resources/images/delete-button.png">
                          <span class="delete-text">Delete</span>
                        </span>
                      </a>
                      <div class="arrow-up"></div>
                  </li>`;
  return entryWrap;
};

const displayListEntries = (response) => {
  const listContainer = document.querySelector('#dairy-entries');
  response.entries.forEach((element) => {
    listContainer.innerHTML += (bindEntryData(element));
  });
};
// Add EventListener to element after loading


DiaryClient.init();
