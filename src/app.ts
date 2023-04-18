import express from 'express';
import mongoose from "mongoose";
import products from'./routes/products';
export const app = express();



app.use('/v1/products', products);

app.listen(process.env.PORT || 3000, async () => {
    console.log("Server is running port 3000");
    await mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB}`);
});

export default app;

