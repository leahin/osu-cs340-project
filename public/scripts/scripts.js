// nav-bar setting current
function navCurrent(id) {
  // nav span
  var navSpan = document.createElement('span');
  navSpan.setAttribute('class', "sr-only");
  navSpan.innerHTML = "(current)";

  // get the right anchor
  var navAnchor = document.getElementById(id);
  navAnchor.setAttribute('class',"nav-item nav-link active");
  navAnchor.appendChild(navSpan);

  // get the right list
  var navList = navAnchor.parentNode
  navList.setAttribute('class', "nav-item active");
};
