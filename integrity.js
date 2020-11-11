const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const fetch = require('node-fetch');
const morgan = require('morgan');
const { exec, spawn } = require('child_process');
const fs = require('fs');
//const helmet = require('helmet');

// DB
const low = require('lowdb');
const shortid = require('shortid')
const FileSync = require('lowdb/adapters/FileSync')
const db = low(new FileSync('log.json'))
db.defaults({ logs: [] }).write();

// Express App
const app = express();
const port = process.env.PORT || 5013;
//app.use(helmet());
app.enable('trust proxy');

//SocketIO 
const http = require('http').Server(app);
const io = require('socket.io')(http);

// JSON Parser - parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Static Files
app.use(express.static(path.join(__dirname, "/public")));

// View Engine

app.use(express.json());
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, `/views`)); 

// CORS
app.use(cors());

// For debugging;
app.use(morgan('tiny'));


// Main App
app.get("/",(req,res)=> {
      res.render('./index.ejs',{url:req.headers.host});
});



// Web Socket 
io.on('connection', (socket) => {
    console.log("New Player: " + socket.id);
    socket.on('disconnect', (reason) => {
      console.log("disconnect reason:",reason);    
      console.log('& socket.id:',socket.id);
    });
    socket.on('newUrl',(urlInfo) => {
        console.log(urlInfo)
        RunInegrityCalculation(urlInfo,socket);
    })
});


let RunInegrityCalculation = async (urlInfo,socket) => {

    let html =  await fetch(urlInfo.url)
    .then(res => res.text())
    .then(html => html);

    GetScripts(html).map( async s=> {

        console.log("script",script);

        let scriptContent = await fetch(script)
        .then(res => res.text())
        .then(html => html);

        let filename = "./temp/" + shortid.generate();


        await fs.writeFile(filename, scriptContent, (err,data) => {
            if (err) {return console.log(err);}
            console.log("Wrote file: ",filename);
            exec(`shasum -b -a 384 ${filename} | awk '{ print $1 }' | xxd -r -p | base64`, (error, integritySHA, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    showError(socket)
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    showError(socket)
                    return;
                }
                console.log(`integrity for ${script}  is: ${integritySHA}`);
                // communicate
                let newCalculation = {url: script, integrity:integritySHA};
                socket.emit("newCalculation",newCalculation);
                fs.unlink(filename, (err) => {
                    if (err) {
                      console.error(err)
                      return
                    }
                });
            });
        })
    })
}

function showError(socket) {
    let newCalculation = {url: "ERROR!!!!!", integrity:""};
    socket.emit("newCalculation",newCalculation)
}

function GetScripts(htmlToSearch) {
    const scriptRex = /<script.*?src="(.*?)"[^>]+>/g;
    const scripts = [];
      let script;
      while ((script = scriptRex.exec(htmlToSearch))) {
          if (script[1].substr(0,4) == "http") {
           scripts.push(script[1]);
          }
      }
    return scripts;
  } 

// Starting App
http.listen(port, () => {
    console.log(`App is listening on: http://localhost:${port}`);
  });