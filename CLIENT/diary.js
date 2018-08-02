/* global SelectElement */

const spinner = document.querySelector('.loading_spinner');

// Populate Edit button
const populateModalFoEdit = (targetEditButton, EditModal) => {
  DiaryClient.getSingleEntry(targetEditButton.dataset.id.split('-')[1])
    .then((entry) => {
      // get refrence to modal and ppulate conten
      const editModalTitle = EditModal.querySelector('#diary-title');
      const editModalBody = EditModal.querySelector('#diary-body');
      const entryInputId = EditModal.querySelector('#entry-id');
      editModalTitle.value = entry.result.title;
      editModalBody.textContent = entry.result.body;
      entryInputId.value = entry.result.id;
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
  const bodyContainer = viewEntryModal.querySelector('#diary-content p');
  const dateContainer = viewEntryModal.querySelector('.date');
  DiaryClient.getSingleEntry(itemId)
    .then((response) => {
      titleContainer.textContent = response.result.title;
      bodyContainer.textContent = response.result.body;
      dateContainer.textContent = new Date(response.result.created_at).toDateString();
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
class DiaryClient {
  static init() {
    document.querySelector('#add-entry-form')
      .addEventListener('submit', DiaryClient.addEntry);
    document.querySelector('#edit-diary-entry-form')
      .addEventListener('submit', DiaryClient.updateEntry);
    // document.querySelector('.get-profile')
    DiaryClient.getAllEntries();
  }

  static getAllEntries() {
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
        displayListEntries(response);
        addEventListenerToEditButton();
        addEventListenerToviewEntry();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static addEntry(event) {
    event.preventDefault();
    const inputData = new FormData(event.target);
    const title = inputData.get('title');
    const body = inputData.get('body');
    if (title === '') {
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

  static getSingleEntry(id) {
    const token = DiaryClient.checkToken();
    const method = 'get';
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

  static updateEntry(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const id = form.get('entry-id');
    const title = form.get('title');
    const body = form.get('body');
    if (title === '') {
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
}


const makeNetworkRequest = (input = { url: '', method: '', data: '' }) => {
  spinner.style.display = 'block';
  const reqObject = {
    method: input.method,
    mode: 'cors',
  };
  if (input.method === 'get') {
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
    .then((response) => {
      spinner.style.display = 'none';
      return response.json();
    })
    .catch(err => err);
};


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
                      <p class="created-at">12/18/2018</p>
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
