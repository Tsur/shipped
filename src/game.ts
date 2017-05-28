import LevelFactory from './levels/factory'
import {ILevelModel} from './interfaces/levels'
import Level from './levels/level'
import UIManager from './ui'
import SoundManager from './sound'
import {
  createCanvas
  ,getPointFromEvent
} from './utils'

export default class Game {

  _domElement:Element
  _canvas:HTMLCanvasElement
  _context:CanvasRenderingContext2D
  _levels:Level[]
  _currentLevel:Level
  _lifes:number
  _soundManager:SoundManager
  _uiManager:UIManager

  constructor(
    domElement:Element,
    levels:ILevelModel[]) {
    this._domElement = domElement
    this._canvas = createCanvas()
    this._context = this._canvas.getContext('2d')
    this._levels = levels.map(level => LevelFactory.create(level))
    this._lifes = 3
    this._soundManager = new SoundManager()
    this._uiManager = new UIManager()
    this._soundManager.load(() => this._init())
  }

  private _onmouseup(
    event:MouseEvent,
    canvas:HTMLCanvasElement):void {
    this._soundManager.playMouseup()
    const noNextStage:boolean = this._currentLevel
      .nextStage(getPointFromEvent(event, canvas))
    if(noNextStage) {
      // this._soundManager.playSuccess()
      this._uiManager.disableTime()
      this._uiManager.displayMenu(this._domElement)
    }
  }

  private _onmousedown(
    event:MouseEvent,
    canvas:HTMLCanvasElement):void {
    this._soundManager.playMousedown()
    this._currentLevel.selectPiece(getPointFromEvent(event, canvas))
  }

  private _setSize():void {
    this._canvas.width = this._domElement.getBoundingClientRect().width
    this._canvas.height = this._domElement.getBoundingClientRect().height
  }

  private _setUIManager():void {
    this._uiManager.displayBackground('bg2')
    this._uiManager.displayLife(document.body, this._lifes)
    this._uiManager.displayTime(
      document.body,
      this._currentLevel.getTime(),
      () => {
        this._soundManager.playNoTime()
      },
      () => {
        this._lifes--
        this._uiManager.reduceLife()
        this._uiManager.disableTime()
        this._soundManager.playFail()
        if(!this._lifes) {
          return this._uiManager.displayMenu(this._domElement, 'gameover')
        }
        this._uiManager.displayMenu(this._domElement, 'fail')
      }
    )
    this._uiManager.displayLevel(
      document.body,
      this._currentLevel.getTitle())
      // this._currentLevel.getDifficulty())
    // this._uiManager.displaySettings()
    this._uiManager.setSoundControl(
      document.body,
      this._soundManager.toggleSound.bind(this._soundManager))
    this._uiManager.setMenu(
      this._domElement,
      (event:Event):void => {
        // on retry current level
        this._currentLevel.reset()
        this.run()
        this._uiManager.resetTime(this._currentLevel.getTime())
        this._uiManager.updateLevel(this._currentLevel.getTitle())
        this._uiManager.hideMenu(this._domElement)
      },
      (event:Event):void => {
        // on next level
        this._nextLevel()
        if(!this._currentLevel){
          return this._uiManager.displayMenu(this._domElement, 'end')
        }
        this.run()
        this._uiManager.resetTime(this._currentLevel.getTime())
        this._uiManager.updateLevel(this._currentLevel.getTitle())
        this._uiManager.hideMenu(this._domElement)
      },
      (event:Event):void => {
        // on game over (reset everything)
        this._lifes = 3
        this._uiManager.resetLifes()
        this._reset()
        this._nextLevel()
        this.run()
        this._uiManager.resetTime(this._currentLevel.getTime())
        this._uiManager.updateLevel(this._currentLevel.getTitle())
        this._uiManager.hideMenu(this._domElement)
      },
      (event:Event):void => {
        // on pay and continue everything
        this._lifes = 3
        this._uiManager.resetLifes()
        // this._currentLevel.reset()
        this.run()
        this._uiManager.resetTime(this._currentLevel.getTime())
        this._uiManager.updateLevel(this._currentLevel.getTitle())
        this._uiManager.hideMenu(this._domElement)
      }
    )
    this._domElement.querySelector('.game').appendChild(this._canvas)
  }

  private _playBg():void {
    this._soundManager.playBackground()
  }

  private _init():void {
    this._setSize()
    this._nextLevel()
    this._setUIManager()
    this._setEventListeners()
    this._playBg()
    this.run()
  }

  private _setEventListeners():void {
    const onResize = (event:Event) => {
      if(!this._currentLevel) return;
      this._setSize()
      this.run()
    }
    const onMouseUp = (event:MouseEvent):void => {
      this._onmouseup(event, this._canvas)
      this.run()
    }
    const onMouseDown = (event:MouseEvent):void => {
      this._onmousedown(event, this._canvas)
      this.run()
    }
    const onUnload = (event:Event):void => {
      window.removeEventListener('resize', onResize)
      this._canvas.removeEventListener('mouseup', onMouseUp)
      this._canvas.removeEventListener('mousedown', onMouseDown)
    }
    // Calls to run are meant to prevent calling requestAnimationFrame
    window.addEventListener('resize', onResize)
    this._canvas.addEventListener('mouseup', onMouseUp)
    this._canvas.addEventListener('mousedown', onMouseDown)
    window.onunload = onUnload
  }

  private _reset():void {
    this._levels.forEach(level => level.reset())
  }

  private _nextLevel():void {
    this._currentLevel = this._levels.find(level => !level.isDone())
  }

  public run():void {
    this._context.clearRect(0, 0, this._context.canvas.width, this._context.canvas.height)
    this._currentLevel.paint(this._context)
    // requestAnimationFrame(()=>this.run())
  }

}
