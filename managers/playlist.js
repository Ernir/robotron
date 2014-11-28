//============
//BGM PLAYLIST
//============
/*
 playlist.js

 A module which contains a list of background music and
 handles playing them.
 */
 
 var g_bgm = {
 
	// Private Data
	//
	
	_list: [],
	_currentSong: 0,
	_volume: 1,
	
	
	// Public Methods
	//
	
	init: function () {
		this._list.push(new Audio(g_bgmUrls.music));
		this._list.push(new Audio(g_bgmUrls.instarem));
		this._list.push(new Audio(g_bgmUrls.CrazyComets));

		// Handle song changing
		for (var i = 0; i < this._list.length; i++) {
			this._list[i].addEventListener("ended", this.nextSong);
		}
		console.log(this._list);
	},
	
	play: function () {
		this._list[this._currentSong].play();
	},
	
	pause: function () {
		this._list[this._currentSong].pause();
	},
	
	reset: function () {
		this._list[this._currentSong].currentTime = 0;
	},
	
	getVolume: function () {
		return this._volume;
	},
	
	incVolume: function () {
		if (this._volume < 1) {
			if (this._volume + 0.05 > 1) this._volume = 1;
			else this._volume += 0.05;
			this._list[this._currentSong].volume = this._volume;
		}
	},
	
	decVolume: function () {
		if (this._volume > 0) {
			if (this._volume - 0.05 < 0) this._volume = 0;
			else this._volume -= 0.05;
			this._list[this._currentSong].volume = this._volume;
		}
	},
	
	nextSong: function (evt) {
		g_bgm.pause();
		g_bgm.reset();
		g_bgm._currentSong++;
		if (g_bgm._currentSong >= g_bgm._list.length) g_bgm._currentSong = 0;
		g_bgm.play();
	},
	
	prevSong: function (evt) {
		g_bgm.pause();
		g_bgm.reset();
		g_bgm._currentSong--;
		if (g_bgm._currentSong < 0) g_bgm._currentSong = g_bgm._list.length - 1;
		g_bgm.play();
	}
}

g_bgm.init();