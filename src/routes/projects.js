const express = require('express');
const { APP } = require('../config');
const { getAll, getOne, create, update, remove } = require('../controllers/projectController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

if (APP.NODE_ENV !== 'test') router.use(auth);

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', upload.single('image'), create);
router.put('/:id', upload.single('image'), update);
router.delete('/:id', remove);

module.exports = router;
