navCurrent("navCustomers");

// table request update/delete method
const customerTable = document.getElementById("customerTable");
customerTable.onclick = function(event){
  var target = event.target;

  if (target.name == 'delete'){
    requestDelete(event, target.value);
  };

  if (target.name == 'update'){
    // first make disabled false
    var inputElements = document.getElementsByClassName("input" + target.value);

    var fnameInput = inputElements[0];
    var lnameInput = inputElements[1];
    var birthdateInput = inputElements[2];
    var updateButton = inputElements[3];

    fnameInput.disabled = false;
    lnameInput.disabled = false;
    birthdateInput.disabled = false;

    event.preventDefault();

    updateButton.textContent = 'Submit';
    updateButton.setAttribute('class', "btn btn-info input" + target.value);
    updateButton.addEventListener('click', (event) => {

      var inputs = {};
      inputs['customer_id'] = target.value;
      inputs['first_name'] = target.form.custFname.value;
      inputs['last_name'] = target.form.custLname.value;
      inputs['birthdate'] = target.form.custBirthdate.value;

      // send put request
      requestPut(event, inputs);
      window.location.reload();
    });
  };
}

function requestDelete(event, id){
  var req = new XMLHttpRequest();
  req.open('DELETE', '/customers')
  req.setRequestHeader('Content-Type', 'application/json')
  req.send(JSON.stringify({id: id}));
}

function requestPut(event, inputs){
  var req = new XMLHttpRequest();
  req.open('PUT', '/customers')
  req.setRequestHeader('Content-Type', 'application/json')
  req.send(JSON.stringify(inputs));
}
