import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/api/users/currentuser',  (req, res) => {
    // if(!req.session || !req.session.jwt) {  Same as below, ? typescript symbol to check internal property is available or not.
    if(!req.session?.jwt) {
        console.log('Seesion not found')
        return res.send({ currentUser : null });
    }

    try {
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
        return res.send({ currentUser : payload });
    } catch (err) {
        console.log('Error payload')
        return res.send({ currentUser : null });
    }
});

export { router as currentUserRouter };
