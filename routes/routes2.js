const express = require('express');
const {connection} = require('../mysql.config');
const jwt = require('jsonwebtoken')

const router = express.Router();

const signData = (options) => {
    try {
        const token = jwt.sign({payload: options}, '00154abs');
        if(token) {
            return token
        }
    } catch(e) {
        console.error(e)
    }
}

router.post('/signup', (req, res) => {
    const {name, email, phoneNumber, password, country, countryCode} = req.body.args;

    const data = {
        name,
        email,
        password,
        country,
        countryCode,
        phoneNumber,
        token: `Bearer ${signData({
            name,
            email,
            phoneNumber,
            password
        })}`
    };

    console.log(data)

    let userId = '';
    let addressesId = '';
    let walletId = '';

    const UsersQuery = `INSERT INTO users (name, email, password, country, countryCode, phoneNumber, token, register_date) VALUES ?;`
    
    const UsersValues = [
        [`${data.name}`, 
        `${data.email}`, 
        `${data.password}`, 
        `${data.country}`, 
        `${data.countryCode}`, 
        `${data.phoneNumber}`,
        `"${data.token}"`, 
        new Date()]
    ];

    const _query_ = `SELECT * FROM users WHERE email = "${email}" AND password = "${password}"`;
        connection.query(_query_, function(error, result) {
            if(error) {
                console.log('Error 4')
                res.json({type: 'Error', message: "Internal Server Error"})
                return;
            } else if(result.length !== 0) {
                res.json({type: "Error", message: `Email of ${email} and Password of ${password} already exist`})
                return;
            } else {
                connection.query(UsersQuery, [UsersValues], function (error, result, fields) {
                    if (error) {
                        console.log('Error 3')
                        res.json({type: 'Error', message: "Internal Server Error"})
                        return;
                        // console.error('Error from users INSERT')
                    } else {
                        userId = result.insertId;
                        console.log('Success on user INSERT')
                        const walletQuery = `INSERT INTO wallets (wallet_name, user_id, bearerToken) VALUES ?`;
        
                        const values = [
                            [`${`@${data.name}of${data.email}-Wallet`}`, `${userId}`, `${data.token}`]
                        ]
                        connection.query(walletQuery, [values], (error, result) => {
                            if(error) {
                                res.json({type: 'Error', message: "Internal Server Error"})
                                return;
                                // console.error('Error from wallets INSERT')
                                // throw new Error('Internal server error');
                            } else {
                                console.log("Wallet created Successfully")
                                walletId = result.insertId;

                                const addressesQuery = `INSERT INTO addresses (user_id, wallet_id, name, addresss, public, private, wif) VALUES ?`;
                            const addressValues = [
                                [`${userId}`, 
                                `${walletId}`, 
                                `Btc`, 
                                `${new Date().getTime()}`, 
                                `${new Date().getTime()}`, 
                                `${new Date().getTime()}`, 
                                `${new Date().getTime()}`],
                                [`${userId}`, 
                                `${walletId}`, 
                                `Eth`, 
                                `${new Date().getTime()}`, 
                                `${new Date().getTime()}`, 
                                `${new Date().getTime()}`, 
                                `${new Date().getTime()}`]
                            ]
                                connection.query(addressesQuery, [addressValues], (err, result) => {
                                    if(err) {
                                        console.log(err)
                                        res.json({type: 'Error', message: "Internal Server Error"});
                                        return;
                                    } else {
                                        const query = `INSERT INTO balances (user_id, eth_wallet_balance, btc_wallet_balance, btc_investment_balance, eth_investment_balance) VALUES (${userId}, 0, 0, 0, 0)`;
                                        connection.query(query, (err, result) => {
                                            if(err) {
                                                console.log('Error 1')
                                                res.json({type: 'Error', message: "Internal Server Error"})
                                            } else {
                                                console.log("Everything went succesful")
                                              res.json({type: "Success", message: "Account Created Successfully"})
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                });
            }
            
        });

})

router.get('/signin/:email/:password', (req, res) => {
    console.log("siginin in ")
    const {email, password} = req.params;
    console.log(req.params)

    // const query = `SELECT * FROM `users` WHERE email = "${email}" AND password = "${password}";`;
    const query = `
    SELECT users.id, users.name, users.email, users.token, wallets.wallet_name FROM users INNER JOIN wallets on wallets.user_id = users.id WHERE email = "${email}" AND password = "${password}" 
    `;

    connection.query(query, (err, result) => {
        if(err) {
            res.json({type: "Error", message: "Internal Server Error"});
        } else if(result.length == 0) {
            res.json({type: "Invalid", message: "Email and Password Does Not exist"})
        } else {
            res.json({type: "Success", message: result})
        }
    })
})

router.get('/earning/:id', (req, res) => {
    const {id} = req.params;
    console.log(id)
    const query = `SELECT btc_investment_balance FROM balances WHERE user_id = ${id}`
    // res.json({data: })

    connection.query(query, (err, result) => {
        if(err) {
            res.json({type: "Error", message: "Internal Server Error"});
        } else {
            console.log({data: result[0].btc_investment_balance})
            res.json({data: result[0].btc_investment_balance})
        }
    })
})



exports.router2 = router;