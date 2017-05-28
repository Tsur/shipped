import Level from './level'
import {ILevelModel} from '../interfaces/levels'

export default class EasyLevel extends Level {

  difficulty:string

  constructor(
    level:ILevelModel){
    super(level)
    this.difficulty = 'easy'
  }

  public getDifficulty():string {
    return this.difficulty
  }
}
