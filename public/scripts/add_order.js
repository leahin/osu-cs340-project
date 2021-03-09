const addProductButton = document.getElementById("addProductButton");
addProductButton.addEventListener('click', addProduct)

const deleteProductButton = document.getElementById("deleteProductButton");
deleteProductButton.addEventListener('click', deleteProduct)

const addOrderSubmitButton = document.getElementById("addOrderSubmitButton");
addOrderSubmitButton.addEventListener('click', addOrder)

document.getElementById("closeWindowButton").addEventListener('click', (event) => {
  window.close();
})

var productRowCounter = 1;

defaultOrderDate();

// set orderdate default to today's
function defaultOrderDate() {
  var orderDateNode = document.getElementsByName("orderDate")[0];
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

// add a row of product/qty inputs
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
  input1.setAttribute("type", "number")
  input1.setAttribute("class", "form-control")
  input1.setAttribute("name", "pid")
  input1.setAttribute("min", "1")
  input1.setAttribute("required", true)
  div1.appendChild(label1);
  div1.appendChild(input1);
  div0.appendChild(div1);

  var div2 = document.createElement("div");
  div2.setAttribute("class", "col");
  var label2 = document.createElement("label")
  label2.innerHTML = "Qty";
  var input2 = document.createElement("input")
  input2.setAttribute("type", "number")
  input2.setAttribute("class", "form-control")
  input2.setAttribute("name", "qty")
  input2.setAttribute("required", true)
  div2.appendChild(label2);
  div2.appendChild(input2);
  div0.appendChild(div2);

  productRowCounter += 1;

  event.preventDefault();
};

// remove a row of product/qty inputs
function deleteProduct(event){
  if (productRowCounter < 2) {
    alert("Cannot delete the last row.")
    return;
  }
  productRowCounter -= 1;
  var targetNodeGroup = document.getElementsByClassName('form-row');
  var targetNode = targetNodeGroup[targetNodeGroup.length - 1];
  document.getElementById("productOrderAdd").removeChild(targetNode);
}

// request add Order and Orders_Products
async function addOrder(event){
  var req = new XMLHttpRequest();
  var orderInput = {}

  // add cid / sid / order_date
  var cid = document.getElementsByName('cid')[0].value;
  var sid = document.getElementsByName('sid')[0].value;
  // cid & sid validsation.
  if (cid === ""){
    alert("Please select a customer.");
    event.preventDefault();
    return;
  }
  if (sid === ""){
    alert("Please select a store.");
    event.preventDefault();
    return;
  }
  orderInput['sid'] = sid;
  orderInput['cid'] = cid;
  orderInput['orderDate'] = document.getElementsByName('orderDate')[0].value;

  var pids = document.getElementsByName('pid');
  var qtys = document.getElementsByName('qty');
  var pid = [];
  var qty = [];

  for (i = 0; i < pids.length; i++){
    // validate pids and qtys
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

  await req.open('POST', '/orders/add_order')
  await req.setRequestHeader('Content-Type', 'application/json')
  await req.send(JSON.stringify(orderInput))

  window.opener.location.reload(false);
};
