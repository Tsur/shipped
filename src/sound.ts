function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}

export default class SoundManager {

  _context
  _mousedown
  _mousedownBuffer
  _mouseup
  _mouseupBuffer
  _bg
  _bgBuffer
  _bgPausedAt
  _bgStartedAt
  _success
  _successBuffer
  _doh
  _dohBuffer
  _noTime
  _noTimeBuffer
  _enabled

  constructor() {
    const AudioContext = (<any>window).AudioContext || (<any>window).webkitAudioContext
    this._context = new AudioContext()
    this._enabled = true
  }

  public load(onLoaded){
    const bufferLoader = new BufferLoader(
      this._context,
      [
        './assets/mousedown.mp3',
        './assets/mouseup.mp3',
        './assets/bg.mp3',
        './assets/success.mp3',
        './assets/doh.mp3',
        './assets/no_time.mp3',
      ],
      (bufferList) => {
        this._mousedownBuffer = bufferList[0]
        this._mouseupBuffer = bufferList[1]
        this._bgBuffer = bufferList[2]
        this._successBuffer = bufferList[3]
        this._dohBuffer = bufferList[4]
        this._noTimeBuffer = bufferList[5]
        onLoaded()
      }
    );
    bufferLoader.load()
  }

  public toggleSound():void {
    this._enabled = !this._enabled
    this._toggleBackground()
  }

  private _toggleBackground(){
    if(this._enabled) {
      return this.playBackground(this._bgPausedAt)
    }
    this._bg.disconnect();
    this._bg.stop(0);
    this._bgPausedAt = this._context.currentTime - this._bgStartedAt
    this._bgStartedAt = 0
    this._bg = null;
  }

  public playBackground(
    offset:number = 0):void {
    this._bg = this._context.createBufferSource()
    this._bg.buffer = this._bgBuffer;
    this._bg.loop = true
    this._bgPausedAt = offset
    this._bg.connect(this._context.destination)
    this._bgStartedAt = this._context.currentTime - this._bgPausedAt;
    this._bg.start(0, this._bgPausedAt)
  }

  public playMousedown():void {
    if(!this._enabled) return
    if(this._mousedown) {
      this._mousedown.disconnect();
      this._mousedown.stop(0);
      this._mousedown = null;
    }
    this._mousedown = this._context.createBufferSource();
    this._mousedown.buffer = this._mousedownBuffer;
    this._mousedown.connect(this._context.destination);
    this._mousedown.currentTime = 0;
    this._mousedown.start(0)
  }

  public playMouseup():void {
    if(!this._enabled) return
    if(this._mouseup) {
      this._mouseup.disconnect();
      this._mouseup.stop(0);
      this._mouseup = null;
    }
    this._mouseup = this._context.createBufferSource();
    this._mouseup.buffer = this._mouseupBuffer;
    this._mouseup.connect(this._context.destination);
    this._mouseup.currentTime = 0;
    this._mouseup.start(0)
  }

  public playSuccess():void {
    if(!this._enabled) return
    if(this._success) {
      this._success.disconnect();
      this._success.stop(0);
      this._success = null;
    }
    this._success = this._context.createBufferSource();
    this._success.buffer = this._successBuffer;
    this._success.connect(this._context.destination);
    this._success.currentTime = 0;
    this._success.start(0)
  }

  public playFail():void {
    if(!this._enabled) return
    if(this._doh) {
      this._doh.disconnect();
      this._doh.stop(0);
      this._doh = null;
    }
    this._doh = this._context.createBufferSource();
    this._doh.buffer = this._dohBuffer;
    this._doh.connect(this._context.destination);
    this._doh.currentTime = 0;
    this._doh.start(0)
  }

  public playNoTime():void {
    if(!this._enabled) return
    if(this._noTime) {
      this._noTime.disconnect();
      this._noTime.stop(0);
      this._noTime = null;
    }
    this._noTime = this._context.createBufferSource();
    this._noTime.buffer = this._noTimeBuffer;
    this._noTime.connect(this._context.destination);
    this._noTime.currentTime = 0;
    this._noTime.start(0)
  }

}
