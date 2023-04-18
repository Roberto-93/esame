
import express from "express";
import { body, param, query } from "express-validator";
import { Product }from "../models/Product"
import {checkErrors} from "./utils"
const router = express.Router();


// Implementare una GET che ritorna tutti i prodotti
router.get('/',
body("category").optional().isString(),
body("subcategory").optional().isString(),
body("cost").optional().isNumeric(), 
body("rank").optional().isString(), 
body("reviews").optional().isString(), 
checkErrors,
async (req, res) => { 
  const products = await Product.find({ ...req.query }); 
  res.json(products);
  }
);

// Implementare una GET che ritorna tutti un prodotto in base ad un id

router.get('/:id',
param("id").isMongoId(),
checkErrors,
async (req, res) => { 
  const { id } = req.params;
  const product = await Product.findById(id);  
  res.json(product);
  if (!product) { 
    return res.status(404).json({ message: "product not found" });
  }
  res.json(product); 
}
);

// Implementare una GET che ritorna tutti i prodotti di un determinata categoria

router.get('/',
query("category").isString(),
checkErrors,
async (req, res) => { 
  const { category } = req.params;
  const product = await Product.find({ category }); 
  if (!product) { 
    return res.status(404).json({ message: "product not found" });
  }
  res.json(product); 
}
);

// Implementare una POST che mi permette di inserire un nuovo prodotto

router.post('/',
body("category").exists().isString(),
body("subcategory").exists().isString(),
body("cost").exists().isNumeric(), 
body("rank").exists().isString(), 
body("reviews").exists().isString(), 
checkErrors,
async (req, res) => {
  const { category, subcategory, cost, rank, reviews } = req.body; 
  const product = new Product({ category, subcategory, cost, rank, reviews });
  const productSaved = await product.save();
  res.status(201).json(productSaved);
});

// Implementare una DELETEche che mi permette di eliminare un nuovo prodotto per id 

router.delete('/:id', 
param("id").isMongoId(),
checkErrors,
async (req, res) => { 
  const { id } = req.params; 
  const product = await Product.findById(id); 
  if (!product) { 
    return res.status(404).json({ message: "product not found" });
  }
  await Product.findByIdAndDelete(id); 
  res.json({ message: "product deleted" }); 
}
);
// Implementare una GET che permette di filtrare dei prodotti al cost, ranck, category e subcategory
router.get('/',
query("category").isString(),
query("subcategory").exists().isString(),
query("cost").exists().isNumeric(), 
query("rank").exists().isString(), 
checkErrors,
async (req, res) => { 
  const { category, subcategory, cost, rank } = req.params;
  const product = await Product.find({ category, subcategory, cost, rank }); 
  if (!product) { 
    return res.status(404).json({ message: "product not found" });
  }
  res.json(product); 
}
);




export default router;
