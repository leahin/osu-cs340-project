navCurrent("navOrders");

function openAddOrder(event){
  window.open('orders/add_order', "_blank", "width=380px, height=600px");
}

function requestDetail(event, id){
  window.open('orders/order_details/' + id, "_blank", "width=1000px, height=500px");
}

function requestDelete(event, id){
  var req = new XMLHttpRequest();
  var targetId = {id: id};
  req.open('DELETE', '/orders')
  req.setRequestHeader('Content-Type', 'application/json')
  req.send(JSON.stringify(targetId));
}

function requestUpdate(event, id){
  // TODO
}

const productTable = document.getElementById("orderTable");
productTable.onclick = function(event) {
  var target = event.target;
  if (target.name == 'details') {
    requestDetail(event, target.value);
  }
  if (target.name == 'delete') {
    requestDelete(event, target.value);
  };
  if (target.name == 'update') {
    // TODO
    // requestUpdate(event, target.value)
  }
};
