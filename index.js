const express = require('express');
require('dotenv').config();
const flash = require('express-flash');

const app = express();
const port = process.env.PORT;

const routerAdmin = require('./routers/admin/index.router.js');
const routerClient = require('./routers/client/index.router.js');
const systemConfig = require('./config/system.js');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
const database = require('./config/database.js');
const path = require('path');
const moment = require('moment');

database.connect();

//App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;


app.set('views', `${__dirname}/views`);

app.set('view engine', 'pug');

app.use(express.static(`${__dirname}/public`));

app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieParser('my-unique-key'));

app.use(session({ cookie: { maxAge: 60000 } }));

//tiny mce for text editor
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// end tiny mce for text editor

//flash
app.use(flash());

// Routers
routerClient(app);
routerAdmin(app);


// app.get('/', (req, res) => {
//     res.render("client/pages/home/index");
// });

// app.get('/products', (req, res) => {
//     res.render("client/pages/products/index");
// });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
