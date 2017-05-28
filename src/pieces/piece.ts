import {IBoxModel} from '../interfaces/levels'
import {IPoint} from '../interfaces/point'
import {
  paintRect
  ,range
} from '../utils'

abstract class Piece {

  protected _type:string
  protected _color:string
  protected _scolor:string
  protected _row:number
  protected _col:number
  protected _size:number
  protected _selected:boolean
  protected _main:boolean

  constructor(
    row:number,
    col:number,
    box:IBoxModel) {
    this._color = box.color
    this._scolor = box.selected_color || box.color
    this._row = row
    this._col = col
    this._size = box.size
    this._selected = false
    this._main = (row === 2 && box.type === 'h') || false
  }

  public getCol():number {
    return this._col;
  }

  public getRow():number {
    return this._row;
  }

  public getSize():number {
    return this._size;
  }

  public setSelected(
    selected:boolean):void {
    this._selected = selected
  }

  public isMain():boolean {
    return this._main
  }

  abstract isAt(point:IPoint):boolean
  abstract paint(context:CanvasRenderingContext2D):void
  abstract moveTo(point:IPoint):void
}

export default Piece
