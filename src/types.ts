export type Letter = {
  letter: String
  yPos: number
}

export type Letters = {
  ltrs: Letter[]
  intrvl: number
}

export type State = {
  score: number
  letters: Letter[]
  level: number
}
