import {IPoint} from './interfaces/point'

export function createCanvas():HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  return canvas
}

export function getPointFromEvent(
  event:MouseEvent,
  canvas:HTMLCanvasElement):IPoint {
  const rect = canvas.getBoundingClientRect()
  const size = ~~canvas.width/6
  const x = Math.floor((event.clientX - rect.left) / size)
  const y = Math.floor((event.clientY - rect.top) / size)
  return {x, y}
}

export function paintLine(
  canvasCtx:CanvasRenderingContext2D,
  x:number,
  y:number,
  x2:number,
  y2:number,
  color:string,
  lineWidth:number):void {
	canvasCtx.beginPath()
	canvasCtx.moveTo(x, y)
	canvasCtx.lineTo(x2, y2)
	canvasCtx.strokeStyle = color ? color: canvasCtx.strokeStyle
	canvasCtx.lineWidth = lineWidth ? lineWidth: canvasCtx.lineWidth
	canvasCtx.stroke()
}

export function paintRect(
  canvasCtx:CanvasRenderingContext2D,
  x:number,
  y:number,
  width:number,
  height:number,
  size:number,
  color:string='#FFF',
  borderColor:string='#000',
  thickness:number=1):void {
  const increment = size/6
  const radius = 10
  // canvasCtx.fillStyle= borderColor
  // canvasCtx.fillRect(x - (thickness), y - (thickness), width + (thickness * 2), height + (thickness * 2))
  canvasCtx.lineJoin = "round";
  canvasCtx.lineWidth = radius; //radius
  canvasCtx.strokeStyle= color
  canvasCtx.fillStyle= color
  canvasCtx.strokeRect(x+increment+(radius/2), y+increment+(radius/2), width - (increment*2) - radius, height - (increment*2) - radius);
  canvasCtx.fillRect(x+increment+(radius/2), y+increment+(radius/2), width - (increment*2) - radius, height - (increment*2) - radius);
  // canvasCtx.fillRect(x+increment, y+increment, width - (increment*2), height - (increment*2))
}

export function range(
  from:number,
  to:number):number[] {
  if(from > to) return [...Array(from-to).keys()].map(e => e+to)
  return [...Array(to-from).keys()].map(e => e+from)
}

export function lpadTime(
  time:number):string{
  return time < 10 ? `0${time}` : `${time}`
}
