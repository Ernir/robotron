// GENERIC RENDERING

var g_doClear = true;
var g_doBox = false;
var g_undoBox = false;
var g_doFlipFlop = false;
var g_doRender = true;
var g_isRenderPaused = false;

var g_frameCounter = 1;
var g_pauseRenderDu = 0;

var TOGGLE_CLEAR = 'C'.charCodeAt(0);
var TOGGLE_BOX = 'B'.charCodeAt(0);
var TOGGLE_UNDO_BOX = 'U'.charCodeAt(0);
var TOGGLE_FLIPFLOP = 'F'.charCodeAt(0);
var TOGGLE_RENDER = 'R'.charCodeAt(0);

function render(ctx) {
    
	// Get out if skipping (e.g. due to pause-mode) and
	// render pause screen with flashing effect
    //
    if (g_isUpdatePaused && !g_isStepping) {
		if (!g_isRenderPaused && g_pauseRenderDu < 0.75 * SECS_TO_NOMINALS) {
			ctx.save();
			var str = "PAUSED" , hw = g_canvas.width / 2, h = g_canvas.height;
			ctx.textAlign = "center";
			ctx.fillStyle ="white";
			ctx.font = "bold 20px sans-serif";
			ctx.fillText(str, hw, h * 38 / 40);
			
			str = "Press P to resume";
			ctx.font = "bold 10px sans-serif";
			ctx.fillText(str, hw, h * 39 / 40);
			ctx.restore();
			g_isRenderPaused = true;
		}
		if (g_pauseRenderDu < 0.75 * SECS_TO_NOMINALS) return;
		if (g_pauseRenderDu >= 1.5 * SECS_TO_NOMINALS) {
			g_pauseRenderDu = 0;
			g_isRenderPaused = false;
		}
	} else if (g_isStepping) {
		g_isStepping = false;
	}
	
    // Process various option toggles
    //
    if (eatKey(TOGGLE_CLEAR)) g_doClear = !g_doClear;
    if (eatKey(TOGGLE_BOX)) g_doBox = !g_doBox;
    if (eatKey(TOGGLE_UNDO_BOX)) g_undoBox = !g_undoBox;
    if (eatKey(TOGGLE_FLIPFLOP)) g_doFlipFlop = !g_doFlipFlop;
    if (eatKey(TOGGLE_RENDER)) g_doRender = !g_doRender;
    
    // I've pulled the clear out of `renderSimulation()` and into
    // here, so that it becomes part of our "diagnostic" wrappers
    //
    if (g_doClear) util.clearCanvas(ctx);
    
    // The main purpose of the box is to demonstrate that it is
    // always deleted by the subsequent "undo" before you get to
    // see it...
    //
    // i.e. double-buffering prevents flicker!
    //
    if (g_doBox) util.fillBox(ctx, 200, 200, 50, 50, "red");
    
    
    // The core rendering of the actual game / simulation
    //
    if (g_doRender) renderSimulation(ctx);
    
    
    // This flip-flip mechanism illustrates the pattern of alternation
    // between frames, which provides a crude illustration of whether
    // we are running "in sync" with the display refresh rate.
    //
    // e.g. in pathological cases, we might only see the "even" frames.
    //
    if (g_doFlipFlop) {
        var boxX = 250,
            boxY = g_isUpdateOdd ? 100 : 200;
        
        // Draw flip-flop box
        util.fillBox(ctx, boxX, boxY, 50, 50, "green");
        
        // Display the current frame-counter in the box...
        ctx.fillText(g_frameCounter % 1000, boxX + 10, boxY + 20);
        // ..and its odd/even status too
        var text = g_frameCounter % 2 ? "odd" : "even";
        ctx.fillText(text, boxX + 10, boxY + 40);
    }
    
    // Optional erasure of diagnostic "box",
    // to illustrate flicker-proof double-buffering
    //
    if (g_undoBox) ctx.clearRect(200, 200, 50, 50);
    
    ++g_frameCounter;
}
