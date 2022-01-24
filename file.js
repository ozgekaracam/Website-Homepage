//Add new item on the table dynamically without leaving the page
//source: https://stackoverflow.com/questions/5004233/jquery-ajax-post-example-with-php
var request;
$(document).ready(function(event){
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
        url: "https://wt.ops.labs.vu.nl/api22/ccc90d56",
        type: "POST",
        data: serializedData
    });

    request.done(function (response, textStatus, jqXHR){
      try{
        loadPhoneTable();
        //clean form inputs on the screen
        document.getElementById("form").reset();

      }
      catch(e){
       console.warn("Couldn't load the phone! :(");
      }

    request.always(function () {
        $inputs.prop("disabled", false);
    });
  });
});
});
//Dynamic table view
//Table body is called for body's id itself as variable, as explained by TA
var tableBody = document.querySelector("#phonesTableBody");
document.addEventListener("DOMContentLoaded", () => { loadPhoneTable(); });
//document.addEventListener("addNewRow", () => { loadPhoneTable(); });
function loadPhoneTable(){
     request = $.ajax({
         url: "https://wt.ops.labs.vu.nl/api22/ccc90d56",
         type: "GET",
     });
     request.done(function (response, textStatus, jqXHR){
       try{
         const json = JSON.parse(request.responseText);
         populatePhoneTable(json);
       }
       catch(e){
        console.warn("Couldn't load phones! :(");
       }
     });
}
function populatePhoneTable(json){
  console.log(json);
  json.forEach(obj => {
    const tr = document.createElement("tr");
    Object.entries(obj).forEach(([key, value]) => {
      if(`${key}` != "id")
      {
        const td = document.createElement("td");
        //console.log(`${key} ${value}`);
        td.textContent = `${value}`;
        //Here for tr and td, appendTo was used and yet it did not even work as much as appendChild.
        //So appendChild is left here as used so it is visible on console.
        // it is obvious that tr and td elements of table are created correctly and yet not possible to insert them into tableBody
        tr.appendChild(td);
        console.log(tr);
      }
    });
  });
  console.log('-------------------');
  //Here what it gives error and not continue on the function.
  tableBody.appendChild(tr);
  console.log('----------appendError---------');
  console.log(phonesTableBody);
}
//Reset the table database
$(document).ready(function(){
  $("#reset").click(function(){
    $.get("https://wt.ops.labs.vu.nl/api22/ccc90d56/reset", function(data, status){
      try{
        while(phonesTableBody.firstChild){
          phonesTableBody.removeChild(phonesTableBody.firstChild);
        }
      }
     catch(e){
       console.warn("Couldn't delete phones! :(");
     }
    });
  });
});
//Sorting the tables
//Sorting function source: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_sort_table
//Sort table function is also ale to for for dynamic table(id="phones")
  // However since  we could not make the apppenTo or appenChild work, it is not visible on frontend.
  // Again, the function is built to sort  both dynamic and static table as seen.
function sortTable(n, id) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById(id);
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
