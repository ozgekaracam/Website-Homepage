const tableBody = document.querySelector("#phonesTableBody");
document.addEventListener("DOMContentLoaded", () => { loadPhoneTable(); });
document.addEventListener("addNewRow", () => { loadPhoneTable(); });

function loadPhoneTable(){
  const request = new XMLHttpRequest();
  request.open("GET","https://wt.ops.labs.vu.nl/api22/ccc90d56");
  request.onload = () => {
    try{
      const json = JSON.parse(request.responseText);
      populatePhoneTable(json);
    }
     catch(e){
       console.warn("Couldn't load phones! :(");
     }
  };
  request.send();
}
function populatePhoneTable(json){
  console.log(json);
  json.forEach(obj => {
    const tr = document.createElement("tr");
    Object.entries(obj).forEach(([key, value]) => {
      if(`${key}` != "id")
      {
        const td = document.createElement("td");
        console.log(td);
        td.textContent = `${value}`;
        tr.appendChild(td);
        console.log(tr);
        console.log(`${key} ${value}`);
      }
    });
  });
  console.log('-------------------');
  tableBody.appendChild(tr);
  console.log('----------appendError---------');
  console.log(phonesTableBody);
}
function resetTable(){
  const request = new XMLHttpRequest();
  request.open("GET","https://wt.ops.labs.vu.nl/api22/ccc90d56/reset");
  request.onload = () => {
    try{
      while(phonesTableBody.firstChild){
        console.log("before removeChild")
        phonesTableBody.removeChild(phonesTableBody.firstChild);
        console.log("after removeChild")
      }
      console.log(request.responseText);
    }
     catch(e){
       console.warn("Couldn't delete phones! :(");
     }
  };
  request.send();
}

var request;

$("#form").submit(function(event){

    event.preventDefault();

    if (request) {
        request.abort();
    }
    var $form = $(this);

    var $inputs = $form.find("image, brand, model, os, screensize");

    var serializedData = $form.serialize();

    $inputs.prop("disabled", true);

    request = $.ajax({
        url: "/https://wt.ops.labs.vu.nl/api22/ccc90d56",
        type: "post",
        data: serializedData
    });

    request.done(function (response, textStatus, jqXHR){
        loadPhoneTable();
    });

    request.fail(function (jqXHR, textStatus, errorThrown){
        console.error(
            "The following error occurred: "+
            textStatus, errorThrown
        );
    });

    request.always(function () {
        $inputs.prop("disabled", false);
    });
});

//sorting function source: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_sort_table
function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("phones");
  switching = true;
  dir = "asc";
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount ++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
