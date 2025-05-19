import express from "express"
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());





const port = 3000



let productsSchema = mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    available: Boolean,
    tags: String,
    propose: Boolean,
    imageUrl: String,
    unit: String
  }, {
    timestamps: true // Tự động thêm createdAt và updatedAt
  });
let products = mongoose.model("products",productsSchema )

mongoose.connect('mongodb+srv://nemcuaa1:n4uEFLbYEx8yaG7N@cluster0.03atdbi.mongodb.net/Shop?retryWrites=true&w=majority&appName=Cluster0')
    .then(()=>{
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.error('Lỗi khi thêm sản phẩm:', err);
      });


      app.post('/products', async (req, res) => {
        try {
            const product = await products.create(req.body)
            console.log(product)
            res.status(201).json(product)   
        } catch (error) {
            res.status(500).json({ message: "Thêm sản phẩm thất bại", error })
        }
    });

    app.delete('/products/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const result = await products.findByIdAndDelete(id);
            if (result) {
                res.json({ message: 'Người dùng đã được xóa' });
            } else {
                res.status(404).json({ message: 'Không tìm thấy người dùng' });
            }
        } catch (error) {
            console.error('Lỗi xóa:', error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    });
    app.get("/products/:id", async (req, res) => {
        try {
            const product = await products.findById(req.params.id);
            if (!product) return res.status(404).send("Không tìm thấy");
    
            res.json(product);
        } catch (err) {
            res.status(500).send("Lỗi server");
        }
    });
    app.put('/products/:id', async (req, res) => {
        const productId = req.params.id;
        const updatedData = req.body;
    
        try {
            const result = await products.findOneAndUpdate({ _id: productId }, updatedData, { new: true });
            console.log("thanh cong")
        } catch (error) {
            console.log(error)  
        }
    
        res.json({ message: 'Cập nhật thành công!' });
    });
app.get('/dashboard', (req, res) => {
  res.render("page/admin-dashboard.ejs")
})
app.get('/inventory', (req, res) => {
    res.render("page/admin-inventory.ejs")
  })
  app.get('/users', (req, res) => {
    res.render("page/admin-users.ejs")
  })
  app.get('/settings', (req, res) => {
    res.render("page/admin-settings.ejs")
  })
  app.get('/reports', (req, res) => {
    res.render("page/admin-reports.ejs")
  })
  app.get('/products', async(req, res) => {
    try {
        const Products = await products.find().lean();
        res.render("page/admin-products.ejs", { Products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Có lỗi xảy ra!');
    }
  })
  app.get('/orders', (req, res) => {
    res.render("page/admin-orders.ejs")
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})