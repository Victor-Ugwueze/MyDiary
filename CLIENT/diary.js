
class DiaryClient {
  static init() {
    document.querySelector('#add-entry-form')
      .addEventListener('submit', DiaryClient.addEntry);
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
        console.log(response);
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
    .then(response => response.json())
    .catch(err => err);
};


const bindEntryData = (entry) => {
  const entryWrap = `<li class="entry-item" id="diary-1">
                      <div class="" data-id="diary-${entry.id}" data-target="view-single-diary">
                          <h4 class="sing-diary-title diary-text">${entry.title}</h4>
                          <p class="sing-diary-body diary-text">${entry.body}</p>
                      </div>
                      <p class="created-at">12/18/2018</p>
                      <a class="action">
                        <span data-id="diary-${entry.id}" data-target="edit-diary-entry" class="btn btn-primary action-edit">
                          <span> <img class="diary-edit icon-edit" src="Resources/images/edit.png">
                          </span><span class="edit-text">Edit</span></span> | <span data-target="diary-${entry.id}" class="btn btn-danger action-delete">
                            <span> <img class="diary-edit icon-edit" src="Resources/images/delete-button.png">
                            </span><span class="delete-text">Delete</span>
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


DiaryClient.init();
