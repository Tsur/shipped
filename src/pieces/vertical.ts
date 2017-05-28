import Piece from './piece'
import {IBoxModel} from '../interfaces/levels'
import {IPoint} from '../interfaces/point'
import {
  paintRect
  ,range
} from '../utils'

export default class VerticalPiece extends Piece {

  constructor(
    row:number,
    col:number,
    box:IBoxModel) {
    super(row, col, box)
    this._type = 'v'
  }

  public isAt(
    point:IPoint):boolean {
    if(this._col != point.x) return false;
    return range(0, this._size).some(i => point.y === i+this._row);
  }

  public paint(
    context:CanvasRenderingContext2D):void {
    const size = ~~context.canvas.width/6;
    paintRect(
      context,
      this._col*size,
      this._row*size,
      size,
      this._size*size,
      size,
      this._selected ? this._scolor : this._color)
  }

  public moveTo(
    point:IPoint):void {
    if(this.isAt(point)) return;
    const rowTarget = point.y;
    if(rowTarget > this._row){
      this._row = rowTarget + 1 - this._size;
    }
    else{
      this._row = rowTarget;
    }
  }
}
