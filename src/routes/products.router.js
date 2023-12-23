import { Router } from "express";
import ProductDTO from "../dao/DTOs/product.dto.js";
import { productService, userService } from "../repositories/index.js";
import Products from "../dao/mongo/products.mongo.js"
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enum.js";
import { generateProductErrorInfo } from "../services/errors/info.js";

const router = Router()

const productMongo = new Products()

router.get("/", async (req, res) => {
    req.logger.info('Se cargan productos');
    let result = await productMongo.get()
    res.send({ status: "success", payload: result })
})
//------------------Info Prueba CUstom Error--------------//
// http://localhost:8080/products
// {
//     "image": "imagen1.jpg",
//     "stock": 999,
//     "category": "Electrónicos",
//     "availability": "in_stock"
// }
//--------------------------------------------------------//

router.post("/", async (req, res) => {
    let { description, image, price, stock, category, availability, owner } = req.body
    if(owner === undefined || owner == '')
    {
        owner = 'admin@admin.cl'
    }
    const product = { description, image, price, stock, category, availability, owner}
    if (!description || !price) {
        try {
            // Some code that might throw an error
            throw CustomError.createError({
                name: 'Error en Creacion de Producto',
                cause: generateProductErrorInfo(product),
                message: 'Error al intentar crear el Producto',
                code: EErrors.REQUIRED_DATA,
            });
            req.logger.info('Se crea producto correctamente');
        } catch (error) {
            req.logger.error("Error al comparar contraseñas: " + error.message);
            console.error(error);
        }
    }
    let prod = new ProductDTO({ description, image, price, stock, category, availability, owner })
    let userPremium = await userService.getRolUser(owner)
    if(userPremium == 'premium'){
        let result = await productService.createProduct(prod)
    }else{
        req.logger.error("Error al ingresar owner de usuario invalido");
    }
    
})

export default router