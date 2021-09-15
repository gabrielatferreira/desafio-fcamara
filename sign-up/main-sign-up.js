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
});

/* criação de usuários */
const userAction = async () => {
  if (!validarSenha()) return;
  if (!checkboxValidation()) return;

  console.log("foi clicado")
  const response = await fetch('http://orangepoint.herokuapp.com/usuarios', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify ({
          nome: document.getElementById('name').value,
          email: document.getElementById('email').value,
          senha: document.getElementById('password').value
      })
  });
  const myJson = await response.json();
  console.log(myJson);
  if(myJson.id !== null && myJson.id !== undefined && myJson.id !== "") {
    localStorage.setItem("nome", myJson.nome);
    localStorage.setItem("email", myJson.email);
  } else {
    alert(myJson);
    return;
  }

  limparCampos();
  sucesso();
  acessoLogin();
}

const limparCampos = () => {
  document.getElementById('name').value = "";
  document.getElementById('email').value = "";
  document.getElementById('password').value = "";
  document.getElementById('passwordagain').value = "";
  document.getElementById('box-terms').value = "";
}

const sucesso = () => {
  alert("Usuário(a) cadastrado com sucesso!");
}

const validarSenha = (password, passwordagain) => {
  var password = document.getElementById('password').value;
  var passwordagain = document.getElementById('passwordagain').value;

  if (password != "" && passwordagain != "" && password === passwordagain) {
    return true;
  } else {
    alert("As senhas estão diferentes!")
  }
  return false;
}

const checkboxValidation = () => {
  var checkbox = document.getElementById('box-terms').checked;
  if (checkbox == "") {
      alert("Aceite os termos de uso para se cadastrar.")
  } else {
      return true;
  }
  return false;
}

const acessoLogin = () => {
  document.location.href = "../login/index-login.html";
}