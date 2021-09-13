/* integração entre o front e o back */

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
    limparCampos();
    sucesso();
}

const limparCampos = () => {
    document.getElementById('name').value = "";
    document.getElementById('email').value = "";
    document.getElementById('password').value = "";
    document.getElementById('passwordagain').value = "";
    document.getElementById('terms').value = "";
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
      alert("senhas diferentes")
    }
    return false;
  }

const checkboxValidation = () => {
    var checkbox = document.getElementById('terms').checked;
    if (checkbox == "") {
        alert("Aceite os termos de uso para se cadastrar.")
    } else {
        return true;
    }
    return false;
}

/* validação do login */

const userActionLogin = async () => {
    console.log("foi clicado")
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
    const myJson = await response.json();
    console.log(myJson);
    limparCampos();
}
