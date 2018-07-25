

//Hide or show Menu bar
const iconbars = document.querySelectorAll('.menu-icon');
const navigationMenu =  document.querySelector('#left-section .nav-tabs');
const rightSection = document.querySelector('#right-section');

[...iconbars].forEach((iconbar) => {
    iconbar.addEventListener('click',function(){
        navigationMenu.classList.toggle('nav-show')
        rightSection.classList.toggle('full-width');
     });
});

const navigationMenuButtons = document.querySelectorAll('.nav-it');
[...navigationMenuButtons].forEach((element) => {
    element.addEventListener('click',function(){
      
        const  allItems = document.querySelectorAll('.nav-it');
        //Change Active Navigation tab
        SelectElement(this,[...allItems],'active');

        //Select tab content
        const targetPageSection = document.querySelector('#main-section #'+this.dataset.target);
        const allPageSections = document.querySelectorAll('.tab-pane');
        SelectElement(targetPageSection,[...allPageSections],'selected');
    })
})

//Show add entry modal
const addNewEntryButtons = document.querySelectorAll('.add-entry');
const newEntrybuttons = [...addNewEntryButtons];

newEntrybuttons.forEach((button) => {
  button.addEventListener('click', function(){
    const modalToshow = document.querySelector('#'+this.dataset.target);
    SelectElement(modalToshow,null,'show');
  });
});



closeModal = function() {
    const modalToshow = document.querySelector('#'+this.dataset.target);
    modal.hide(modalToshow,'show');
}
//close modal function
const modalCloseButton = document.querySelectorAll('.modal .close');
[...modalCloseButton].forEach((closeButton)=> {
    closeButton.addEventListener('click',closeModal)
});

//Edit dairy entry 

const editButtons = document.querySelectorAll('.action-edit');


[...editButtons].forEach((editButton)=> {
    editButton.addEventListener('click',function(event){
        const EditDiaryModal = document.querySelector('#'+this.dataset.target);
        SelectElement(EditDiaryModal,null,'show');
        populateModalFoEdit(this,EditDiaryModal)
    })
})

const populateModalFoEdit = (targetEditButton,EditModal)=> {
    //get the diary content
    const dairyItem = document.querySelector("#"+targetEditButton.dataset.id);
    const dairyTitle = dairyItem.querySelector('.sing-diary-title');
    const diaryBody = dairyItem.querySelector('.sing-diary-body');

    //get refrence to modal and ppulate content
    
    const EditModalTitle = EditModal.querySelector('#diary-title');
    const EditModalBody = EditModal.querySelector('#diary-body');

    EditModalTitle.value = dairyTitle.innerHTML;
    EditModalBody.textContent = diaryBody.innerHTML;
}


//Delete a modal Entry
const deleteEntryButtons = document.querySelectorAll('.action-delete');

[...deleteEntryButtons].forEach((deleteEntryButton)=> {
    deleteEntryButton.addEventListener('click',function(event){
        deleteModalItem(event.target)
    })
})
const deleteModalItem = function (targetDeleteButton){
    
    const diaryList = document.querySelector('#dairy-entries');
    const confirmDeleteBox = document.querySelector('#confirm-delete');
    confirmDelete = confirmDeleteBox.querySelector('.dailog-ok');
    modal.show(confirmDeleteBox,'show');
    confirmDeleteBox.addEventListener('click',()=>{
        const diaryItem = diaryList.querySelector('#'+targetDeleteButton.dataset.target);
        modal.hide(confirmDeleteBox,'show');
    })
   
}

//show a single Diary Entry

const showEntryButtons = document.querySelectorAll('.diary-text');
[...showEntryButtons].forEach((showEntryButton)=>{
    showEntryButton.addEventListener('click',function(event){
        showDiaryEntry(event.target.parentNode)
    })
})

const showDiaryEntry = (containerDiv)=>{
    //Make network request with entry id
    const itemId = containerDiv.dataset.id;
    const viewEntryModal = document.querySelector("#"+containerDiv.dataset.target);
    //get refrence to elements 
    const titleContainer = viewEntryModal.querySelector('#diary-content h4');
    const bodyContainer = viewEntryModal.querySelector('#diary-content p');
    const DateContainer = viewEntryModal.querySelector('#date');
    
    modal.show(viewEntryModal,'show');
}

//Show logout box

const dropDownImage = document.querySelector('.nav-link img');
dropDownImage.addEventListener('click',()=>{
    window.addEventListener('click',(event)=>{
        //Click away to close logout box
        if(event.clientX<648 || event.clientY>81){

            dropDownImage.nextElementSibling.firstElementChild.classList.remove('show');
        }
    })
   modal.show(dropDownImage.nextElementSibling.firstElementChild,'show');
})

//update profile details

const profileInputItems = document.querySelectorAll('.profile-details input');
const inputs = [...profileInputItems];
const saveButton = document.querySelector('.profile-details #save');

inputs.forEach((input) => {
  input.addEventListener('keyup',() => {
    saveButton.removeAttribute('disabled');
  });
});
 
//make network request to update profile
saveButton.addEventListener('click', () => {
//
});


