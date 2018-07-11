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


/*
Remove class from the current element and add class to another element
 @param  Element to add class
 @param Array of Elements to remove class
 @param className to add or remove
*/
function SelectElement(toAddClass,toRemoveclass,className){
    toRemoveclass.length<2 ? toRemoveclass[0].classList.remove(className) :
    toRemoveclass.forEach((element)=>{
        if(element.classList.contains(className)) element.classList.remove(className)
        return;
    });
    toAddClass.classList.add(className);
}