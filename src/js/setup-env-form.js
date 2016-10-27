'use strict'

import pubsub from 'pubsub-js'

let repeat = 0
let animating = false
const raf = requestAnimationFrame

const start = (progress, count) => {
  repeat = 0
  progress.value = progress.min
  !animating && next(progress, count)
  return new Promise((resolve, reject) => {
    pubsub.subscribe('PROGRESS_FINISH', () => resolve('OK'))
  })
}

const next = (progress, max) => {
  animating = true
  if (progress.value < progress.max) {
    progress.value += (progress.step || 1)
  }
  else {
    if (++repeat >= max) {
      animating = false
      pubsub.publish('PROGRESS_FINISH', progress)
      return
    }
    progress.value = progress.min
  }
  raf(() => next(progress, max))
}

const handler = (event) => {
  start(document.querySelector('#js-bar1'), 3)
    .then(() => start(document.querySelector('#js-bar2'), 2))
    .then(() => start(document.querySelector('#js-bar3'), 2))
    .then(() => start(document.querySelector('#js-bar4'), 3))
  event.preventDefault()
}

const init = () => {
  let button = document.querySelector('#js-submit')
  let success = document.querySelector('#js-form-ok')

  if (!button) return

  button.addEventListener('click', () => success.classList.remove('-dn'), false)
  button.addEventListener('click', handler, false)
}



export default { init, start }