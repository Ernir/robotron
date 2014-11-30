// ==============
// MOUSE HANDLING
// ==============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var g_mouseX = 0,
    g_mouseY = 0,
	g_isMouseDown = false,

	$win = $(window),
	w = 0,h = 0,
	rgba = [],
	getWidth = function() {
		w = $win.innerWidth();
		h = $win.innerHeight();
	};

//Background color listens to mouse position
$win.resize(getWidth).mousemove(function(e) {
    rgba = [Math.round(e.pageX/w * 255),Math.round((h-e.pageY)/h * 255),50, 0.90];
    if ($(".canvasContainer:hover").length > 0) {
    	$(document.body).css('background','black');
		$(document.body).css('transition','background 0.5s ease-out');
	} else {
		$(document.body).css("transition", "");
		$(document.body).css('background','rgba('+rgba.join(',')+')');
	}
}).resize();

//Navigation menu interavtivity
if($("#highscoreTable").length!==0) $("li#navHS").removeClass("hidden");
$("h2").click(function() {$(this).parent().find("article").toggle("slow");});
$('a[href="#highscore"]').click(function() {$(".highscore article").toggle("slow");});
$('a[href="#instructions"]').click(function() {$(".instructions article").toggle("slow");});
$('a[href="#controls"]').click(function() {$(".controls article").toggle("slow");});
$('a[href="#about"]').click(function() {$("#about article").toggle("slow");});

function handleMouseMove(evt) {
    
	// Renew mouse positions
    g_mouseX = evt.clientX - g_canvas.offsetLeft;
    g_mouseY = evt.clientY - g_canvas.offsetTop;
}

function handleMouseDown(evt) {
    
    // Set mouseDown
	g_isMouseDown = true;
}

function handleMouseUp(evt) {
    
	// Set mouseDown to false
	g_isMouseDown = false;
}

// Handle "up", "down" and "move" events separately.
window.addEventListener("mousedown", handleMouseDown);
window.addEventListener("mousemove", handleMouseMove);
window.addEventListener("mouseup", handleMouseUp);

function renderCrosshair(ctx) {
	
	ctx.save();
	ctx.beginPath();
	ctx.lineWidth = 3;
	ctx.moveTo(g_mouseX - 10, g_mouseY);
	ctx.lineTo(g_mouseX + 10, g_mouseY);
	ctx.moveTo(g_mouseX, g_mouseY - 10);
	ctx.lineTo(g_mouseX, g_mouseY + 10);
	ctx.closePath();
	ctx.strokeStyle = 'white';
	ctx.stroke();
	ctx.restore();
}