/* Author: Leah In
   Description: build a table for GET requests
   Usage: call buildTable().
   Note: Whenever a new column added to a table, it might be ncessary to update selectType()
*/


function buildTable(res, tableId, readOnly = false){
  // res: response context
  // tableId: tbody Id where this table will be built
  // readOnly: if the table is for read-only (no update/delete buttons), mark it as true. Default is false.
  for (i = 0; i < res.length; i++){
    addrows(res[i], tableId, readOnly);
  }
}


function addrows(data, tableId, readOnly){
  // helper function of buildTable
  // data: a line of response context

  var table = document.getElementById(tableId);
  var row = document.createElement("tr");
  table.appendChild(row);

  for (item in data){
    row.appendChild(addCells(item, data[item], data["id"]));
  }

  if (!readOnly){
    var updateButton = document.createElement("input");
    updateButton.type = "submit";
    updateButton.name = "update";
    updateButton.value = "Update";
    updateButton.form = row["id"];

    var deleteButton = document.createElement("button");
    deleteButton.name = "delete";
    deleteButton.textContent = "Delete";
    deleteButton.form = row["id"];

    row.appendChild(updateButton);
    row.appendChild(deleteButton);
  }
}


function addCells(key, value, id){
  // helper function of addRows. Split row from addRows to key, value, id.
  // key: dictionary key
  // value: dictionary value
  // id: row id
  var cell = document.createElement("td");

  if (key == "id"){
    var form = document.createElement("form");
    form.id = id;
    form.appendChild(addInputs(key, value, id));
    cell.appendChild(form);
  } else{
    cell.appendChild(addInputs(key, value, id));
  }

  return cell;
}


function addInputs(key, value, id){
  // helper function of addCalls. Build an input element and return it.
  // key: dictionary key
  // value: dictionary value
  // id: row id
  var input = document.createElement("input");
  input.type = selectType(key);
  input.name = key;
  input.value = value;
  input.form = id;

  return input;
}


function selectType(key){
  // helper function of addInputs. Determine/Return an input's type.
  // key: dictionary key
  switch(key){
    case "order_date":
    case "birtyday":
      return "date";

    case "Product_price":
    case "quantity":
      return "number";

    default:
      return "text";
  }
}
