
(function showLoginModal(){
    [...document.querySelectorAll('.nav-link')].forEach((element)=>{
        element.addEventListener('click',function(){
           document.querySelector('#'+this.dataset.target).style.display = 'block';
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
    }
}

toggleLoginForm.init();