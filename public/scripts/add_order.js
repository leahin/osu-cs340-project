const addProductButton = document.getElementById("addProductButton");
addProductButton.addEventListener('click', addProduct)

const addOrderSubmitButton = document.getElementById("addOrderSubmitButton");
addOrderSubmitButton.addEventListener('click', addOrder)

const deleteProductButton = document.getElementById("deleteProductButton");
deleteProductButton.addEventListener('click', deleteProduct)

document.getElementById("closeWindowButton").addEventListener('click', (event) => {
  window.close();
})

var productRowCounter = 1;

defaultOrderDate();

function addProduct(event){
  var form = document.getElementById("productOrderAdd");

  var div0 = document.createElement("div");
  div0.setAttribute("class", "form-row");
  form.appendChild(div0);

  var div1 = document.createElement("div");
  div1.setAttribute("class", "col");
  var label1 = document.createElement("label")
  label1.innerHTML = "Product Id";
  var input1 = document.createElement("input")
  input1.setAttribute("type", "text")
  input1.setAttribute("class", "form-control")
  input1.setAttribute("name", "pid")
  input1.setAttribute("required", true)
  div1.appendChild(label1);
  div1.appendChild(input1);
  div0.appendChild(div1);

  var div2 = document.createElement("div");
  div2.setAttribute("class", "col");
  var label2 = document.createElement("label")
  label2.innerHTML = "Qty";
  var input2 = document.createElement("input")
  input2.setAttribute("type", "text")
  input2.setAttribute("class", "form-control")
  input2.setAttribute("name", "qty")
  input2.setAttribute("required", true)
  div2.appendChild(label2);
  div2.appendChild(input2);
  div0.appendChild(div2);

  productRowCounter += 1;

  event.preventDefault();
};

function deleteProduct(event){
  if (productRowCounter < 2) {
    return;
  }
  productRowCounter -= 1;
  var targetNodeGroup = document.getElementsByClassName('form-row');
  var targetNode = targetNodeGroup[targetNodeGroup.length - 1];
  document.getElementById("productOrderAdd").removeChild(targetNode);
}

// request add Order and Orders_Products
function addOrder(event){
  var req = new XMLHttpRequest();
  var orderInput = {}
  orderInput['sid'] = document.getElementsByName('sid')[0].value;
  orderInput['cid'] = document.getElementsByName('cid')[0].value;
  if (orderInput['cid'].trim() === "" || isNaN(orderInput['cid'])) {
    alert("Please enter a valid Customer Id.");
    return;
  }
  orderInput['orderDate'] = document.getElementsByName('orderDate')[0].value;
  var pids = document.getElementsByName('pid');
  var qtys = document.getElementsByName('qty');
  var pid = [];
  var qty = [];
  for (i = 0; i < pids.length; i++){
    if (pids[i].value.trim() === "" || isNaN(pids[i].value)) {
      alert("Please enter a valid product Id.");
      event.preventDefault();
      return;
    };
    if (qtys[i].value.trim() === "" || isNaN(qtys[i].value)) {
      alert("Please enter the quantity.");
      event.preventDefault();
      return;
    };
    pid.push(pids[i].value);
    qty.push(qtys[i].value);
  }
  orderInput['pid'] = pid;
  orderInput['qty'] = qty;

  req.open('POST', '/orders/add_order')
  req.setRequestHeader('Content-Type', 'application/json')
  req.send(JSON.stringify(orderInput))

  window.opener.location.reload(false);
  window.close();
};

function defaultOrderDate() {
  var orderDateNode = document.getElementsByName("orderDate")[0];
  //console.log(orderDateNode)
  var currentDate = new Date();
  var year = currentDate.getFullYear();
  var month = (currentDate.getMonth() + 1).toString();
  var date = currentDate.getDate().toString();
  if (month.length < 2) {
    month = '0' + month;
  }
  if (date.length < 2) {
    date = '0' + date;
  }
  currentDate = year + '-' + month + '-' + date;
  orderDateNode.setAttribute('value', currentDate);
}
