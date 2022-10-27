// const socket = io('wss://chat.geovanipereira.com.br');

const socket = io('ws://localhost:3000');


//pega os parametros vindo por GET
const urlSeach = new URLSearchParams(window.location.search);
const email = urlSeach.get('email');
const username = urlSeach.get('username');

//se vier não vier sala pega a sala selecionada
const room = urlSeach.get('room') || urlSeach.get('select-rooms');

//adiciona mensagem de boas vindas no html pelo id email
document.getElementById('welcome').innerHTML = `<p class="boas-vindas">Olá <b>${username},</b> você está na sala: <b>${room}</b>.</p>`


//enviando as informações para o websocket passando o evento (room)
socket.emit('room', {
  email,
  username,
  room
}, messages => {
  //recebendo o callback contendo as messages enviado pelo servidor
  messages.forEach(message => {
    createMessage(message)
  })

  window.scrollTo(0, document.body.scrollHeight);
});

document.getElementById('message_input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const message = event.target.value;

      const data = {
        room,
        message,
        username,
        email
      };
      //enviando mensagem para o evento 'message'
      socket.emit('message', data);

      event.target.value = '';

      window.scroll(0, document.body.scrollHeight)
    }
  })

document
  .getElementById('button_message')
  .addEventListener('click', () => {

    const input = document.getElementById('message_input');
    const message = input.value;
    input.value = '';

    const data = {
      room,
      username,
      message,
      email
    };

    socket.emit('message', data);

    window.scroll(0, document.body.scrollHeight)

  })

//ao receber uma mensagem chama a funcao createMessage que irá inserir o html na tela
socket.on('message', data => {
  createMessage(data);
})

//quando um usuario se desconectar, será inserida uma mensagem dizendo que ele se desconectou
socket.on('desconectou', data => {
  createMessageDisconnect(data);
})

//cria mensagem dentro do chat
const createMessage = (data) => {

  const dataMensagem = new Date(data.createdAt);

  const messageDiv = document.getElementById('messages');
  messageDiv.innerHTML += `
  <hr class="hr-separador">
  <div class="data_hora">
  ${dataMensagem.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
  </div>
    <div class="new_message">
      <label class="form-label">
        <strong>${data.username}</strong>:
        <p>
          ${data.text}
        </p>     
      </label>
    </div>
    `
  window.scroll(0, document.body.scrollHeight)
}

const createMessageDisconnect = (data) => {
  
  const dataMensagem = new Date();

  const messageDiv = document.getElementById('messages');
  messageDiv.innerHTML += `
    <hr class="hr-separador">
     <div class="data_hora">
     ${dataMensagem.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
     </div>
    <p>${data}</p>`
}

document.getElementById('logout').addEventListener('click', () => {
    window.history.go(-1)
  });

