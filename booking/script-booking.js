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

var unidades_negocio = [];
var id_unidade_negocio = "";
var unidade_negocio = "";
var data_reserva = "";
var estacao = "";
var reservas = [];
var reserva_selecionada = {}

const onChangeUnidadeNegocio = () => {
  reservas = [];
  const radios = document.getElementsByName('radio');
  for(var index in radios) {
    if(radios[index].checked) {
      id_unidade_negocio = radios[index].value;
      localStorage.setItem('id_unidade_negocio', id_unidade_negocio);
      for(var index in unidades_negocio) {
        if(unidades_negocio[index].id === id_unidade_negocio) {
          localStorage.setItem('unidade_negocio', unidades_negocio[index].unidade_negocio);
          break;
        }
      }
    }
  }
  buscaEstacoesTrabalho();
}

const onChangeData = () => {

  
  const data = document.getElementById('calendar-icon');

  console.log(data.value);
  if(data.value !== null && data.value !== "") {
    var result = data.value.split('-');
    data_reserva = result[2] + "-" + result[1] + "-" + result[0];
    localStorage.setItem('data_reserva', data_reserva);
    localStorage.setItem('data_reserva_formatada', data_reserva.replaceAll("-","/"));
  }
  buscaEstacoesTrabalho();
}

const buscaEstacoesTrabalho = () => {
  if(data_reserva !== "" && id_unidade_negocio !== null) {
    reservas = [];
    document.getElementById("cards").innerHTML = '';
    getReservasDisponiveis();
  }
}

const getUnidadesNegocio = async () => {
  const response = await fetch('http://orangepoint.herokuapp.com/unidades_negocio', {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json'
      }
  });

  const myJson = await response.json();
  unidades_negocio = myJson;
  for (var index in myJson) {
    document.getElementById("radios").appendChild(createRadioElement(myJson[index]))
  }
}

const createRadioElement = (unit) => {
  const divUnit = document.createElement('div');
  const input = document.createElement('input');
  const span = document.createElement('span');
  const label = document.createElement('label');

  divUnit.classList.add('container');
  divUnit.classList.add('unity');

  input.name = "radio";
  input.type = "radio";
  input.value = unit.id;
  input.onchange = onChangeUnidadeNegocio;

  span.classList.add('checkmark')
  label.classList.add('unidade-negocio')
  label.innerText = unit.unidade_negocio;
 
  divUnit.appendChild(input);
  divUnit.appendChild(span);
  divUnit.appendChild(label);

  return divUnit;
}

const createRow = () => {
  const divRow = document.createElement('div');
  divRow.onclick = {}
  divRow.classList.add('row');
  const divCol = document.createElement('div');
  divRow.onclick = {}
  divCol.classList.add('col')
  divRow.appendChild(divCol);
  return divRow;
}

const createEl = (type, className) => {
  const elem = document.createElement(type);
  elem.onclick = {}
  if(className !== null && className !== '' && className !== "")
    elem.classList.add(className);
  return elem;
}

const typeLabelEl = (className, quantidade, descricao) => {
  const typeLabel = createEl('div', 'type-label');
  typeLabel.onclick = {}
  const icon = createEl('i', descricao === 'Reservas' ? 'icon-TypeCheck' : 'icon-TypeUser');
  icon.onclick = {}
  const span = createEl('span', className);
  span.onclick = {}
  span.innerText = " " + quantidade + " " + descricao;
  typeLabel.appendChild(icon);
  icon.appendChild(span);

  return typeLabel;
}

const onClickCard = (id) => {
  console.log(id);
  document.getElementById(id).classList.add('active');
  for(var index in reservas) {
    if(reservas[index].estacao_trabalho === id) {
      reserva_selecionada = reservas[index];
      console.log(reserva_selecionada)
      console.log(reserva_selecionada.estacao_trabalho + " - Sala de reunião ")
      localStorage.setItem('id_estacao_trabalho', reserva_selecionada.id_estacao_trabalho);
      localStorage.setItem('estacao_trabalho', reserva_selecionada.estacao_trabalho + " - Sala de reunião ");
      localStorage.setItem('reserva_selecionada', reserva_selecionada);
      break;
    }
  }
}

const confirmarReserva = () => {
  localStorage.setItem("solicitacao_material", document.getElementById("story").value)
  document.location.href = "../confirmation-page/index-confirmation.html";
}

const createScheduleElement = (reserva) => {
  const divContainer = createEl('div', 'container');
  const divCard = createEl('div', 'card');
  const divRow1 = createRow();
  const divRow2 = createRow();
  const typeLabel1 = typeLabelEl('', reserva.quantidade_lugares, 'Pessoas');
  const typeLabel2 = typeLabelEl('booking', reserva.quantidade_reservas, 'Reservas');
  const h3 = createEl('h3', 'card-title');
  h3.onclick = {}
  const strong = createEl('strong', '');
  strong.onclick = {}

  strong.innerText = reserva.estacao_trabalho;
  divCard.id = reserva.estacao_trabalho;
  divContainer.addEventListener("click", () => onClickCard(reserva.estacao_trabalho));

  divContainer.appendChild(divCard);
  divCard.appendChild(divRow1);
  divCard.appendChild(divRow2);

  h3.appendChild(strong);
  h3.appendChild(document.createTextNode(" - Sala de reunião"));
  divRow1.firstChild.appendChild(h3);
  divRow2.firstChild.appendChild(typeLabel1);
  divRow2.firstChild.appendChild(typeLabel2);

  return divContainer;
}

const start = () => {
  unidade_negocio = "";
  data_reserva = "";
  estacao = "";
  getUnidadesNegocio();
}

start();

const acessoLogin = () => {
  document.location.href = "../welcome/welcome.html";
}

const getReservasDisponiveis = async () => {
  const response = await fetch('http://orangepoint.herokuapp.com/reservas/disponiveis', {
      method: 'POST',
      body: JSON.stringify({
        data_reserva: data_reserva,
        id_unidade_negocio: id_unidade_negocio
      }),
      headers: {
      'Content-Type': 'application/json'
      }
  });

  const myJson = await response.json();
  console.log(myJson)
  
  reservas = myJson;
  for (var index in myJson) {
    document.getElementById("cards").appendChild(createScheduleElement(myJson[index]))
  }
}
