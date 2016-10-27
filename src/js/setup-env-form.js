'use strict'

let repeat = 0
let animating = false
const raf = requestAnimationFrame

const start = (progress, count) => {
  repeat = 0
  progress.value = progress.min
  !animating && next(progress, count)
}

const next = (progress, max) => {
  animating = true
  if (progress.value < progress.max) {
    progress.value += (progress.step || 1)
  }
  else {
    if (++repeat >= max) {
      animating = false
      return
    }
    progress.value = progress.min
  }
  raf(() => next(progress, max))
}

const handler = (event) => {
  start(document.querySelector('#js-bar1'), 2)
  // start(document.querySelector('#js-bar2'), 2)
  // start(document.querySelector('#js-bar3'), 3)
  // start(document.querySelector('#js-bar4'), 2)
  event.preventDefault()
}

const init = () => {
  let button = document.querySelector('#js-submit')
  let success = document.querySelector('#js-form-ok')

  if (!button) return

  button.addEventListener('click', () => success.classList.remove('-dn'), false)
  button.addEventListener('click', handler, false)
}

export default { init }
