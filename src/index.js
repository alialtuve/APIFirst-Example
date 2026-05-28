const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const openapiValidator = require('express-openapi-validator');

const app = express();
const port = 3000;

const swaggerDocument = YAML.load('./openapi.yaml');

const users = [
  {
    id: 1,
    name: "John Doe",
    age: 30,
    email: "john.doe@example.com",
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 25,
    email: "jane.smith@example.com",
  },
  {
    id: 3,
    name: "Alice Johnson",
    age: 28,
    email: "alice.jhonson@example.com",
  },
];

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());

app.use(openapiValidator.middleware({
  apiSpec: swaggerDocument,
  validateRequests: true, 
  validateResponses: true,
  ignorePathRegex: /\/api-docs(\/.*)?/
}));

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});


app.post('/users', (req, res) => {
  const { name, age, email } = req.body;
  const id = Date.now().toString();
  const newUser = { id: parseInt(id), name, age, email };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.get('/users/:id', (req, res)=> {
  const  userId  = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json(users[userIndex]);
});

app.put('/users/:id', (req, res) => {
  const  userId  = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { name, age, email } = req.body;
  const updatedUser = { id: userId, name, age, email };
  users[userIndex] = updatedUser;
  res.status(200).json(updatedUser);
});

const products = [
  {
    id: 1,
    name: 'Wireless Mouse',
    price: 24.99,
    category: 'electronics',
    tags: ['computer', 'accessory'],
    inStock: true,
    specifications: {
      color: 'black',
      connectivity: 'wireless'
    },
    ratings: [
      { score: 5, comment: 'Great mouse' },
      { score: 4, comment: 'Good value' }
    ]
  },
  {
    id: 2,
    name: 'Classic Novel',
    price: 12.50,
    category: 'books',
    tags: ['fiction'],
    inStock: true,
    specifications: {
      author: 'Jane Austen'
    },
    ratings: [
      { score: 5, comment: 'Excellent read' }
    ]
  }
];

app.get('/products', (req, res) => {
  res.status(200).json(products);
});

app.post('/products', (req, res) => {
  const { name, price, category, tags, inStock, specifications, ratings } = req.body;
  const id = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
  const newProduct = { id, name, price, category, tags, inStock, specifications, ratings };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.get('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.status(200).json(product);
});

app.put('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const { name, price, category, tags, inStock, specifications, ratings } = req.body;
  const updatedProduct = { id: productId, name, price, category, tags, inStock, specifications, ratings };

  products[productIndex] = updatedProduct;
  res.status(200).json(updatedProduct);
});

app.delete('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products.splice(productIndex, 1);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  console.log(`API documentation available at http://localhost:${port}/v1`);
  console.log(`API documentation available at http://localhost:${port}/v2`);
});