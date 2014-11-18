// =================
// User text input HANDLING
// =================

function $(id) {
	return document.getElementById(id);
}

document.addEventListener("DOMContentLoaded",function(){
	var form = $("form");
	form.addEventListener("submit", add, false);
});

function add(e) {
	e.preventDefault();
	var text = $("text");
	//if(!text.value.match("")){
		//var p = document.createElement("p");
		//var t = document.createTextNode(text.value);
		//p.appendChild(t);
		//$("output").appendChild(p);
	//}
	document.getElementById("formDiv").className = "hidden";
}