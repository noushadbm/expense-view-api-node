const bcrypt = require('bcryptjs');
const jwt = require('njwt');

const encrypt = (password) => {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

const isCorrectPassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
}

const generateJwt = (claims, expiry) => {
    const token = jwt.create(claims, 'top-secret-phrase');
    token.setExpiration(expiry); // one hour from now.
    return token.compact();
}

const getTokenExpiry = () => {
    return new Date().getTime() + (24*60*60*1000); // 24 hours from now.
}

const verifyJwt = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, 'top-secret-phrase', (err, verifiedJwt) => {
            if(err){
                console.log('Error: ', err);
                reject('Failed.');
            }else{
                resolve(verifiedJwt); 
            }
          })
    });
}

module.exports = {
    encrypt,
    isCorrectPassword,
    generateJwt,
    verifyJwt,
    getTokenExpiry,
}