const net = require('net')
const modbus = require('jsmodbus')
const netServer = new net.Server()
const holding = Buffer.alloc(100)
const knex = require('./db');
const server = new modbus.server.TCP(netServer, {
  holding: holding
})

let tensao 
let temperatura 


 server.on('connection', async function (client) {
  
  //console.log('New Connection') 
 

    const  retorno  = await knex('cars'); 
    const ultimoItem = retorno.pop()  
     
    tensao = ultimoItem.tensao
    temperatura = ultimoItem.temperatura 
      
    //console.log(ultimoItem.sinal)
    

    if(ultimoItem.sinal === 'false'){
      server.coils.writeUInt16BE(0x0000, 0) 
    } 
    if(ultimoItem.sinal === 'true'){
      server.coils.writeUInt16BE(0x0100, 0)  
    }
    
    server.holding.writeUInt16BE(temperatura, 0)
    server.holding.writeUInt16BE(tensao, 2)
 
})

server.on('readCoils', function (request, response, send) {
  
  send(response)
})

server.on('readHoldingRegisters', function (request, response, send) {

  
})

server.on('preWriteSingleRegister', function (value, address) {
  console.log('Write Single Register')
  console.log('Original {register, value}: {', address, ',', server.holding.readUInt16BE(address), '}')
})

server.on('WriteSingleRegister', function (value, address) {
  console.log('New {register, value}: {', address, ',', server.holding.readUInt16BE(address), '}')
})

server.on('writeMultipleCoils', function (value) {
  console.log('Write multiple coils - Existing: ', value)
})

server.on('postWriteMultipleCoils', function (value) {
  console.log('Write multiple coils - Complete: ', value)
})

 server.on('writeMultipleRegisters', function (value) {
  console.log('Write multiple registers - Existing: ', value)
}) 

server.on('postWriteMultipleRegisters', function (value) {
  console.log('Write multiple registers - Complete: ', holding.readUInt16BE(0))
})

server.on('connection', function (client) {

 
})


//server.coils.writeUInt16BE(sinal, 0) 



netServer.listen(process.env.PORT || 3000)