import Piece from './piece'
import {IBoxModel} from '../interfaces/levels'
import {IPoint} from '../interfaces/point'
import {
  paintRect
  ,range
} from '../utils'

export default class HorizontalPiece extends Piece {

  constructor(
    row:number,
    col:number,
    box:IBoxModel) {
    super(row, col, box)
    this._type = 'h'
  }

  public isAt(
    point:IPoint):boolean {
    if(this._row != point.y) return false;
    return range(0, this._size).some(i => point.x === i+this._col);
  }

  public paint(
    context:CanvasRenderingContext2D):void {
    const size = ~~context.canvas.width/6;
    paintRect(
      context,
      this._col*size,
      this._row*size,
      this._size*size,
      size,
      size,
      this._selected ? this._scolor : this._color)
  }

  public moveTo(
    point:IPoint):void {
    if(this.isAt(point)) return;
    const colTarget = point.x;
    if(colTarget > this._col){
      this._col = colTarget + 1 - this._size;
    }
    else{
      this._col = colTarget;
    }
  }
}
