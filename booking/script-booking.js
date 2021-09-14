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

var unidade_negocio = "";
var data_reserva = "";
var estacao = "";

const onChangeUnidadeNegocio = () => {
  const radios = document.getElementsByName('radio');
  for(var index in radios) {
    if(radios[index].checked) {
      unidade_negocio = radios[index].value;
      console.log(radios[index].value);
    }
  }
}

const onChangeData = () => {
  const data = document.getElementById('calendar-icon');

  console.log(data.value);
  if(data.value !== null && data.value !== "") {
    var result = data.value.split('-');
    data_reserva = result[2] + "-" + result[1] + "-" + result[0];
    console.log(data_reserva);
  }
}

const onChangeTurno = () => {
  const turno = document.getElementById('calendar-icon');
}

const getUnidadesNegocio = async () => {
  const response = await fetch('http://orangepoint.herokuapp.com/unidades_negocio', {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json'
      }
  });

  const myJson = await response.json();
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
  label.innerText = unit.turno;
 
  divUnit.appendChild(input);
  divUnit.appendChild(span);
  divUnit.appendChild(label);

  
  return divUnit;
}

const createRow = () => {
  const divRow = document.createElement('div');
  divRow.classList.add('row');
  const divCol = document.createElement('div');
  divCol.classList.add('col')
  divRow.appendChild(divCol);
  return divRow;
}

const createEl = (type, className) => {
  const elem = document.createElement(type);
  elem.classList.add(className);
  return elem;
}

const typeLabelEl = (className) => {
  const typeLabel = createEl('div', 'type-label');
  const icon = createEl('i', 'icon-TypeUser');
  const span = createEl('span', className);

  typeLabel.appendChild(icon);
  icon.appendChild(span);

  return typeLabel;
}

const createScheduleElement = (reserva) => {
  const divContainer = createEl('div', 'container');
  const divCard = createEl('div', 'card');
  const divRow1 = createRow();
  const divRow2 = createRow();
  const typeLabel1 = typeLabelEl('');
  const typeLabel2 = typeLabelEl('booking');
  const h3 = createEl('h3', 'card-title');
  const strong = createEl('strong', '');


  divContainer.appendChild(divCard);
  divCard.appendChild(divRow1);
  divCard.appendChild(divRow2);

  h3.appendChild(strong);
  divRow1.appendChild(h3);
  divRow2.appendChild(typeLabel1);
  divRow2.appendChild(typeLabel2);

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
      method: 'GET',
      headers: {
      'Content-Type': 'application/json'
      }
  });

  const myJson = await response.json();
  for (var index in myJson) {
    document.getElementById("radios").appendChild(createRadioElement(myJson[index]))
  }
}
