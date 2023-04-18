import request from "supertest";
require("chai").should();
import { app } from "../app";
import { Product } from "../models/Product";

const basicUrl = "/v1/products";


  // oggetto di prodotto di prova 
  const product = {
    category: "Elettronica",
    subcategory: "Smartphone",
    cost: 999,
    rank: "5stelle",
    reviews: "Ottimo smartphone"
  }
  const product1 = {
    category: "Elettronica",
    subcategory: "Smartphone",
    rank: "5stelle",
    reviews: "Ottimo smartphone, molto veloce e con una batteria che dura tutto il giorno"
  }
 

  describe("create product", () => {
    let id: string;

    after(async () => {
      await Product.findByIdAndDelete(id);
    });
  
    it("Failed test 400", async () => {
        const { status } = await request(app).post(basicUrl).send(product1);
        status.should.be.equal(400);
      });
    // Il codice di stato di risposta previsto è 201, che indica che la richiesta è stata eseguita con successo e il prodotto è stato creato
    it("success test 201", async () => {
      const { status, body } = await request(app)
        .post(basicUrl)
        .send(product);
      status.should.be.equal(201);
      body.should.have.property("_id");
      body.should.have.property("category").equal(product.category);
      body.should.have.property("subcategory").equal(product.subcategory);
      body.should.have.property("cost").equal(product.cost);
      body.should.have.property("rank").equal(product.rank);
      body.should.have.property("reviews").equal(product.reviews);
      id = body._id;
    });
  });


  describe("delete product", () => {
    let id: string;
    before(async () => {
      const prodCreate = await Product.create(product);
      id = prodCreate._id.toString();
    });


    
    it("test failed 401", async () => {
        const { status } = await request(app).delete(`${basicUrl}/${id}`);
        status.should.be.equal(401);
      });
     
    //Il test verifica che il prodotto viene eliminato correttamente e la risposta ha codice 200.
    it("test success 200", async () => {
      const { status } = await request(app)
        .delete(`${basicUrl}/${id}`);
      status.should.be.equal(200);
    });
  });


  describe("get product", () => {
    let id: string;
    
    before(async () => {
      const prodCreate = await Product.create(product);
      id = prodCreate._id.toString();
    });
    after(async () => {
        await Product.findByIdAndDelete(id);
      });

    it("test success 200", async () => {
      const { status, body } = await request(app).get(`${basicUrl}/${id}`);
      status.should.be.equal(200);
      body.should.have.property("_id");
      body.should.have.property("category").equal(product.category);
      body.should.have.property("subcategory").equal(product.subcategory);
      body.should.have.property("cost").equal(product.cost);
      body.should.have.property("rank").equal(product.rank);
      body.should.have.property("reviews").equal(product.reviews);
    });

    it("test unsuccess 404 not valid mongoId", async () => {
      const fakeId = "a" + id.substring(1);
      const { status } = await request(app).get(`${basicUrl}/${fakeId}`);
      status.should.be.equal(404);
    });
  });

  describe("get products", () => {
    let ids: string[] = [];
    const products = [
        {
            category: "Elettronica",
            subcategory: "Smartphone",
            cost: 999,
            rank: "5stelle",
            reviews: "Ottimo smartphone, molto veloce e con una batteria che dura tutto il giorno"
          },
          
          {
            category: "Abbigliamento",
            subcategory: "Scarpe",
            cost: 59.99,
            rank: "4stelle",
            reviews: "Scarpe comode, ma la taglia è leggermente più grande del solito"
          },
          
          {
            category: "Casa",
            subcategory: "Cucina",
            cost: 149.99,
            rank: "3stelle",
            reviews: "Bella, ma la qualità dei materiali non è eccezionale"
          },
          
          
    ];
    //creazione
    before(async () => {
      const response = await Promise.all([
        Product.create(products[0]),
        Product.create(products[1]),
        Product.create(products[2]),
      ]);
      ids = response.map((item) => item._id.toString());
    });
    //cancellazione 
    after(async () => {
      await Promise.all([
        Product.findByIdAndDelete(ids[0]),
        Product.findByIdAndDelete(ids[1]),
        Product.findByIdAndDelete(ids[2]),
      ]);
    });
    it("test success 200", async () => {
      const { status, body } = await request(app).get(basicUrl);
      status.should.be.equal(200);
      body.should.have.property("length").equal(products.length);
    });

    
  });

 
  
  
  


