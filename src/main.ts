import { BehaviorSubject } from "rxjs"

console.clear()

const randomLetter = () =>
  String.fromCharCode(
    Math.random() * ("z".charCodeAt(0) - "a".charCodeAt(0)) + "a".charCodeAt(0)
  )

console.log(randomLetter())
