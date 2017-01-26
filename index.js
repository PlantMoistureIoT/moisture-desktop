$(document).ready(() => {
  var online = navigator.onLine;
  if(online){
    $(".net-status").html("<i class=\"fa fa-globe fa-2x\"></i> Connected");
  }
  else{
    $(".net-status").html("<i class=\"fa fa-globe fa-2x\"></i> Not Connected");
  }
});
