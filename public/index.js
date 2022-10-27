// const socket = io('wss://chat.geovanipereira.com.br');
const socket = io('ws://localhost:3000');

socket.on("connect", () => {
    const id = socket.id;
    socket.emit('new_user', id, messages => {
        
        const selectRooms = document.getElementById('select-rooms')

        messages.forEach(message => {
            let option = document.createElement("option");
            option.setAttribute('value', message);

            let optionText = document.createTextNode(message);
            option.appendChild(optionText);

            selectRooms.appendChild(option);
        });
    })
});