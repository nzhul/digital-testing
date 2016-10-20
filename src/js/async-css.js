'use strict'

const raf = window.requestAnimationFrame

const loadCss = (url) => {
  let head = document.head
  let link = document.createElement('link')
  if (!head) return
  link.rel = 'stylesheet'
  link.href = url
  head.appendChild(link)
}

const asyncCss = (url) => {
  if (raf) raf(() => setTimeout(() => loadCss(url), 0))
  else window.addEventListener('load', () => loadCss(url), false)
}

export default asyncCss
