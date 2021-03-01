navCurrent("navOrders");

function openAddOrder(event){
  window.open('orders/add_order', "_blank", "width=380px, height=600px");
}

// table event for order details, order update and delete functions.
const orderTable = document.getElementById("orderTable");
orderTable.onclick = function(event) {
  var target = event.target;

  if (target.name == 'details') {
    requestDetail(event, target.value);
  };
  if (target.name == 'delete') {
    requestDelete(event, target.value);
    window.location.reload();
  };
  if (target.name == 'update') {
    var inputElements = document.getElementsByClassName("input" + target.value);
    var cidInput = inputElements[0];
    var sidInput = inputElements[1];
    var orderDateInput = inputElements[2];
    var updateButton = inputElements[3];
    cidInput.disabled = false;
    sidInput.disabled = false;
    orderDateInput.disabled = false;
    event.preventDefault();

    updateButton.textContent = 'Submit';
    updateButton.setAttribute('class', "btn btn-info input" + target.value);
    updateButton.addEventListener('click', (event) => {
      var inputs = {};
      inputs['order_id'] = target.value;
      inputs['cid'] = target.form.cid.value;
      inputs['sid'] = target.form.sid.value;

      // cid user input validation
      if (inputs['cid'].trim() === "" || isNaN(inputs['cid'])){
        alert("Please Enter a valid customer Id");
      } else if (inputs['cid'] == 'Not Available') {
          inputs['cid'] = null;
      };

      // sid user input validation
      if (inputs['sid'].trim() === "" || isNaN(inputs['sid'])){
        alert("Please Enter a valid customer Id");
      } else if (inputs['sid'] == 'Not Available') {
          inputs['sid'] = null;
      };

      inputs['order_date'] = target.form.orderDate.value;
      requestUpdate(event, inputs);
      window.location.reload();
    });
  };
};

// read Orders_Products
function requestDetail(event, id){
  window.open('orders/order_details/' + id, "_blank", "width=1000px, height=500px");
}

// request Order Delete
function requestDelete(event, id){
  var req = new XMLHttpRequest();
  req.open('DELETE', '/orders')
  req.setRequestHeader('Content-Type', 'application/json')
  req.send(JSON.stringify({id: id}));
}

// request Order Update
function requestUpdate(event, inputs){
  var req = new XMLHttpRequest();
  req.open('PUT', '/orders')
  req.setRequestHeader('Content-Type', 'application/json')
  req.send(JSON.stringify(inputs));
}
