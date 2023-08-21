const bcrypt = require('bcryptjs');
const jwt = require('njwt');

const encrypt = (password) => {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

const isCorrectPassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
}

const generateJwt = (claims) => {
    const token = jwt.create(claims, 'top-secret-phrase');
    token.setExpiration(new Date().getTime() + 60*1000);
    return token.compact();
}

const verifyJwt = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, 'top-secret-phrase', (err, verifiedJwt) => {
            if(err){
                resolve(verifiedJwt);
            }else{
                reject('Failed.');
            }
          })
    });
}

module.exports = {
    encrypt,
    isCorrectPassword,
    generateJwt,
    verifyJwt,
}