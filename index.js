const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const server = http.createServer(app);
const port = 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.disable('x-powered-by');

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Вы сломали сервер!');
});

app.use((err, req, res, next) => {
  if (error instanceof ForbiddenError) {
    return res.status(403).send({
      status: 'forbidden',
      message: error.message,
    });
  }
});

app.set('view engine', 'pug');

app.use(express.static('views'));

app.use('/dashboard', function (request, response) {
  response.render('dashboard', {
    title: 'Мои контакты',
    emailsVisible: true,
    emails: ['gavgav@mycorp.com', 'mioaw@mycorp.com'],
    phone: '+1234567890',
  });
});

let jsonfile = require('jsonfile');

let file = jsonfile.readFileSync('data.json');

app.put('/edit/:id', function (req, res) {
  let id = req.params.id;
  let newText = req.body.text;

  jsonfile.readFile('data.json', function (err, obj) {
    let fileObj = obj;
    fileObj[id].text = newText;
    jsonfile.writeFile('data.json', fileObj, function (err) {
      if (err) throw err;
    });
    res.send(obj);
  });
});

app.post('/addTask', (req, res) => {
  if (!req.body) return res.sendStatus(400);
  const user = {
    id: file.length,
    text: req.body.text,
  };
  jsonfile.readFile('data.json', (err, obj) => {
    if (err) throw err;
    let fileObj = obj;
    fileObj.push(user);
    jsonfile.writeFile('data.json', fileObj, (err) => {
      if (err) throw err;
    });
    res.send(obj);
  });
});

app.delete('/delete/:id', (req, res) => {
  jsonfile.readFile('data.json', (err, obj) => {
    if (err) throw err;
    let fileObj = obj;
    for (let i = 0; i < fileObj.length; i++) {
      if (fileObj[i].id == req.params.id) {
        fileObj.splice(i, 1);
      }
    }
    jsonfile.writeFile('data.json', fileObj, { spaces: 2 }, (err) => {
      if (err) throw err;
    });
    res.send(obj);
  });
});

//Go the SERVERs
server.listen(port, () => {
  console.log('\x1b[35m%s\x1b[0m', `The server is running on the port ${port}`);
  console.log('\x1b[32m%s\x1b[0m', `http://localhost:${port}/`);
  // console.log(`Worker ${cluster.worker.id} launched`);
});
