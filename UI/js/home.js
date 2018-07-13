
(function showLoginModal(){
    [...document.querySelectorAll('.nav-link')].forEach((element)=>{
        element.addEventListener('click',function(){
           document.querySelector('#'+this.dataset.target).classList.toggle('show');
            const header =  document.querySelector('header');
            const main = document.querySelector('main')
            header.classList.add('active-modal-background');
            main.classList.add('active-modal-background');
    
    
           const elements = document.querySelectorAll('.modal .tab-pane');
           let elementToshow = document.querySelector("#"+this.dataset.toggle);
           SelectElement(elementToshow,[...elements],'selected');
    
           
           elementToshow = document.querySelector('.modal #select-tab-'+this.dataset.toggle);
           const hideFormElement = document.querySelector('.modal .active');
    
           SelectElement(elementToshow,[hideFormElement],'active');
    
        });
    })
})();
const toggleLoginForm = {
    init : function(){
        this.countClick = 0;
        this.initalizeDomVars();
        this.bindDomVars();
    },
    initalizeDomVars: function(){
        this.selectLogin = document.querySelectorAll('.nav-item');
    },
    bindDomVars : function(){
        [...this.selectLogin].forEach((loginTuggleButton)=>{
            loginTuggleButton.addEventListener('click',this.changeForm)
        });
    },
    changeForm : function(){
        //select form tab
       const  hideFormElement = document.querySelector('.modal .active');
       SelectElement(this,[hideFormElement],'active'); 
       
       //Select Tab content
        const elements = document.querySelectorAll('.modal .tab-pane');
        const elementToshow = document.querySelector("#"+this.dataset.target);
       SelectElement(elementToshow,[...elements],'selected');
    },
    closeLoginModal : function(clickedMenu){
      const  loginModal = document.querySelector('#sign-up-login.modal');
      const homeMenu = document.querySelectorAll('.navbar .nav-link');
    }
}

toggleLoginForm.init();

//clicking on the window should close the login form if it's open
document.querySelector('.modal')
    .addEventListener('click',(event)=>{
            toggleLoginForm.closeLoginModal(event.target.parentNode);
        })

//Toggle menu bar

const iconbar = document.querySelector('.icon-bar');
iconbar.addEventListener('click',function(){
    const naMenu = document.querySelector('header nav');
    naMenu.classList.toggle('show');

})