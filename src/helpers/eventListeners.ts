export const attachEventListeners = (pressedKey: Record<string, boolean>) => {
  window.onkeyup = function (e: KeyboardEvent) {
    pressedKey[e.keyCode] = false
  }
  window.onkeydown = function (e: KeyboardEvent) {
    pressedKey[e.keyCode] = true
  }
}
