/* abre e fecha o menu quando clicar no icone: hamburger e X */
const nav = document.querySelector('#header nav')
const toggle = document.querySelectorAll('nav .toggle')

for (const element of toggle) {
  element.addEventListener('click', function () {
    nav.classList.toggle('show')
  })
}

/* quando clicar em um item do menu, esconder o menu */
const links = document.querySelectorAll('nav ul li a')

for (const link of links) {
  link.addEventListener('click', function () {
    nav.classList.remove('show')
  })
}

/* mudar o header da página quando der scroll */
const header = document.querySelector('#header')
const navHeight = header.offsetHeight

function changeHeaderWhenScrool() {
  if (window.scrollY >= navHeight) {
    // scroll é maior que a altura do header
    header.classList.add('scroll')
  } else {
    // menor que a altura do header
    header.classList.remove('scroll')
  }
}

/* When Scroll */
window.addEventListener('scroll', function () {
  changeHeaderWhenScrool()
})

/* Button Animation */
var animateButton = function (e) {
  e.preventDefault
  //reset animation
  e.target.classList.remove('animate')

  e.target.classList.add('animate')
  setTimeout(function () {
    e.target.classList.remove('animate')
  }, 700)
}

var bubblyButtons = document.getElementsByClassName('bubbly-button')

for (var i = 0; i < bubblyButtons.length; i++) {
  bubblyButtons[i].addEventListener('click', animateButton, false)
}
