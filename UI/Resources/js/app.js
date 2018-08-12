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
  closeModal: () => {
    // console.log(event);
  },
};

const getFormInput = (input, action) => {
  const formInput = new FormData(input);
  const data = {
    firstName: formInput.get('firstName'),
    lastName: formInput.get('lastName'),
    email: formInput.get('email'),
    location: formInput.get('location'),
    currentPassword: formInput.get('currentPassword'),
    password: formInput.get('password'),
    confirmPassword: formInput.get('confirmPassword'),
    action,
  };
  return data;
};


const validateEmail = (email) => {
  /* This regex test for email is from
          https://forum.freecodecamp.org/t/regular-expression-is-stupid-help/100055/9
  */
  const regex = /^[\w.]+\w+@\w+\.com(\.(ru|cn))?$/;
  if (!regex.test(email)) return false;
  return true;
};

const validateInput = (data, action) => {
  const errors = {};
  const fields = [
    { firstName: data.firstName },
    { lastName: data.lastName },
    { email: data.email },
    { password: data.password },
    { confirmPassword: data.confirmPassword },
  ];
  fields.forEach((input) => {
    const key = Object.keys(input)[0];
    if (input[key] === '' && key !== 'confirmPassword' && action !== 'login') {
      errors[key] = `${key} can't be empty`;
    }
    if (input[key] && key === 'email') {
      if (!validateEmail(input[key])) {
        errors[key] = `Please enter a valid ${key}`;
      }
    }
    if (input[key] && key === 'firstName' && input[key].length < 3 && action !== 'login') {
      errors[key] = `Please ${key} should be 3 characters long or more `;
    }
    if (input[key] && key === 'lastName' && input[key].length < 3 && action !== 'login') {
      errors[key] = `Please ${key} should be 3 characters long or more`;
    }
    if (input[key] && key === 'password' && input[key].length < 6 && action !== 'login') {
      errors[key] = `${key} must be a minimum of 6 chracters long or more`;
    }
  });
  if (fields[3].password !== fields[4].confirmPassword && action !== 'login') {
    errors.confirmPassword = "password dosen't match";
  }
  console.log(errors);
  return errors;
};
