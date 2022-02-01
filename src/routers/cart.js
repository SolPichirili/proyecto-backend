const express = require('express');
const daosCart = require('../daos/cartIndex');
const logger = require('../utils/winston');

const cartRouter = express.Router();

const CartDaos = daosCart;

cartRouter.post('/', async (req, res) => {
    logger.info(`PATH: ${req.path}, METHOD: ${req.method}, MESSAGE: Proceso exitoso`);
    const cart = req.body;
    const cartId = await CartDaos.getNewId(cart);
    res.send({ data: cartId });
});

cartRouter.delete('/:id', async (req, res) => {
    logger.info(`PATH: ${req.path}, METHOD: ${req.method}, MESSAGE: Proceso exitoso`);
    const id = req.params.id;
    const cartDeletedId = await CartDaos.deleteById(id);
    res.send({ data: cartDeletedId });
});

cartRouter.get('/:id/productos', async (req, res) => {
    logger.info(`PATH: ${req.path}, METHOD: ${req.method}, MESSAGE: Proceso exitoso`);
    const id = req.params.id;
    const cart = await CartDaos.getById(id);
    if(!cart){
        res.send({data: `El carrito con ID ${id} no existe`})
    }
    const { productos } = cart;
    res.send({ data: productos });
});

cartRouter.post('/:id/productos', async (req, res) => {
    logger.info(`PATH: ${req.path}, METHOD: ${req.method}, MESSAGE: Proceso exitoso`);
    const id = req.params.id;
    const products = req.body;
    const cart = await CartDaos.addProductById(id, products);
    res.send({ data: cart });
});

cartRouter.delete('/:id/productos/:id_prod', async (req, res) => {
    logger.info(`PATH: ${req.path}, METHOD: ${req.method}, MESSAGE: Proceso exitoso`);
    const cartId = req.params.id;
    const productId = req.params.id_prod;
    const cart = await CartDaos.deleteProductById(cartId, productId);
    res.send({ data: cart });
});


module.exports = cartRouter;