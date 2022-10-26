export const calcCounter = (
  counter: number,
  startTime: number,
): [number, number] => {
  let elapsedTime = performance.now() - startTime
const fpsElem = document.querySelector('#fps')


  startTime = performance.now()

  counter++
  let ffps = 1000 / elapsedTime

  if (counter > ffps) {
    fpsElem.textContent = ffps.toFixed(1)

    counter = 0
  }

  return [elapsedTime, counter]
}
