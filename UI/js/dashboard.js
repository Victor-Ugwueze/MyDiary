const iconbar = document.querySelector('#menu-icon');

iconbar.addEventListener('click',function(){
   let a =  document.querySelector('#left-section');
   a.classList.contains('show') ? a.classList.remove('show') :
   a.classList.add('show')
});

[...document.querySelectorAll('.nav-it')].forEach((element)=>{
    element.addEventListener('click',function(){
        let el = document.querySelector('.nav-it.active');
        let all = document.querySelectorAll('.nav-it');
        // console.log(el,all);
        //Change Active Navigation tab
        SelectElement(this,[...all],'active');

        //Select tab content
        el = document.querySelector('#main-section #'+this.dataset.target);
        all = document.querySelectorAll('.tab-pane');
        SelectElement(el,[...all],'selected');
    })
})

const addNewEntry = document.querySelector('.add-entry');

addNewEntry.addEventListener('click',function(){
    const modalToshow = document.querySelector('#'+this.dataset.target);
    SelectElement(modalToshow,null,'show');
})