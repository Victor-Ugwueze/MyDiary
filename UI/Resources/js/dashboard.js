/* global SelectElement, modal */

// Hide or show Menu bar
const iconbars = document.querySelectorAll('.menu-icon');
const navigationMenu = document.querySelector('#left-section .nav-tabs');
const rightSection = document.querySelector('#right-section');

[...iconbars].forEach((iconbar) => {
  iconbar.addEventListener('click', () => {
    navigationMenu.classList.toggle('nav-show');
    rightSection.classList.toggle('full-width');
  });
});

const navigationMenuButtons = document.querySelectorAll('.nav-it');
// console.log(document.querySelector('.nav-it').hasAttribute('data-target'));

[...navigationMenuButtons].forEach((element) => {
  element.addEventListener('click', (event) => {
    let navMenuitem = event.target;
    if (!navMenuitem.classList.contains('nav-it')) {
      navMenuitem = navMenuitem.parentNode;
    }
    const allItems = document.querySelectorAll('.nav-it');
    // Change Active Navigation tab
    SelectElement(navMenuitem, [...allItems], 'active');
    // Select tab content
    const targetPageSection = document.querySelector(`#main-section #${navMenuitem.dataset.target}`);
    const allPageSections = document.querySelectorAll('.tab-pane');
    SelectElement(targetPageSection, [...allPageSections], 'selected');
  });
});

// Show add entry modal
const addNewEntryButtons = document.querySelectorAll('.add-entry');
const newEntrybuttons = [...addNewEntryButtons];

newEntrybuttons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const modalToshow = document.querySelector(`#${event.target.dataset.target}`);
    SelectElement(modalToshow, null, 'show');
  });
});


const closeModal = (event) => {
  const modalToshow = document.querySelector(`#${event.target.dataset.target}`);
  modal.hide(modalToshow, 'show');
};
// close modal function
const modalCloseButton = document.querySelectorAll('.modal .close');
[...modalCloseButton].forEach((closeButton) => {
  closeButton.addEventListener('click', closeModal);
});


// Delete a modal Entry
const deleteEntryButtons = document.querySelectorAll('.action-delete');

[...deleteEntryButtons].forEach((deleteEntryButton) => {
  deleteEntryButton.addEventListener('click', (event) => {
    deleteModalItem(event.target);
  });
});

const deleteModalItem = (targetDeleteButton) => {
  const diaryList = document.querySelector('#dairy-entries');
  const confirmDeleteBox = document.querySelector('#confirm-delete');
  // confirmDelete = confirmDeleteBox.querySelector('.dailog-ok');
  modal.show(confirmDeleteBox, 'show');
  confirmDeleteBox.addEventListener('click', () => {
    const diaryItem = diaryList.querySelector(`#${targetDeleteButton.dataset.target}`);
    modal.hide(confirmDeleteBox, 'show');
  });
};

// Show logout box

const dropDownImage = document.querySelector('.nav-link img');
dropDownImage.addEventListener('click', () => {
  window.addEventListener('click', (event) => {
    // Click away to close logout box
    if (event.clientX < 648 || event.clientY > 81) {
      dropDownImage.nextElementSibling.firstElementChild.classList.remove('show');
    }
  });
  modal.show(dropDownImage.nextElementSibling.firstElementChild, 'show');
});

// update profile details

const profileInputItems = document.querySelectorAll('.profile-details input');
const inputs = [...profileInputItems];
const saveButton = document.querySelector('.profile-details #save');

inputs.forEach((input) => {
  input.addEventListener('keyup', () => {
    saveButton.removeAttribute('disabled');
  });
});

// make network request to update profile
saveButton.addEventListener('click', () => {
//
});
