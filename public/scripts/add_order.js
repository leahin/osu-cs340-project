const addProductButton = document.getElementById("addProductButton");
addProductButton.addEventListener('click', addProduct)

const addOrderSubmitButton = document.getElementById("addOrderSubmitButton");
addOrderSubmitButton.addEventListener('click', addOrder)

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

  event.preventDefault();
};

function addOrder(event){
  var req = new XMLHttpRequest();
  var orderInput = {}
  orderInput['sid'] = document.getElementsByName('sid')[0].value;
  orderInput['cid'] = document.getElementsByName('cid')[0].value;
  orderInput['orderDate'] = document.getElementsByName('orderDate')[0].value;
  var pids = document.getElementsByName('pid');
  var qtys = document.getElementsByName('qty');
  var pid = [];
  var qty = [];
  for (i = 0; i < pids.length; i++){
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
