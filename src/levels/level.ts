import PieceFactory from '../pieces/factory'
import Piece from '../pieces/piece'
import {ILevelModel, IPieceModel} from '../interfaces/levels'
import {IPoint} from '../interfaces/point'

import {
  paintLine
  ,range
} from '../utils'

export default class Level {

  _currentPiece:Piece
  _title:string
  _time:number
  _pieces:Piece[]
  _isLevelFinished:boolean
  _model:ILevelModel

  constructor(
    level:ILevelModel){
    this._model = level
    this._currentPiece = null
    this._time = level.time
    this._isLevelFinished = false
    this._title = level.title || ""
    this._pieces = level.pieces.map(piece => PieceFactory.create(piece))
  }

  public selectPiece(
    point:IPoint):void {
      const piece = this._getPiece(point)
      if(!piece) return;
      if(this._currentPiece) this._currentPiece.setSelected(false)
      this._currentPiece = piece
      this._currentPiece.setSelected(true)
  }

  public nextStage(
    point:IPoint):boolean {
    if(this._isLevelFinished) return true;
    this._movePieceTo(point)
    if(this._currentPiece &&
      this._currentPiece.isMain() &&
      this._currentPiece.getCol() === 4)
      this._isLevelFinished = true
    return this._isLevelFinished;
  }

  public getTime():number {
    return this._time
  }

  public getTitle():string {
    return this._title
  }

  public paint(
    context:CanvasRenderingContext2D):void {
    this._paintGrid(context)
    this._paintPieces(context)
  }

  private _paintGrid(
    context:CanvasRenderingContext2D):void{
    const size = ~~context.canvas.width/6
    // Paint Vertical Lines
    for (let i=1; i <= 5; i++){
      paintLine(context, (i*size), 0, (i*size), context.canvas.height, "rgba(255, 255, 255, 0.1)", .5)
    }
    // Paint Horizontal Lines
    for (let j=1; j <= 5; j++){
      paintLine(context, 0, (j*size), context.canvas.width, (j*size), "rgba(255, 255, 255, 0.1)", .5)
    }
  }

  private _paintPieces(
    context:CanvasRenderingContext2D):void {
    this._pieces.forEach(piece => piece.paint(context))
  }

  private _getPiece(
    point:IPoint):Piece {
    for(let piece of this._pieces){
      if(piece.isAt(point)) return piece
    }
  }

  private _canPlaceOn(
    point:IPoint):boolean {
    let row
    const piece = this._currentPiece
    if(!!this._getPiece(point)) return false
    switch(piece.constructor.name){
      case 'HorizontalPiece':
        if(point.y != piece.getRow()) return false
        row = range(0, 6).map(i =>
          (piece.isAt({y:point.y, x:i})) ?
          false : !!this._getPiece({y:point.y, x:i}))
        return range(piece.getCol(), point.x).every(i => row[i] === false)
      case 'VerticalPiece':
        if(point.x != piece.getCol()) return false
        row = range(0, 6).map(i =>
          (this._currentPiece.isAt({y:i, x:point.x})) ?
          false : !!this._getPiece({y:i, x:point.x}))
        return range(piece.getRow(), point.y).every(i => row[i] === false)
      default:
        return false;
    }
  }

  private _movePieceTo(
    point:IPoint):void {
    if(!this._currentPiece ||
      !this._canPlaceOn(point)) return
    this._currentPiece.moveTo(point)
  }

  public isDone():boolean {
    return this._isLevelFinished;
  }

  public reset():void {
    this._currentPiece = null
    this._time = this._model.time
    this._isLevelFinished = false
    this._title = this._model.title || ""
    this._pieces = this._model.pieces.map(piece => PieceFactory.create(piece))
  }

}
