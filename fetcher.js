/*
It should take two command line arguments:

a URL
a local file path
It should download the resource at the URL to the local path on your machine. Upon completion, it should print out a message like Downloaded and saved 1235 bytes to ./index.html.

> node fetcher.js http://www.example.edu/ ./index.html
Downloaded and saved 3261 bytes to ./index.html
*/
const fs = require('fs')
const net = require('net');
const readline = require('readline');

const args = process.argv.slice(2);
let host;
let path;
const port = "80";

const startDownload = () => {
  const conn = net.createConnection({ 
    host,
    port
  });
  conn.setEncoding('UTF8');
  
  conn.on('connect', (error) => {
    console.log(`Connected to server!`);
    conn.write(`GET / HTTP/1.1\r\n`);
    conn.write(`Host: example.edu\r\n`);
    conn.write(`\r\n`);
  });
  
  conn.on('data', (data) => {
    fs.writeFile(path, data, err => {
      let dataLen = data.length;
      if (err) {
        console.log("--==[ERROR]==--No such file or directory, check path and restart app");
        process.exit();
      }
      console.log("--==[SUCCESS]==--");
      console.log(`Downloaded and saved ${dataLen} bytes to ${path}`);
    })
    conn.end();
  });
};

const verifyInput = (args) => {
  if(args.length === 2) {
    if(args[0].substr(0, 4) !== 'http') {
      console.log("Usage: node fetcher.js <URL> <file/path>");
      process.exit();
    } else {
      host = args[0].substr(7,args[0].length);
      try {
        if (fs.existsSync(args[1])) {
          console.log("--==[File Exists]==--");
          const rl = readline.createInterface(process.stdin, process.stdout);
          rl.question('Would you like to specify a new path? [y/n]: ', (input) => {
            if(input === 'y') {
              rl.question('Please enter a new path (ex. ./filename.html): ', (input) => {
                path = input;
                startDownload();
                rl.close();
              });
            } else {
              path = args[1];
              startDownload();
              rl.close();
            }
          });
        } else {
          path = args[1];
          startDownload();
        }
      } catch(err) {
        console.error(err)
      }
    }
  } else {
    console.log("Usage: node fetcher.js <URL> <file/path>");
    process.exit();
  }
};
verifyInput(args);
