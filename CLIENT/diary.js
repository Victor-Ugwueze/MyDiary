/* global SelectElement, modal, makeNetworkRequest, showResponse, showErrors */

// Function used to make network request


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
      editModalBody.value = entry.dairyEntry.body;
      entryInputId.value = entry.dairyEntry.id;
    });
};

const updateEntryView = (entry) => {
  const { entryTitle, entryBody } = getMaxEntryLenght(entry);
  const entryToUpdate = document.querySelector(`#diary-${entry.id}`);
  const title = entryToUpdate.querySelector('.sing-diary-title');
  const body = entryToUpdate.querySelector('.sing-diary-body');
  title.textContent = entryTitle;
  body.textContent = entry.body;
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
        showResponse('success-flash', response.message);
        window.location.reload();
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

const addNewEntryToList = (element) => {
  const html = bindEntryData(element);
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  const newItem = template.content.firstChild;
  const list = document.querySelector('#dairy-entries');
  list.insertBefore(newItem, list.childNodes[0]);
  addEventListenerToEditButton();
  addEventListenerToviewEntry();
  addEventListenerToDeleteButton();
};
const validateEntry = (title, body) => {
  const errors = [];
  if (title === '') {
    errors.push({ message: 'Entry title should not be empty' });
  } else if (body === '') {
    errors.push({ message: 'Entry body should not be empty' });
  }
  if (title.trim().length < 6) {
    errors.push({ message: 'Entry title should be 6 characters or more' });
  }
  if (body.trim().length < 6) {
    errors.push({ message: 'Entry body should be 6 characters or more' });
  }
  const regx = /^[0-9]/;
  if (regx.test(title)) {
    errors.push({ message: 'Entry title should not be digits' });
  }
  if (regx.test(body)) {
    errors.push({ message: 'Entry body should not be digits' });
  }
  return errors;
};
const clearEntryModal = (modal) => {
  const errorFlag = modal.querySelector('.error-flash');
  const titleInput = modal.querySelector("input[name='title']");
  const titleBody = modal.querySelector("textarea[name='body']");
  titleInput.value = '';
  titleBody.value = '';
  errorFlag.classList.add('hide-error');
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
    DiaryClient.getAllEntries(1, 'paginate');
  }

  static logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  }

  static getAllEntries(currentPage, action) {
    spinner.style.display = 'block';
    const token = DiaryClient.checkToken();
    const method = 'get';
    const url = `/api/v1/entries?page=${currentPage}&perPage=${3}`;
    const data = {
      token,
    };
    return makeNetworkRequest({ url, method, data })
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
        DiaryClient.getUserDetails('main', action);
        spinner.style.display = 'none';
        return true;
      })
      .catch((err) => {
        console.log(err);
        spinner.style.display = 'none';
      });
  }

  static addEntry(event) {
    const addEntryModal = document.querySelector('#add-new-entry');
    event.preventDefault();
    const inputData = new FormData(event.target);
    const title = inputData.get('title');
    const body = inputData.get('body');
    const errors = validateEntry(title, body);
    if (errors.length > 0) {
      showErrors(errors, 'addEntry');
      return;
    }
    clearEntryModal(addEntryModal);
    modal.hide(addEntryModal, 'show');
    const token = DiaryClient.checkToken();
    const method = 'post';
    const url = '/api/v1/entries';
    const data = {
      token,
      title,
      body,
    };
    makeNetworkRequest({ url, method, data })
      .then((response) => {
        if (response.status === 'success') {
          showResponse('success-flash', response.message);
          DiaryClient.getAllEntries(1, 'paginate');
        }
      })
      .catch(err => err);
  }

  static deleteEntry(id) {
    const token = DiaryClient.checkToken();
    const method = 'delete';
    const url = `/api/v1/entries/${id}`;
    const data = {
      token,
    };
    return makeNetworkRequest({ url, method, data })
      .then((response) => {
        if (response.status === 'success') {
          return response;
        }
      })
      .catch(err => err);
  }

  static getSingleEntry(id) {
    spinnerEdit.style.display = 'block';
    const token = DiaryClient.checkToken();
    const method = 'get';
    const url = `/api/v1/entries/${id}`;
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
    const editEntryModal = document.querySelector('#edit-diary-entry');
    event.preventDefault();
    const form = new FormData(event.target);
    const id = form.get('entry-id');
    const title = form.get('title');
    const body = form.get('body');
    const errors = validateEntry(title, body);
    if (errors.length > 0) {
      showErrors(errors, 'editEntry');
      return;
    }
    clearEntryModal(editEntryModal);
    modal.hide(editEntryModal, 'show');
    const token = DiaryClient.checkToken();
    const method = 'put';
    const url = `/api/v1/entries/${id}`;
    const data = {
      token,
      title,
      body,
    };
    makeNetworkRequest({ url, method, data })
      .then((response) => {
        if (response.status === 'success') {
          showResponse('success-flash', response.message);
          updateEntryView(response.updatedEntry);
        }
      })
      .catch(() => spinner.style.display = 'none');
  }

  static checkToken() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'index.html';
      return null;
    }
    return token;
  }

  static getUserDetails(page, action) {
    if (page !== 'main') {
      spinner.style.display = 'block';
    }
    const token = DiaryClient.checkToken();
    const method = 'get';
    const url = '/api/v1/users/profile';
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
          DiaryClient.getNumberEntriesCeated(page, action);
        }
      })
      .catch(() => { spinner.style.display = 'none'; });
  }

  static getNumberEntriesCeated(page, action) {
    const token = DiaryClient.checkToken();
    const method = 'get';
    const url = '/api/v1/users/profile/entries';
    const data = {
      token,
    };
    makeNetworkRequest({ url, method, data })
      .then((response) => {
        if (response.status === 'Success') {
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
        document.querySelector('#entryCount').value = response.entries;
        if (action === 'paginate') {
          DiaryClient.paginateListEntry();
        }
      })
      .catch(err => err);
  }

  static paginateListEntry() {
    const rowCount = document.querySelector('#entryCount').value;
    const paginationContainer = document.querySelector('.pagination');
    // const firstPage= paginationContainer.querySelector('.page-1');
    loadPageNumbers(paginationContainer, rowCount);
  }
}

const checkPrevOrNext = (buttonsArray, currentTarget, event) => {
  let current = currentTarget;
  if (event.target.id === 'prev') {
    const position = buttonsArray.querySelector('.active').id;
    if (position !== 1 && position > 1) {
      current = Number.parseInt(position, 10) - 1;
      return current;
    }
  } else if (event.target.id === 'next') {
    const position = buttonsArray.querySelector('.active').id;
    const totlal = buttonsArray.querySelectorAll('a').length - 2;
    if (position !== totlal && position < totlal) {
      current = Number.parseInt(position, 10) + 1;
      return current;
    }
  } else {
    current = event.target.id;
    return current;
  }
  return false;
};

const addEventListenerTopaginate = (paginationContainer) => {
  const container = paginationContainer;
  const pagesButton = container.querySelectorAll('a');
  [...pagesButton].forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const currentTarget = container.querySelector('.active');
      let current = currentTarget.id;
      current = checkPrevOrNext(paginationContainer, currentTarget, event);
      if (current) {
        DiaryClient.getAllEntries(current, '')
          .then(() => {
            const currentPage = container.querySelector(`.page-${current}`);
            SelectElement(currentPage, [...pagesButton], 'active');
          });
      }
    });
  });
};

const loadPageNumbers = (paginationContainer, count) => {
  let i = 1;
  let rowCount = count;
  const container = paginationContainer;
  container.innerHTML = '<a id="prev">&laquo;</a>';
  container.innerHTML += `<a id="${1}" class="page-1 active">1</a>`;
  while (rowCount > 3) {
    rowCount -= 3;
    i += 1;
    container.innerHTML += `<a id="${i}" class="page-${i}">${i}</a>`;
  }
  if (rowCount > 3) {
    i += 1;
    container.innerHTML += `<a id="${i}" class="page-${i}">${i}</a>`;
  }
  container.innerHTML += '<a id="next">&raquo;</a>';
  addEventListenerTopaginate(container);
};

const getMaxEntryLenght = (entry) => {
  let entryTitle = entry.title;
  let entryBody = entry.body;
  if (entry.title.length > 40) {
    entryTitle = `${entry.title.substring(0, 40)} ...`;
  }
  if (entry.body.length > 40) {
    entryBody = `${entry.body.substring(0, 40)} ...`;
  }
  return { entryTitle, entryBody };
};

const bindEntryData = (entry) => {
  const { entryTitle, entryBody } = getMaxEntryLenght(entry);
  const entryWrap = `<li class="entry-item" id="diary-${entry.id}">
                      <div class="" data-id="diary-${entry.id}" data-target="view-single-diary">
                          <h4 class="sing-diary-title diary-text">${entryTitle}</h4>
                          <p class="sing-diary-body diary-text">${entryBody}</p>
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
  response.entries.forEach((element, index) => {
    if (index === 0) {
      listContainer.innerHTML = (bindEntryData(element));
    } else {
      listContainer.innerHTML += (bindEntryData(element));
    }
  });
};
// Add EventListener to element after loading

DiaryClient.init();
