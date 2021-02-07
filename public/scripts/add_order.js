// js for add_order.html

function addProduct(){
  var form = document.getElementById("productOrderAdd");

  var div0 = document.createElement("div");
  div0.setAttribute("class", "form-row");
  form.appendChild(div0);

  var div1 = document.createElement("div");
  div1.setAttribute("class", "col-md-1 md-1");
  var label1 = document.createElement("label")
  label1.innerHTML = "Product Id";
  var input1 = document.createElement("input")
  input1.setAttribute("type", "text");
  input1.setAttribute("class", "form-control");
  div1.appendChild(label1);
  div1.appendChild(input1);
  div0.appendChild(div1);

  var div2 = document.createElement("div");
  div2.setAttribute("class", "col-md-1 md-1");
  var label2 = document.createElement("label")
  label2.innerHTML = "QTY";
  var input2 = document.createElement("input")
  input2.setAttribute("type", "text");
  input2.setAttribute("class", "form-control");
  div2.appendChild(label2);
  div2.appendChild(input2);
  div0.appendChild(div2);
}
