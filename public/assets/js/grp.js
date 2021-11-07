var maxIndex = $("li.graph-bar").length;

for(var i=0; i<maxIndex; i++){
  var val = $("li.graph-bar").eq(i).attr('graph-val');
  $("li.graph-bar").eq(i).css({
    "left": (i+1)*80+"px"
  }).animate({
    "height":val+"%"
  },800);
}