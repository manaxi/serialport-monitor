const {
  SerialPort
} = require('serialport')
const {
  ReadlineParser
} = require('@serialport/parser-readline')
const tableify = require('tableify')
const div = document.querySelector('#dropdown-port');

async function listSerialPorts() {
  await SerialPort.list().then((ports, err) => {
    ports.forEach((port) => {
      div.innerHTML += ` <option value="${port.path}">${port.friendlyName}</option>`;
    })
  })
}

function listPorts() {
  div.innerHTML = "";
  listSerialPorts();
  setTimeout(listPorts, 2000);
}

listSerialPorts()

function getPort() {
  return div.value;
}

async function connectPort() {
  document.querySelector('#connect').disabled = true;
  div.disabled = true;
  const port = new SerialPort({
    path: getPort(),
    baudRate: 9600
  })
  parserPort(port);
  disconnectPort(port);
}

async function parserPort(port) {
  const parser = port.pipe(new ReadlineParser({
    delimiter: '\r\n'
  }))
  parser.on('data', (data) => {
    tableHTML = tableify(data)
    document.getElementById('data').innerHTML = tableHTML
  })


}

function disconnectPort(port) {
  var buttonDisconnect = false;
  document.getElementById('disconnect').addEventListener('click', function () {
    buttonDisconnect = true;
    div.disabled = false;
    tableHTML = tableify('')
    document.getElementById('data').innerHTML = tableHTML
    document.querySelector('#connect').disabled = false;
    port.close(function (err) {
      console.log('port closed', err);
    });
  });
}