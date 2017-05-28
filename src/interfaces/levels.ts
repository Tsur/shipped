export interface IBoxModel {
  type:string
  color:string
  selected_color?:string
  size:number
}

export interface IPieceModel {
  box:string
  row:number
  col:number
}

export interface ILevelModel {
  title?:string
  difficulty:string
  time:number
  rows:number
  cols:number
  pieces:IPieceModel[]
}
