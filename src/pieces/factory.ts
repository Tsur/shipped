import {IPieceModel, IBoxModel} from '../interfaces/levels'
import Piece from './piece'
import VerticalPiece from './vertical'
import HorizontalPiece from './horizontal'
import Boxes from './models/boxes'

export default class PieceFactory {
  static create(
    piece:IPieceModel):Piece {
    const box:IBoxModel = Boxes[piece.box]
    switch(box.type){
      case 'v':
        return new VerticalPiece(piece.row, piece.col, box)
      case 'h':
        return new HorizontalPiece(piece.row, piece.col, box)

    }
  }
}
