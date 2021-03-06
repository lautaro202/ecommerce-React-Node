const server = require("express").Router();
const { Product } = require("../db.js");
const { Categories } = require("../db.js");
const { Op } = require("sequelize");
const { Review } = require("../db.js");
const { isAdmin, isAuthenticated } = require("../auth");

//--------------------------------------------------------------------------//
// GET Muestra todos los productos

server.get("/", (req, res, next) => {
  Product.findAll({ includes: [{ model: Categories }] })
    .then((products) => {
      res.send(products);
    })
    .catch(next);
});

//-----------a--------------------------------------------------------------//

// POST /products
// Controla que estén todos los campos requeridos,
// si no retorna un status 400.
// Si pudo crear el producto retorna el status 201 y
// retorna la información del producto.

server.post("/", isAdmin, async (req, res) => {
  const { category, name, description, stock, price, img } = req.body;

  Product.create({
    name: name,
    category: category,
    description: description,
    stock: stock,
    price: price,
    img: img,
  })
    .then((newProduct) => {
      // Categories.findById(category).then((category) => {
      //   newProduct.addCategory(category);
      // });
      return res.status(200).send(newProduct);
    })
    .catch((err) => res.status(400).send(err));
});

//--------------------------------------------------------------------------//

// PUT /products/:id
// Modifica el producto con id: id.
// Retorna 400 si los campos enviados no son correctos.
// Retorna 200 si se modificó con exito,
// y retorna los datos del producto modificado.

server.put("/:id", isAuthenticated, (req, res, next) => {
  const id = req.params.id;

  Product.update(
    {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      stock: req.body.stock,
      price: req.body.price,
      img: req.body.img,
      rating: req.body.rating,
    },
    {
      where: {
        id: id,
      },
      returning: true,
    }
  )
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) =>
      res.status(400).send(err, " WARNING! -> You can´t modificate the product")
    );
});

//---------------------------------------------------------------------------//

// DELETE /products/:id
// Retorna 200 si se elimino con exito.

server.delete("/:id", isAdmin, (req, res, next) => {
  const id = req.params.id;
  Product.destroy({
    where: { id: id },
  }).then((removed) => {
    if (removed) {
      res.status(200).end();
    } else {
      res.status(404).json({ message: "Not found" });
    }
  });
});

//-----------------------------------------------------------------------------------------//

// PUT /product/category/:id
// Crea ruta para modificar categoria

server.put("/category/:id", isAdmin, (req, res) => {
  const id = req.params.id;

  Categories.update(
    {
      //update({includes: [{model: Categories }]})
      name: req.body.name,
    },
    {
      where: {
        idProduct: id,
      },
      returning: true,
    }
  )
    .then((response) => {
      res.json(response);
    })
    .catch((error) => res.send(error));
});

//-------------------------------------------------------------------------------------//

// DELETE /products/category/:id
// Elimina una categoria

server.delete("/category/:id", isAdmin, (req, res) => {
  const id = req.params.id;
  //console.log(req.body);
  Categories.destroy({
    //update({includes: [{model: Categories }]})
    where: {
      id: id,
    }
      .then((deleteCategory) => {
        res.json(deleteCategory);
      })
      .catch((err) => res.send(err)),
  });
});

//--------------------------------------------------------------------------//

// POST /products/:idProducto/category/:idCategoria
// Agrega la categoria al producto.

server.post("/:idProducto/category/:idCategoria", isAdmin, (req, res) => {
  const idProduct = req.params.idProduct;
  const idCategoria = req.params.idCategoria;

  Categories.update(
    //findOrCreate()
    {
      //{include: [{model:Product}]} Creo que en este caso no iria, pero si agregaria el
      name: req.params.name, //                                       {include: [{model: Categories}]}
    },
    {
      where: {
        id: idCategoria,
      },
    }
  )
    .then((category) => {
      Product.addCategory(category);
    })
    .catch((err) => res.send(err));

  // En producto no tengo atributo categoria
  // Productxcategories tiene el id de categoria, lo agregaria ahí?
});

// DELETE /products/:idProducto/category/:idCategoria
// Elimina la categoria al producto.
server.delete("/:idProducto/category/:idCategoria", isAdmin, (req, res) => {
  const idProd = req.params.idProducto;
  const idCate = req.params.idCategoria;

  Product.findById(idProd).then((product) => {
    Categories.destroy(idCate) //{includes: [{models: category}]} ?????????????????
      .then((category) => {
        res.send("Deleted Categorie succesfull");
      });
  });
});

//-------------------------------------------------------------------------------------------------//

// GET /products/categoria/:nombreCat                         //Esto deberia ir en categoria.js ? e incluir {Products}
// Retorna todos los productos de {nombreCat} Categoría.

server.get("/categoria/:nombreCat", (req, res, next) => {
  const nameCat = req.params.nombreCat;

  Product.findAll({
    where: { category: nameCat },
  })
    .then(function (products) {
      res.send(products);
    })
    .catch(next);
});

//-----------------------------------------------------------------------------------------------------------//

// GET /search?query={valor}
// Retorna todos los productos que tengan {valor} en su nombre o descripcion.

server.get("/search", (req, res) => {
  const valor = req.query.query;

  Product.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.substring]: valor } },
        { description: { [Op.substring]: valor } },
      ],
    },
  })
    .then((products) => {
      res.send(products);
    })
    .catch((err) => res.send(err));
});

//----------------------------------------------------------------------------------------------------//

// GET /products/:id
// Retorna un objeto de tipo producto con todos sus datos. (Incluidas las categorías e imagenes).

server.get("/:id", (req, res) => {
  const id = req.params.id;
  Product.findOne({
    where: { id: id },
  })
    .then((newProduct) => {
      res.send(newProduct);
    })
    .catch((err) => res.status(404).send(err));
});

//------------------------------------------------------------------------------------------------------------//
// GET /product/:id/review/
// Podés tener esta ruta, o directamente obtener todas las reviews en la ruta de GET product.
server.get("/:id/review", (req, res) => {
  const id = req.params.id;
  Review.findAll({
    where: { productId: id },
  }).then((review) => {
    res.send(review);
  });
});

//------------------------------------------------------------------------------------------------------------//

// POST /products/:id/review

server.post("/:id/review", isAuthenticated, (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const star = req.body.star;
  const id = req.params.id;
  const idUser = req.body.idUser;
  // const userId = req.body.userId;
  Review.create({
    title,
    description: description,
    star: star,
    idUser: idUser,
  })
    .then((newReview) => {
      newReview.setProduct(id);
      res.send(newReview);
    })
    .catch((err) => res.status(500).send(err));
});

//------------------------------------------------------------------------------------------------------------//
// PUT /product/:id/review/:idReview
server.put("/:id/review/:idReview", isAuthenticated, (req, res) => {
  const idProduct = req.params.id;
  const idReview = req.params.idReview;

  Review.update(
    {
      title: req.body.title,
      description: req.body.description,
      star: req.body.star,
    },
    {
      where: {
        id: idReview,
      },
      returning: true,
    }
  )
    .then((response) => {
      res.send(response[1]);
    })
    .catch((err) => res.send(err.message));
});

//------------------------------------------------------------------------------------------------------------//
// DELETE /product/:id/review/:idReview

server.delete("/:id/review/:idReview", isAuthenticated, (req, res) => {
  const id = req.params.id;
  const idReview = req.params.idReview;
  Review.destroy({
    where: { id: idReview },
  }).then((removed) => {
    if (removed) {
      res.status(200).end();
    } else {
      res.status(404).json({ message: "Not found" });
    }
  });
});

//------------------------------------------------------------------------------------------------------------//
module.exports = server;
