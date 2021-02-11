const express = require('express');
const {connection} = require('../mysql.config');

const router = express.Router();

router.get('/', (req, res) => {
    connection.query("SELECT * FROM users", (err, result) => {
        if(err) {
            // res.redirect('/_admin/error/ERROR')
            res.send('<h1>Error, Retry</h1>')
        } else {
            res.render('index', {
                title: 'Admin || Home',
                users: result
            })
        }
    })
});

router.get('/about', (req, res) => {
    res.render('about', {
        title: "About"
    })
});

router.get('/top-up', (req, res) => {
    res.render('top-up', {
        title: "Top up"
    })
});


router.post('/upDateAccount', (req, res) => {
    const {id, earning} = req.body;
    let query = `UPDATE balances SET btc_investment_balance=${parseInt(earning)} WHERE user_id = ${parseInt(id)}`;

    connection.query(query, (err, result) => {
        if(err) {
            // res.redirect('/_admin/error/ERROR')
            res.send('<h1>Error, Retry</h1>')
        } else {
            res.send('<h1>Successful, Go Back</h1>')
        }
    })

    // res.redirect('/dashboard')

})

exports.router = router;