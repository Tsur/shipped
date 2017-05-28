import {ILevelModel} from '../interfaces/levels'
import Level from './level'
import EasyLevel from './easy'
// import NormalLevel from './normal_level';
// import HardLevel from './hard_level';

export default class LevelFactory {
  static create(
    level:ILevelModel):Level {
    switch(level.difficulty){
      case 'easy':
        return new EasyLevel(level)
      default:
        return new EasyLevel(level)
    }
  }
}
