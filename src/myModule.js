const message = "Some message from myModule.js";
const name = "Prashant";
const location = "Bangalore";
const getGreeting = name => {
  return `Welcome to the course ${name}`;
};
export { message, name, location as default, getGreeting };
