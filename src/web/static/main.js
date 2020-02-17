
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

// We need a route for start, reset, and stop
// We need to make the interface pause when the action is done
// We need to make the the buffer share a timestamp so we don't redo and old tasks
// Would be great if there was a way to read responses from the machine