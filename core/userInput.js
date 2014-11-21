// =================
// User text input HANDLING
// =================

document.addEventListener("DOMContentLoaded",function(){
	var form = document.getElementById("form");
	form.addEventListener("submit", add, false);
});

function add(e) {
	e.preventDefault();
	console.log("ADD");
	postScore();
	document.getElementById("formDiv").className = "hidden";

}

function postScore() {
	console.log("SCORE");
	var str = document.getElementById("text");
	var name = str.value;
	console.log(name);
	if(name!==""){
		console.log("NOT EMPTYSTR");
		var xmlhttp;
		if (window.XMLHttpRequest) {
			// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp=new XMLHttpRequest();
		} else { // code for IE6, IE5
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.onreadystatechange=function() {
			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
				/*var p = document.createElement("p");
				var t = document.createTextNode(xmlhttp.responseText);
				p.appendChild(t);
				document.getElementById("output").appendChild(p);*/
				document.getElementById("output").innerHTML=xmlhttp.responseText;
			}
		}
		console.log("GONNA POST");
		xmlhttp.open("POST","phplogic/savescore.php?name="+name+"&score="+Player.getScore(),true);
		xmlhttp.send();
		console.log("SENT!");
	}
}