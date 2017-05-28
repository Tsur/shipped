import {
  lpadTime
} from './utils'

export default class UIManager {

  _time
  _timeElement
  _onTime
  _onNoTime
  _timeEnabled
  _timerID
  _lifesElement
  _levelTextElement
  _retryBtn
  _nextBtn
  _resetBtn
  _continueBtn
  _gameoverText

  constructor(){
    this._timeEnabled = true
  }

  public displayLife(
    domElement:Element,
    lifes:number):void {
      this._lifesElement = document.querySelector('.ui-lifes')
      for(let i=0; i<lifes; i++){
        const life = document.createElement('img')
        life.classList.add('life')
        life.src = './assets/life.svg'
        this._lifesElement.appendChild(life)
      }
  }

  public resetLifes():void {
      const lifes = Array.from(this._lifesElement.querySelectorAll('.no-life'))
      lifes.forEach(life => {
        const _life = (<HTMLImageElement>life)
        _life.classList.remove('no-life')
        _life.classList.add('life')
        _life.src = './assets/life.svg'
      })
  }

  public reduceLife():void {
      const lifes = Array.from(this._lifesElement.querySelectorAll('.life'))
      const lastLife = lifes[0];
      if(lastLife) {
        const _lastLife = (<HTMLImageElement>lastLife)
        _lastLife.classList.remove('life')
        _lastLife.classList.add('no-life')
        _lastLife.src = './assets/life2.svg'
      }
  }

  public displayBackground(
    bg:string):void {
      const bgImg = document.createElement('img');
      bgImg.src = `./assets/${bg}.jpg`;
      bgImg.classList.add('ui-bg')
      document.body.appendChild(bgImg)
  }

  public resetTime(
    time:number):void{
    this._time = time
    this._timeEnabled = true
    this._calculeTime()
  }

  public disableTime():void{
    this._timeEnabled = false
    this._timeElement.classList.remove('alert')
    if(this._timerID) clearTimeout(this._timerID)
  }

  private _calculeTime():void{
      const timeMinutes = ~~(this._time/60)
      const timeSeconds = this._time - (timeMinutes*60)
      this._timeElement.classList[this._time<=10? 'add': 'remove']('alert')
      this._timeElement.textContent = `Time ${lpadTime(timeMinutes)}:${lpadTime(timeSeconds)}`
      if(!this._time) return this._onTime()
      this._time--
      if(this._time<5) this._onNoTime()
      if(this._timeEnabled) this._timerID = setTimeout(()=>this._calculeTime(), 1000)
  }

  public displayTime(
    domElement:Element,
    time:number,
    onNoTime,
    onTime):void {
      const timeContainer = document.createElement('div')
      const timeTextElement = document.createElement('p')
      timeContainer.appendChild(timeTextElement)
      timeContainer.classList.add('ui-time-info')
      domElement.appendChild(timeContainer)
      this._timeElement = timeTextElement
      this._time = time
      this._onTime = onTime
      this._onNoTime = onNoTime
      this._calculeTime()
  }

  public displayLevel(
    domElement:Element,
    title:string,
    difficulty?:string):void {
      const levelContainer = document.createElement('div')
      this._levelTextElement = document.createElement('p')
      this._levelTextElement.textContent = `${title}`
      levelContainer.appendChild(this._levelTextElement)
      levelContainer.classList.add('ui-level-info')
      domElement.appendChild(levelContainer)
  }

  public setClose():void {
      const closeBtn = document.querySelector('.ui-close-btn')
      if(!closeBtn) return
      closeBtn.addEventListener('click', () => {
        const {ipcRenderer} = require('electron')
        ipcRenderer.send('close-main-window');
      })
  }

  public updateLevel(
    title:string,
    difficulty?:string):void {
      this._levelTextElement.textContent = `${title}`
  }

  public setSoundControl(
    domElement:Element, onToggleSound):void {
    const soundControl = domElement.querySelector('.ui-sound-btn')
    if(!soundControl) return
    soundControl.addEventListener('click', () => {
      soundControl.classList.toggle('enabled')
      onToggleSound()
    })
  }

  public setMenu(
    domElement:Element,
    onRetryLevel,
    onNext,
    onReset,
    onContinue):void {
      this._retryBtn = domElement.querySelector('.ui-retry-btn')
      this._nextBtn = domElement.querySelector('.ui-next-btn')
      this._resetBtn = domElement.querySelector('.ui-reset-btn')
      this._continueBtn = domElement.querySelector('.ui-continue-btn')
      this._gameoverText = domElement.querySelector('.ui-gameover-text')
      this._retryBtn.addEventListener('click', onRetryLevel)
      this._nextBtn.addEventListener('click', onNext)
      this._resetBtn.addEventListener('click', onReset)
      this._continueBtn.addEventListener('click', onContinue)
  }

  public displayMenu(
    domElement:Element,
    scene:string='success'):void {
      this._retryBtn.classList.add('hide')
      this._nextBtn.classList.add('hide')
      this._resetBtn.classList.add('hide')
      this._gameoverText.classList.add('hide')
      this._continueBtn.classList.add('hide')

      switch(scene){
        case 'gameover':
          this._resetBtn.classList.remove('hide')
          this._continueBtn.classList.remove('hide')
          this._gameoverText.classList.remove('hide')
          break
        case 'fail':
          this._retryBtn.classList.remove('hide')
          break
        case 'success':
          this._retryBtn.classList.remove('hide')
          this._nextBtn.classList.remove('hide')
          break
        case 'end':
          this._gameoverText.textContent = "Now you see it and got free ..."
          this._gameoverText.classList.remove('hide')
          break
      }
      domElement.classList.add('hover')
  }

  public hideMenu(
    domElement:Element):void {
      domElement.classList.remove('hover')
  }

  public setLoading(status:boolean):void {
      document.querySelector('.loading')
        .classList[status === true ? 'remove': 'add']('hide')
  }

}
