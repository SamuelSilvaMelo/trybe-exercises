## Para Fixar

Utilizando o banco de dados `storage`, faça os seguintes exercícios:

```
db.products.insertMany([
  { "name": "Ball", "purchase_price": 7.6, "taxes": 1.9, "sale_price": 12.5, "quantity": 5 },
  { "name": "Baseball bat", "purchase_price": 18.5, "taxes": 5.3, "sale_price": 39.9, "quantity": 12 },
  { "name": "Sneakers", "purchase_price": 10.4, "taxes": 1.50, "sale_price": 14.9, "quantity": 3 },
  { "name": "Gloves", "purchase_price": 2.85, "taxes": 0.90, "sale_price": 5.70, "quantity": 34 },
  { "name": "Jacket", "purchase_price": 28.9, "taxes": 10.80, "sale_price": 59.9, "quantity": 20 },
  { "name": "Mousepad", "purchase_price": 16.6, "taxes": 3.40, "sale_price": 29.9, "quantity": 8 },
  { "name": "Monitor", "purchase_price": 119.9, "taxes": 39.20, "sale_price": 240.6, "quantity": 11 },
]);
```

1. Retorne o menor número inteiro relativo ao preço de venda de cada produto;

```
db.products.aggregate([
  {
    $project: {
      _id: 0,
      name: 1,
      sale_price: {
        $floor: "$sale_price",
      },
    },
  },
]);
```

2. Retorne o maior número inteiro relativo ao lucro total sobre cada produto. _Nota: Desconsiderar taxas (taxes)_.

```
db.products.aggregate([
  {
    $project: {
      _id: 0,
      name: 1,
      profit: {
        $ceil: { $subtract: ["$sale_price", "$purchase_price"] },
      },
    },
  },
]);
```

