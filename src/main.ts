import { BehaviorSubject, fromEvent, interval, combineLatest } from 'rxjs'
import { scan, startWith, switchMap, map, takeWhile } from 'rxjs/operators'
import { Letters, State } from './types'

const randomLetter = () => {
  return String.fromCharCode(
    Math.random() * ('z'.charCodeAt(0) - 'a'.charCodeAt(0)) + 'a'.charCodeAt(0)
  )
}
const gameWidth = 30
const endThreshold = 15
const levelChangeThreshold = 20
const speedAdjust = 50

const intervalSubject = new BehaviorSubject(600)

/** Observable que permite la generación aleatoria de letras. */
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

/** Observable que captura las teclas presionadas. */
const keys$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
  startWith({ key: '' }),
  map((e: KeyboardEvent) => e.key)
)

/** Permite renderizar el juego a partir de su estado actual. */
const renderGame = (state: State) => (
  (document.body.innerHTML = `Score: ${state.score}, Level: ${state.level} <br />`),
  state.letters.forEach(
    (l) =>
      (document.body.innerHTML += '&nbsp'.repeat(l.yPos) + l.letter + '<br />')
  ),
  (document.body.innerHTML +=
    '<br />'.repeat(endThreshold - state.letters.length - 1) +
    '-'.repeat(gameWidth))
)
const noop = () => {}
const renderGameOver = () => (document.body.innerHTML += '<br />GAME OVER!')

/** Observable que encapsula la lógica del juego combinando lo producido por los observables keys$ y letters$. */
const game$ = combineLatest(keys$, letters$).pipe(
  scan<[string, Letters], State>(
    (state, [key, letters]) => (
      letters.ltrs[letters.ltrs.length - 1] &&
      letters.ltrs[letters.ltrs.length - 1].letter === key
        ? ((state.score = state.score + 1), letters.ltrs.pop())
        : noop,
      state.score > 0 && state.score % levelChangeThreshold === 0
        ? ((letters.ltrs = []),
          (state.level = state.level + 1),
          (state.score = state.score + 1),
          intervalSubject.next(letters.intrvl - speedAdjust))
        : noop,
      { score: state.score, letters: letters.ltrs, level: state.level }
    ),
    { score: 0, letters: [], level: 1 }
  ),
  takeWhile((state: State) => state.letters.length < endThreshold) // esta es la marca del final del juego
)

game$.subscribe(renderGame, noop, renderGameOver)
