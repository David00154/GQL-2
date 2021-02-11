const PORT = process.env.PORT || 3000;
const express = require('express');
const cors = require('cors');
const hbs = require('express-hbs');
const path = require('path');
const bodyparser = require('body-parser');
const {router} = require('./routes/routes');
const {router2} = require('./routes/routes2');

const app = express();
app.use(cors())

app.engine('hbs', hbs.express4({
    extname: 'hbs',
    defaultLayout: path.join(__dirname, 'public/views/layouts/layout.hbs'),
    partialsDir: path.join(__dirname, 'public/views/partials/'),
    layoutsDir: path.join(__dirname, 'public/views/layouts')
  }));
  app.set('view engine', 'hbs');
  app.set('views', __dirname + '/public/views');

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/_admin', router)

app.use('/api', router2)

app.listen(PORT, () => {
    console.log(`Server started on pot ${PORT}`)
})