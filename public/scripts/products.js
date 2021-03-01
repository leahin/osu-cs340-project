navCurrent("navProducts");

// product table event for request update/delete.
const productTable = document.getElementById("productTable");
productTable.onclick = function(event){
  var target = event.target;

  if (target.name == 'delete'){
    requestDelete(event, target.value);
  };

  if (target.name == 'update'){
    var inputElements = document.getElementsByClassName("input" + target.value);
    var nameInput = inputElements[0];
    var priceInput = inputElements[1];
    var updateButton = inputElements[2];
    nameInput.disabled = false;
    priceInput.disabled = false;
    event.preventDefault();

    updateButton.textContent = 'Submit';
    updateButton.setAttribute('class', "btn btn-info input" + target.value);
    updateButton.addEventListener('click', (event) => {
      var inputs = {};
      inputs['product_id'] = target.value;

      inputs['product_name'] = target.form.name.value;
      if (target.form.name.value.trim() === ""){
        alert("Please Enter a Valid Product Name.");
      };
      inputs['product_price'] = target.form.price.value;
      if (target.form.price.value <= 0 || isNaN(target.form.price.value)){
        alert("Please Enter a Valid Product Price.");
      };
      // console.log(inputs);
      requestPut(event, inputs);
      window.location.reload();
    });
  };
}

// sending delete request
function requestDelete(event, id){
  var req = new XMLHttpRequest();
  req.open('DELETE', '/products')
  req.setRequestHeader('Content-Type', 'application/json')
  req.send(JSON.stringify({id: id}));
}

// sending update request
function requestPut(event, inputs){
  var req = new XMLHttpRequest();
  req.open('PUT', '/products')
  req.setRequestHeader('Content-Type', 'application/json')
  req.send(JSON.stringify(inputs));
}
