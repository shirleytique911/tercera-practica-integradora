import mongoose from "mongoose";
import config from '../config/config.js'


export class Carts{}
export class Products{}
export class Users {}
export class Tickets{}
switch (config.persistence) {
    case "MONGO":
        const connection = mongoose.connect(config.mongo_url)
        mongoose.connect(process.env.MONGOURL)
        const { default: CartsMongo } = await import('./mongo/carts.mongo.js')
        const { default: ProductsMongo } = await import('./mongo/products.mongo.js')
        const { default: UsersMongo } = await import('./mongo/users.mongo.js')
        const { default: TicketsMongo } = await import('./mongo/tickets.mongo.js')
        Carts = CartsMongo
        Products = ProductsMongo
        Users = UsersMongo
        Tickets = TicketsMongo
        break;
    case "MEMORY":
        const { default: CartsMemory } = await import("./memory/carts.memory.js")
        const { default: ProductsMemory } = await import("./memory/products.memory.js")
        const { default: UsersMemory } = await import("./memory/users.memory.js")
        const { default: TicketsMemory } = await import("./memory/tickets.memory.js")
        Carts = CartsMemory
        Products = ProductsMemory
        Users = UsersMemory
        Tickets = TicketsMemory
        break
    default:

}