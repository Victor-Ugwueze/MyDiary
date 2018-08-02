
class LoginForm {
  constructor() {
    this.initalizeDomVars();
    this.bindDomVars();
  }

  initalizeDomVars() {
    this.selectLogin = document.querySelectorAll('.nav-item');
    this.closeLoginForm();
    this.showLoginModal();
  }

  bindDomVars() {
    [...this.selectLogin].forEach((loginTuggleButton) => {
      loginTuggleButton.addEventListener('click',this.changeForm)
    });
  }

  changeForm(event) {
    // select form tab
    const  hideFormElement = document.querySelector('.modal .active');
    SelectElement(event.target, [hideFormElement],'active'); 
    
  //  Select Tab content
    const elements = document.querySelectorAll('.modal .tab-pane');
    const elementToshow = document.querySelector("#"+event.target.dataset.target);
    SelectElement(elementToshow,[...elements],'selected');
    }

    showLoginModal(){
      [...document.querySelectorAll('.nav-link')].forEach((element)=>{
        element.addEventListener('click', (event) => {
          const showModalButton = event.target.parentNode;
          document.querySelector(`#${showModalButton.dataset.target}`).classList.toggle('show');
            
          const elements = document.querySelectorAll('.modal .tab-pane');
          let elementToshow = document.querySelector(`#${showModalButton.dataset.toggle}`);
          SelectElement(elementToshow,[...elements],'selected');
    
          elementToshow = document.querySelector(`.modal #select-tab-${showModalButton.dataset.toggle}`);
          const hideFormElement = document.querySelector('.modal .active');
          SelectElement(elementToshow,[hideFormElement],'active');
    
        });
    })
  }

    closeLoginForm() {
        // Click outside modal to close it
      document.addEventListener('click', (event) => {
        const loginmodal = document.querySelector('#sign-up-login');
        if(event.target === loginmodal){
          modal.hide(loginmodal, 'show');
        }
      })
    }

}

new LoginForm();


//Toggle menu bar

const iconbar = document.querySelector('.icon-bar');
iconbar.addEventListener('click', () => {
    const naMenu = document.querySelector('header nav');
    naMenu.classList.toggle('show');

})
