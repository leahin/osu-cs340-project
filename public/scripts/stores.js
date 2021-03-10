navCurrent("navStores");

// update/delete request
const storeTable = document.getElementById("storeTable");
storeTable.onclick = function(event){
  var target = event.target;

  if (target.name == 'delete'){
    requestDelete(event, target.value);
  };

  if (target.name == 'update'){
    // first make undisabled store inputs
    var inputElements = document.getElementsByClassName("input" + target.value);
    var nameInput = inputElements[0];
    var addressInput = inputElements[1];
    var stateInput = inputElements[2];
    var zipInput = inputElements[3];
    var updateButton = inputElements[4];


    nameInput.disabled = false;
    addressInput.disabled = false;
    stateInput.disabled = false;
    zipInput.disabled = false;

    event.preventDefault();

    updateButton.textContent = 'Submit';
    updateButton.setAttribute('class', "btn btn-info input" + target.value);
    updateButton.addEventListener('click', (event) => {

      var inputs = {};
      inputs['store_id'] = target.value;
      inputs['store_name'] = target.form.storeName.value;
      inputs['street_address'] = target.form.streetAddress.value;
      inputs['state'] = target.form.state.value;
      inputs['zip_code'] = target.form.zipCode.value;

      // request update a stores
      requestPut(event, inputs);
      window.location.reload();
    });
  };
}

function requestDelete(event, id){
  var req = new XMLHttpRequest();
  req.open('DELETE', '/stores')
  req.setRequestHeader('Content-Type', 'application/json')
  req.send(JSON.stringify({id: id}));
}

function requestPut(event, inputs){
  var req = new XMLHttpRequest();
  req.open('PUT', '/stores')
  req.setRequestHeader('Content-Type', 'application/json')
  req.send(JSON.stringify(inputs));
}
