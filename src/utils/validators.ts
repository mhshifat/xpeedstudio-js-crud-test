export const allLetter = (inputTxt: string): boolean => {
  var letters = /^[A-Za-z\s]+$/;
  if (inputTxt.match(letters)) {
    return true;
  } else {
    return false;
  }
};

export const allNumberLetter = (inputTxt: string): boolean => {
  var letters = /^[A-Za-z0-z\s]+$/;
  if (inputTxt.match(letters)) {
    return true;
  } else {
    return false;
  }
};

export const isEmail = (email: string): boolean => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};
