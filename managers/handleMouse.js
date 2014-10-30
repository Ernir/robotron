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
    g_mouseY = 0;

function handleMouse(evt) {
    
    g_mouseX = evt.clientX - g_canvas.offsetLeft;
    g_mouseY = evt.clientY - g_canvas.offsetTop;
    
    // If no button is being pressed, aim crosshairs
    var button = evt.buttons === undefined ? evt.which : evt.buttons;
    if (!button) return;
    
    // TODO: Add mouse-specific logic here
	entityManager.fireBullet(g_mouseX, g_mouseY);
}

// Handle "down" and "move" events the same way.
window.addEventListener("mousedown", handleMouse);
window.addEventListener("mousemove", handleMouse);

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