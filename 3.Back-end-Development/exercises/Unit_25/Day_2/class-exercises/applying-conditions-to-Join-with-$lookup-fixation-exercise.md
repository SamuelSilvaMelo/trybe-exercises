## Para Fixar

Utilizando o banco de dados agg_example , adicione a seguinte collection e faça os exercícios:

```
use agg_example;
db.clients.insertMany([
  { name: "Dave America", State: "Florida" },
  { name: "Ned Flanders", State: "Alasca" },
  { name: "Mark Zuck", State: "Texas" },
  { name: "Edna Krabappel", State: "Montana" },
  { name: "Arnold Schuz", State: "California" },
  { name: "Lisa Simpson", State: "Florida" },
  { name: "Barney Gumble", State: "Texas" },
  { name: "Homer Simpson", State: "Florida" },
]);

db.transactions.insertMany([
  { value: 5900, from: "Dave America", to: "Ned Flanders", bank: 'International' },
  { value: 1000, from: "Mark Zuck", to: "Edna Krabappel", bank: 'FloridaBank' },
  { value: 209, from: "Lisa Simpson", to: "Dave America", bank: 'bankOfAmerica' },
  { value: 10800, from: "Arnold Schuz", to: "Mark Zuck", bank: 'JPMorgan' },
  { value: 850, from: "Barney Gumble", to: "Lisa Simpson", bank: 'Citigroup' },
  { value: 76000, from: "Ned Flanders", to: "Edna Krabappel", bank: 'JPMorgan' },
  { value: 1280, from: "Dave America", to: "Homer Simpson", bank: 'Citigroup' },
  { value: 7000, from: "Arnold Schuz", to: "Ned Flanders", bank: 'International' },
  { value: 59020, from: "Homer Simpson", to: "Lisa Simpson", bank: 'International' },
  { value: 100, from: "Mark Zuck", to: "Barney Gumble", bank: 'FloridaBank' },
]);
```

1. Selecione todos os clientes com as suas respectivas transações feitas;

```
db.clients.aggregate([
  {
    $lookup: {
      from: "transactions",
      let: { client_name: "$name" },
      pipeline: [
        {
          $match: {
            $expr: {
              $or: [
                { $eq: ["$from", "$$client_name"] },
                { $eq: ["$to", "$$client_name"] },
              ],
            },
          },
        },
      ],
      as: "client_transactions",
    },
  },
]);
```

2. Selecione os quatro primeiros clientes com as suas respectivas transações recebidas ordenados pelo estado em ordem alfabética;

```
db.clients.aggregate([
  {
    $lookup: {
      from: "transactions",
      let: { client_name: "$name" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$to", "$$client_name"],
            },
          },
        },
      ],
      as: "client_transactions",
    },
  },
  {
    $sort: { State: 1 },
  },
  {
    $limit: 4,
  },
]);
```

3. Selecione todos os cliente do estado da "Florida" e suas respectivas transações recebidas.

```
db.clients.aggregate([
  {
    $match: {
      State: "Florida"
    }
  },
  {
    $lookup: {
      from: "transactions",
      let: { cliente_name: "$name"},
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$to", "$$cliente_name"],
            }
          }
        }
      ],
      as: "transactions"
    }
  },
]);
```

