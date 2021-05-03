//can make code that does not need to be in app.js as modules and require them in app.js
//this will remove clutter of code and make it seem more readable

exports.getDate = function() {
  //JS method for Date object
  const today = new Date();
  currentDay = today.getDay();

  //toLocaleDateString format
  const options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  };

  return today.toLocaleDateString("en-US", options);
}

exports.getDay = function() {
  //JS method for Date object
  const today = new Date();
  currentDay = today.getDay();

  //toLocaleDateString format
  const options = {
    weekday: 'long',
  };

  return today.toLocaleDateString("en-US", options);
}
