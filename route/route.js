const router = require('express').Router();

const { Route } = require('express');
const curdController = require('../controller/curdController');

router.get('/index', curdController.list);
router.get('/', curdController.home);
router.get('/add', curdController.add);
router.post('/save', curdController.save);
router.get('/edit/:id', curdController.edit);
router.post('/update/:id', curdController.update);
router.get('/delete/:id', curdController.delete);
router.get('/delete-user-image/:id', curdController.deleteUserImage);

module.exports = router;