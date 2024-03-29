"use strict";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { dbConnection } from "./mongo.js";
import userRoutes from "../src/user/user.routes.js";
import authRoutes from "../src/auth/auth.routes.js";
import productRoutes from "../src/productos/producto.routes.js";
import categoriasRoutes from "../src/categorias/categorias.routes.js";
import facturasRoutes from "../src/factura/factura.routes.js";
import carritoRoutes from "../src/carritoCompras/carrito.routes.js";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuarioPath = "/empresa/v1/users";
    this.authPath = "/empresa/v1/auth";
    this.productoPath = "/empresa/v1/products";
    this.categoriasPath = "/empresa/v1/categorias";
    this.facturasPath = "/empresa/v1/facturas";
    this.carritoPath = "/empresa/v1/carrito";

    this.middlewares();
    this.conectarDB();
    this.routes();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(morgan("dev"));
  }

  routes() {
    this.app.use(this.usuarioPath, userRoutes);
    this.app.use(this.authPath, authRoutes);
    this.app.use(this.productoPath, productRoutes);
    this.app.use(this.categoriasPath, categoriasRoutes);
    this.app.use(this.facturasPath, facturasRoutes);
    this.app.use(this.carritoPath, carritoRoutes);

  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server running on port ", this.port);
    });
  }
}

export default Server;
