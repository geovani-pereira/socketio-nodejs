import { io } from './http';


interface RoomUser {
    socket_id: string;
    email: string;
    username: string;
    room: string;
}


interface Message {
    room: string;
    text: string;
    createdAt: Date;
    email: string;
    username: string;
}

let users: RoomUser[] = [];
const messages: Message[] = [];
const rooms: string[] = ['Jornada Unialfa'];

//quando um cliente se conecta na aplicação é gerado um socket para ele.
io.on("connection", (socket) => {

    //mostra a quantidade de sockets conectados
    socket.onAny((eventName,...args)=>{
        console.log(eventName);
    
        if(eventName == 'room'){
            console.log(io.of("/").sockets.size)
        }        
    })
    
    //quando receber algo desse socket
    socket.on('room', (data, callback) => {

        //se a sala ainda não existe cria uma sala
        if (!rooms.includes(data.room)) {
            rooms.push(data.room)
        }

        //vincula o usuario a uma determinada sala
        socket.join(data.room);

        const userInRoom = users.find(user => user.email == data.email && user.room === data.room)
        
        //verifica se ele ja estava na sala baseada no email e atualiza o socket_id
        if (userInRoom) {
            userInRoom.socket_id = socket.id

        } else {
            //se ele não estiver na sala adiciona ele no array de usuarios 
            users.push({
                room: data.room,
                email: data.email,
                socket_id: socket.id,
                username: data.username
            })
        }
        //recebe todas as mensagens da sala e envia no callback da conexao
        const messagesRoom = getMessagesRoom(data.room);
        callback(messagesRoom);
    });

    //quando receber uma mensagem ele adiciona a mensagem no array de mensagens e envia a mensagem
    //para todos os sockets conectados naquela sala
    socket.on('message', (data) => {
        const message: Message = {
            email: data.email,
            username: data.username,
            room: data.room,
            text: data.message,
            createdAt: new Date()
        }

        messages.push(message)

        io.to(data.room).emit("message", message)
    })

    //ao acessar a página principal envia no call back as salas ja criadas
    socket.on('new_user', (data, callback) => {
        console.log(`Novo usuario se conectou: ${data}`)
        callback(rooms);
    });

    //avisando que usuário desconectou
    socket.on("disconnect", () => {
        //verifica se o usuário estava em alguma sala e avisa que ele saiu
        const user = users.find(user => user.socket_id == socket.id);
        if (user) {

            io.to(user!.room).emit("desconectou", `Usuário ${user!.username} saiu da sala.`)
            
            socket.leave(user!.room)

            users = users.filter(user => user.socket_id != socket.id);

        }
    });


});


function getMessagesRoom(room: string) {
    const messagesRoom = messages.filter(message => message.room == room);
    return messagesRoom;
}