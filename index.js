const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('config');
const path = require('path');

if (!config.get('jwtKey')) {
    console.log('JIDDIY XATO: jwtKey muhit o`zgaruvchisi aniqlanmagan');
    process.exit(0);
}

const categoryRoute = require('./router/categories');
const customerRoute = require('./router/customers');
const courseRoute = require('./router/courses');
const enrollmentRoute = require('./router/enrollments');
const userRouter = require('./router/users');
const authRouter = require('./router/auth');

mongoose.connect('mongodb://localhost/Virtual',{useNewUrlParser: true})
    .then(() => {
        console.log('Mongodbga ulanish amalga oshdi');
    })
    .catch((err) => {
        console.error(err);
    });


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    res.render('index');
});
app.get('/login', async (req, res) => {
    res.render('login');
});

app.use('/api/categories', categoryRoute);
app.use('/api/customers', customerRoute);
app.use('/api/courses', courseRoute);
app.use('/api/enrollments', enrollmentRoute);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`${port} - portni eshitishni boshladim`);
});