import Product from '../models/Product.js';

// GET /api/products  (public)
export const getProducts = async (req, res) => {
  try {
    // Optional query: ?q=search or ?category=...
    const { q, category } = req.query;
    const filter = {};
    if (q) filter.name = { $regex: q, $options: 'i' };
    if (category) filter.category = category;

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('getProducts error', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// GET /api/products/:id (public)
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('getProductById error', err);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

// POST /api/products (admin only)
export const createProduct = async (req, res) => {
  try {
    const payload = req.body;
    const product = new Product(payload);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('createProduct error', err);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

// PUT /api/products/:id (admin only)
export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) {
    console.error('updateProduct error', err);
    res.status(500).json({ message: 'Failed to update product' });
  }
};

// DELETE /api/products/:id (admin only)
export const deleteProduct = async (req, res) => {
  try {
    const removed = await Product.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('deleteProduct error', err);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};
