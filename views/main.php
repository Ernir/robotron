
		<main>
			<div id="output">
			<?php 
				//When the site loads for the first time.
				$highscores = new Highscores(new PDO('sqlite:phplogic/highscores.db'));
				$highscores->ShowHighscores();
			?>
			
			</div>

			<section class="instructions">
				<h2 id="instructions">INSTRUCTIONS</h2>
				<article>
					<h3>Story</h3>
					<figure class="figureSide">
						<img src="http://cdn.wikimg.net/strategywiki/images/c/cb/Robotron_2084_player.png" alt="The Robotron player">
						<figcaption>
							<p>The Player</p>
							<p>Downloaded from: </p>
							<a href="http://strategywiki.org/wiki/Robotron:_2084/How_to_play/">StrategyWiki</a>
						</figcaption>
					</figure>
					<p>
						Inspired by his never ending quest for progress, in 2084 man perfects 
						the Robotrons: a robot species so advanced that man is inferior to his 
						own creation. Guided by their infallible logic, the Robotrons conclude: 
						The human race is inefficient, and therefore must be destroyed.<br>
						<br>
						You are the last hope of mankind. Due to a genetic engineering error, 
						you possess superhuman powers. Your mission is to stop the Robotrons, 
						and save the last human family: Mommy, Daddy, and Mikey.
					</p>
				</article>

				<article>
					<h3>Gameplay summary</h3>
					<figure class="figureTop">
						<img src="http://cdn.wikimg.net/strategywiki/images/8/8f/Robotron_2084_cpanel.png" alt="The Robotron controller">
						<figcaption>
							<p>The original controller</p>
							<p>Downloaded from: </p>
							<a href="http://strategywiki.org/wiki/Robotron:_2084/How_to_play/">StrategyWiki</a>
						</figcaption>
					</figure>
					<ul>
						<li>You control the player with two joysticks. One directs the movement while the other indicates which direction to fire in.</li>
						<li>You must eliminate every robot (except Hulks) in the wave to advance to the next round.</li>
						<li>You must avoid touching any robot or bullets or you will lose a life.</li>
						<li>Gather up members of the "last" family for bonus points.</li>
						<li>Some robots will spawn other robots if you do not destroy them quickly enough.</li>
						<li>On Brain waves, gather as many family members before Brain robots turn them into mindless Prog zombies.</li>
						<li>Enemies can drop various powerups which can enhance your gameplay.</li>
						<li>
							<a href= "http://strategywiki.org/wiki/Robotron:_2084/How_to_play">
								More info about how the enemies and the scoring system works.
							</a>
						</li>
					</ul>
				</article>
			</section>

			<section class="controls">
				<h2 id="controls">CONTROLS</h2>
				<article class="movement">
					<h3>Movement</h3>
					<ul>
						<li>W = move up</li>
						<li>A = move left</li>
						<li>S = move down</li>
						<li>D = move right</li>
					</ul>
				</article>

				<article class="firing">
					<h3>Fire weapon</h3>
					<ul>
						<li>Arrow keys = fire in the arrow's direction</li>
						<li>Mouse movement = aim</li>
						<li>Mouse click = fire</li>
					</ul>
				</article>
				<article class="toggles">
					<h3>Toggles</h3>
					<ul>
						<li>M = Music on/off</li>
						<li>N = Sound effects on/off</li>
						<li>R = Start/Restart game</li>
						<li>P = Pause/Resume game</li>
						<li>O = When paused - continue 1 frame</li>
						<li>8 = Previous song</li>
						<li>9 = Next song</li>
						<li>Esc = Quit</li>
						<li>X = Toggle Diagnostics mode (shows red collision circles around entities)</li>
					</ul>
				</article>
				<article class="sliders">
					<h3>Sliders</h3>
					<ul>
						<li>Y = Increase music volume</li>
						<li>H = Decrease music volume</li>
					</ul>
				</article>
				<article class="diagnostics">
					<h3>Diagnostics mode</h3>
					<ul>
						<li>+ = Next level</li>
						<li>- = Previous level</li>
						<li>K = Invincible mode on/off</li>
						<li>F = Friendly fire on/off</li>
						<li>0 = Reset powerups</li>
						<li>1 = Extra life</li>
						<li>2 = Speed</li>
						<li>3 = Score multiplier</li>
						<li>4 = Machine gun</li>
						<li>5 = Shotgun</li>
						<li>6 = Shield</li>
						<li>C = Clear the screen on/off</li>
						<li>B = Draw a red box</li>
						<li>U = Draw a white box</li>
						<li>F = Toggle flipflop (only when paused)</li>
						<li>R = Toggle render (only when paused)</li>
						<li>T = Show timer</li>
					</ul>
				</article>
			</section>
		</main>