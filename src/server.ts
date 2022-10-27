import 'dotenv/config';

import { httpServer } from './http'

import './websocket'
//app.listen(process.env.PORT,()=>console.log(`Servidor rodando na porta ${process.env.PORT}`))
httpServer.listen(process.env.PORT, () => console.log(`Servidor rodando na porta ${process.env.PORT}`))
