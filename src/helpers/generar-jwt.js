import jwt from 'jsonwebtoken';

const generarJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign(
            payload,
            process.env.SECRETORPRIVATEKEY,
            {
                expiresIn: '1h',
            },
            (err, token) => {
                if (err) {
                    console.log(err);
                    reject('No se pudo generar token');
                } else {
                    resolve(token);
                }
            }
        );
    });
};

export { generarJWT };
