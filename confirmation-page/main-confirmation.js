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

const onClickConfirmarReserva = async () => {
  console.log(localStorage.getItem('id_estacao_trabalho'))
  const response = await fetch('http://orangepoint.herokuapp.com/reservas', {
    method: 'POST',
    body: JSON.stringify({
      data_reserva: localStorage.getItem('data_reserva'),
      id_estacao_trabalho: localStorage.getItem('id_estacao_trabalho'),
      id_unidade_negocio: localStorage.getItem('id_unidade_negocio'),
      solicitacao_material: localStorage.getItem('solicitacao_material'),
      id_usuario: localStorage.getItem('id'),
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const myJson = await response.json();
  if(myJson.id !== null && myJson.id !== undefined && myJson.id !== "") {
    document.location.href = "../sucess-booking/sucess.html";
  } else {
    alert(myJson);
  }
}

const preencherCamposConfirmacao = () => {
  console.log("preencher campos");
  console.log(localStorage.getItem('unidade_negocio'))
  document.getElementById("unidade_negocio").innerHTML = localStorage.getItem('unidade_negocio');
  document.getElementById("data_reserva").innerHTML = localStorage.getItem('data_reserva_formatada');
  document.getElementById("estacao_trabalho").innerHTML = localStorage.getItem('estacao_trabalho');
  document.getElementById("solicitacao_material").innerHTML = localStorage.getItem('solicitacao_material');
}

preencherCamposConfirmacao();
