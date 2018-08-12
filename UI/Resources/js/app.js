/*
Remove class from the current element and add class to another element
 @param  Element to add class
 @param Array of Elements to remove class
 @param className to add or remove
 @return void
*/
window.SelectElement = function (toAddClass, toRemoveclass, className) {
  // this.console.log(toAddClass,toRemoveclass,className)
  if (toRemoveclass == null) {
    toAddClass.classList.toggle(className);
    return;
  } else {
    toRemoveclass.length<2 ? toRemoveclass[0].classList.remove(className) :
    toRemoveclass.forEach((element)=>{
    if(element.classList.contains(className)) element.classList.remove(className)
        return;
    });
    toAddClass.classList.add(className);
  }
}

const modal = {
  show: (element, className) => {
    element.classList.add(className);
  },
  hide: (element, className) => {
    element.classList.remove(className);
  },
  closeModal: (event) => {
    // console.log(event);
  },
};
