import cartsModel from './models/carts.model.js'
import productsModel from './models/products.model.js'

export default class Carts {
    constructor() {

    }

    get = async () => {
        let carts = await cartsModel.find()
        return carts
    }
    getCart = async (id_cart) => {
        try {
           
            const cart = await cartsModel.findById(id_cart);
    
           
            if (!cart) {
                return { error: "No se encontró el carrito con el ID proporcionado" };
            }
    
            return { cart };
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            return { error: "Error interno al obtener el carrito" };
        }
    }
    getStock = async ({ productos }) => {
        try {
            const stockInfo = {};
            const errors = [];
    
            for (const producto of productos) {
            
                const productInCollection = await productsModel.findOne({ description: producto.description });
    
                if (!productInCollection) {
                    errors.push({ description: producto.description, error: `El producto no se encuentra en la colección` });
                    stockInfo[producto.description] = { status: 'No encontrado en la colección' };
                    continue;
                }
    
                if (productInCollection.stock >= producto.stock) {
                    await productsModel.updateOne(
                        { description: productInCollection.description },
                        { $inc: { stock: -producto.stock } }
                    );
    
                    stockInfo[producto.description] = {
                        status: 'Suficiente',
                        availableQuantity: productInCollection.stock - producto.stock,
                        requiredQuantity: producto.stock,
                    };
                } else {
                    errors.push({ description: producto.description, error: 'Insuficiente' });
                    stockInfo[producto.description] = { status: 'Insuficiente' };
                }
            }
    
            if (errors.length > 0) {
                return { errors, stockInfo };
            }
    
            return stockInfo;
        } catch (error) {
            console.error("Error al obtener el stock:", error);
            return { error: "Error interno al obtener el stock" };
        }
    };
    getAmount = async ({ productos }) => {
        try {
            let totalAmount = 0;
    y
            if (!productos || !Array.isArray(productos)) {
                console.error('La propiedad "productos" no es un array válido.');
                return totalAmount;
            }
    
            for (const producto of productos) {
         
                totalAmount += producto.price * producto.stock;
            }
    
            return totalAmount;
        } catch (error) {
            console.error("Error al calcular el monto:", error);
            return 0;
        }
    };
    
    addCart = async (cart) => {
        let result = await cartsModel.create(cart)
        return result
        console.log("Carro creado correctamente")
    }
}