import { BehaviorSubject, interval } from 'rxjs'
import { scan, switchMap } from 'rxjs/operators'
import { Letter, Letters, State } from './types'

console.clear()

const randomLetter = () => {
  return String.fromCharCode(
    Math.random() * ('z'.charCodeAt(0) - 'a'.charCodeAt(0)) + 'a'.charCodeAt(0)
  )
}
const gameWidth = 30
const levelChangeThreshold = 20
const speedAdjust = 50
const endThreshold = 15

const intervalSubject = new BehaviorSubject(600)

const letters$ = intervalSubject.pipe(
  switchMap((i) =>
    interval(i).pipe(
      scan<number, Letters>(
        (letters) => ({
          intrvl: i,
          ltrs: [
            {
              letter: randomLetter(),
              yPos: Math.floor(Math.random() * gameWidth),
            },
            ...letters.ltrs,
          ],
        }),
        { ltrs: [], intrvl: 0 }
      )
    )
  )
)
