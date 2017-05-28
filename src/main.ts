import GameFactory from './game/factory'

// Run the game once browser has stopped loading resources
window.onload = () => GameFactory.create(GameFactory.GAME_ALL_LEVELS)
