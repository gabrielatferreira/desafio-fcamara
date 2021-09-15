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

/* validação do login */

const userActionLogin = async () => {
  console.log("clicou");
  const response = await fetch('http://orangepoint.herokuapp.com/login', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify ({
          email: document.getElementById('email').value,
          senha: document.getElementById('password').value
      })
  });
  console.log(response);
  const myJson = await response.json();
  console.log(myJson);
  if(myJson.token) {
    localStorage.setItem("id", myJson.id);
    localStorage.setItem("nome", myJson.nome);
    localStorage.setItem("email", myJson.email);
    acessoLogin();
  } else {
    alert(myJson);
  }
}

const acessoLogin = () => {
  document.location.href = "../welcome/welcome.html";
}

