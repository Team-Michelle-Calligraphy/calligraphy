
function draw(color, status){
  apiDraw({
    color,
    status
  });
}

function apiDraw(data) {
  $.ajax({
    type: "POST",
    url: "/api/draw",
    data: JSON.stringify(data),
    dataType: "json",
    contentType : "application/json"
  });
}

$(function(){

});