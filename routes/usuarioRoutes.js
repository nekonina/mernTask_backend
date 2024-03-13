import express from 'express';
import { 
    autenticar, 
    cambiarPassword, 
    comprobarToken, 
    confirmar, 
    nuevoPassword, 
    registrar,
    getPerfil
} from '../controllers/usuarioController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.post('/', registrar)
router.post('/login', autenticar)
router.get('/confirmar/:token', confirmar)
router.post('/change-password', cambiarPassword)

// router.get('/change-password/:token', comprobarToken)
// router.post('/change-password/:token', nuevoPassword)

router.route('/change-password/:token').get(comprobarToken).post(nuevoPassword);

router.get('/perfil', checkAuth, getPerfil)

export default router;