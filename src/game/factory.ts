import * as gameLevels from '../levels/models/index'
import Game from './game'

export default class GameFactory {

  static GAME_EASY = 'easy'
  static GAME_NORMAL = 'normal'
  static GAME_ADVANCED = 'advanced'
  static GAME_EXPERT = 'expert'
  static GAME_ALL_LEVELS = 'all'

  static create(
    type: string) {
    let levels
    const containerDomElement = document.querySelector('.app')
    if(!containerDomElement) throw new Error('No container Dom Element found')
    switch(type) {
      case GameFactory.GAME_EASY:
      case GameFactory.GAME_NORMAL:
      case GameFactory.GAME_ADVANCED:
      case GameFactory.GAME_EXPERT:
        levels = Object.values(gameLevels)
          .filter(level => level.difficulty === type)
        return new Game(containerDomElement, levels)
      case GameFactory.GAME_ALL_LEVELS:
        levels = Object.values(gameLevels)
        return new Game(containerDomElement, levels)
      default:
        throw Error('No GAME_TYPE specified')
    }
  }

}
