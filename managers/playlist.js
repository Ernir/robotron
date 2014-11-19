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
		this._list.push(new Audio(g_bgmUrls.todIOF));

		// Handle song changing
		for (var i = 0; i < this._list.length; i++) {
			this._list[i].addEventListener("ended", g_bgm.nextSong);
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
		this.pause();
		this.reset();
		this._currentSong++;
		if (this._currentSong >= this._list.length) this._currentSong = 0;
		this.play();
	},
	
	prevSong: function (evt) {
		this.pause();
		this.reset();
		this._currentSong--;
		if (this._currentSong < 0) this._currentSong = this._list.length - 1;
		this.play();
	}
}

g_bgm.init();