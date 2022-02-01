const express = require('express');
const daos = require('../daos/productsIndex');
const { isAdmin } = require('../middlewares/admin');
const logger = require('../utils/winston');

const productsRouter = express.Router();

const ProductDao = daos;

productsRouter.get('/', async (req, res) => {
    logger.info(`PATH: ${req.path}, METHOD: ${req.method}, MESSAGE: Proceso exitoso`);
    const productList = await ProductDao.getAll();
    res.send({ data: productList });
});

productsRouter.get('/:id', async (req, res) => {
    logger.info(`PATH: ${req.path}, METHOD: ${req.method}, MESSAGE: Proceso exitoso`);
    const id = req.params.id;
    const productById = await ProductDao.getById(id);
    res.send({ data: productById });
});

productsRouter.post('/', isAdmin, async (req, res) => {
    logger.info(`PATH: ${req.path}, METHOD: ${req.method}, MESSAGE: Proceso exitoso`);
    const newProduct = req.body;
    const newList = await ProductDao.save(newProduct);
    res.send({ data: newList });
});

productsRouter.put('/:id', isAdmin, async (req, res) => {
    logger.info(`PATH: ${req.path}, METHOD: ${req.method}, MESSAGE: Proceso exitoso`);
    const id = req.params.id;
    const newProduct = req.body;
    const updatedProduct = await ProductDao.update(id, newProduct);
    res.send({ data: updatedProduct });
});

productsRouter.delete('/:id', isAdmin, async (req, res) => {
    logger.info(`PATH: ${req.path}, METHOD: ${req.method}, MESSAGE: Proceso exitoso`);
    const id = req.params.id;
    const newList = await ProductDao.deleteById(id);
    res.send({ data: newList });
});


module.exports = productsRouter;