const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const generateSalt = () => {
    return bcrypt.genSaltSync();
};
const hashPassword = (password) => {
    return bcrypt.hashSync(password, generateSalt());
};

const hashCompare = (password, hash) => {
    return bcrypt.compareSync(password, hash);
};

const JWTCreate = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET);
};

const JWTValidate = (token) => {
    try {
        return Promise.resolve(jwt.verify(token, process.env.JWT_SECRET));
    } catch (error) {
        return Promise.reject({
            msg: error.message,
            value: token,
            errCause: 'token'
        });
    }
};

async function authenticateToken(req) {
    const token = req.cookies.token;

    if (!token) {
        return false;
    }
    else {
        try {
            const tokenData = await JWTValidate(token);
            req.userData = tokenData;
            return true;
        } catch (err) {
            return false;
        }
    }
}

async function isLoggedIn(req, res, next) {
    const isAuthenticated = await authenticateToken(req);
    if (!isAuthenticated) {
        return res.redirect('/login');
    }
    next();
}


async function isNotLoggedIn(req, res, next) {
    const isAuthenticated = await authenticateToken(req);
    if (isAuthenticated) {
        return res.redirect('/employees');
    }
    next();
}





module.exports = {
    hashPassword,
    hashCompare,
    JWTCreate,
    isLoggedIn,
    isNotLoggedIn
}