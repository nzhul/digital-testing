import pubsub from 'pubsub-js'

(function() {
'use strict'

if (!document.querySelector('#scheduling-dialog')) return

var schedulingBtn = $(".scheduling-button");
var myWindow = document.querySelector('#scheduling-dialog')
const raf = requestAnimationFrame

schedulingBtn.on('click', (event) => {
  myWindow.open()
  event.preventDefault()
  event.stopPropagation()
})

window.addEventListener('WebComponentsReady', () => {

  const period = document.querySelector('#js-period')
  const periodItems = Array.from(period.querySelectorAll('paper-item'))
  const dateAt = document.querySelector('#js-date-at')
  const dateOn = document.querySelector('#js-date-on')
  const fakeInput = document.querySelector('#js-fake-input-file')
  const realInput = document.querySelector('#js-input-file')

  periodItems.forEach((item) => {
    item.addEventListener('click', (event) => {
      let topic = period.value.toLowerCase().replace(' ', '.')
      console.log(topic)
      pubsub.publish(topic)
    }, false)
  })

  pubsub.subscribe('every.month', () => {
    dateAt.classList.remove('-dn')
    dateOn.classList.remove('-dn')
  })

  pubsub.subscribe('every.day', () => {
    dateAt.classList.remove('-dn')
    dateOn.classList.add('-dn')
  })

  fakeInput.addEventListener('click', () => {
    realInput.focus()
    realInput.click()
    setTimeout(() => {
      fakeInput.value = 'UI.Tests.Package.zip'
    }, 200)
  }, false)

})


})()
