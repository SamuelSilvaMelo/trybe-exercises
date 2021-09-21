## Agora, a prática

O MongoDb possui diversas ferramentas, como, por exemplo, `mongo`, `mongosh`, `Compass` e outras ferramentas de terceiros. Você pode utilizar o que achar melhor para executar as _queries_, o importante é realizá-las.

Você continuará utilizando o banco de dados `erp` do dia anterior. Nos exercícios **1** a **8**, você utilizará o mesmo pipeline. A ideia é começar com um pipeline pequeno e ir adicionando estágios à medida que você for evoluindo nos exercícios. Vamos lá?

**Exercício 1:** Utilize uma combinação das expressões aritméticas e adicione um campo chamado `idade` à coleção `clientes`. Algumas dicas:

- arredonde para baixo o valor da idade;
- calcule a idade usando a diferença entre a data corrente e a data de nascimento;
- 1 dia é igual a 86400000 milissegundos.

**Resposta:**
```
db.clientes.aggregate([
  {
    $addFields: {
      idade: {
        $floor: {
          $divide: [
            { $divide: [{ $subtract: ["$$NOW", "$dataNascimento"] }, 86400000] },
            365,
          ],
        },
      },
    },
  },
]);
```

**Exercício 2:** Utilizando o novo campo `idade`, conte quantos clientes têm entre `18` e `25` anos.

**Resposta:**
```
db.clientes.aggregate([
  {
    $addFields: {
      idade: {
        $floor: {
          $divide: [
            { $divide: [{ $subtract: ["$$NOW", "$dataNascimento"] }, 86400000] },
            365,
          ],
        },
      },
    },
  },
  {
    $match: {
      idade: { $gte: 18, $lte: 25 },
    },
  },
  {
    $count: "total_clientes",
  },
]);
```

**Exercício 3:** Remova os estágios `$count` e `$match` do exercício anterior e adicione um estágio no pipeline que coloque as compras do cliente no campo `compras`.

**Resposta:**
```
db.clientes.aggregate([
  {
    $addFields: {
      idade: {
        $floor: {
          $divide: [
            { $divide: [{ $subtract: ["$$NOW", "$dataNascimento"] }, 86400000] },
            365,
          ],
        },
      },
    },
  },
  {
    $lookup: {
      from: "vendas",
      localField: "clienteId",
      foreignField: "clienteId",
      as: "compras",
    },
  },
]);
```

**Exercício 4:** Selecione TODOS os clientes que compraram entre `Junho de 2019` e `Março de 2020`.

**Resposta:**
```
db.clientes.aggregate([
  {
    $addFields: {
      idade: {
        $floor: {
          $divide: [
            { $divide: [{ $subtract: ["$$NOW", "$dataNascimento"] }, 86400000] },
            365,
          ],
        },
      },
    },
  },
  {
    $lookup: {
      from: "vendas",
      localField: "clienteId",
      foreignField: "clienteId",
      as: "compras",
    },
  },
  {
    $match: {
      "compras.dataVenda": {
        $gte: ISODate("2019-06-30"),
        $lte: ISODate("2020-03-31"),
      },
    },
  },
]);
```

**Exercício 5:** Confira o número de documentos retornados pelo pipeline com o método `itcount()`. Até aqui, você deve ter 486 documentos sendo retornados.

**Resposta:**
```
db.clientes.aggregate([
  {
    $addFields: {
      idade: {
        $floor: {
          $divide: [
            { $divide: [{ $subtract: ["$$NOW", "$dataNascimento"] }, 86400000] },
            365,
          ],
        },
      },
    },
  },
  {
    $lookup: {
      from: "vendas",
      localField: "clienteId",
      foreignField: "clienteId",
      as: "compras",
    },
  },
  {
    $match: {
      "compras.dataVenda": {
        $gte: ISODate("2019-06-01"),
        $lte: ISODate("2020-03-31"),
      },
    },
  },
]).itcount();
```

**Exercício 6:** Ainda nesse _pipeline_, descubra os `5` estados com mais compras.

**Resposta:**
```
db.clientes.aggregate([
  {
    $addFields: {
      idade: {
        $floor: {
          $divide: [
            { $divide: [{ $subtract: ["$$NOW", "$dataNascimento"] }, 86400000] },
            365,
          ],
        },
      },
    },
  },
  {
    $lookup: {
      from: "vendas",
      localField: "clienteId",
      foreignField: "clienteId",
      as: "compras",
    },
  },
  {
    $match: {
      "compras.dataVenda": {
        $gte: ISODate("2019-06-30"),
        $lte: ISODate("2020-03-31"),
      },
    },
  },
  {
    $addFields: {
      total_compras: {
        $size: "$compras",
      },
    },
  },
  {
    $sort: {
      total_compras: -1,
    },
  },
  {
    $limit: 5,
  },
  {
    $project: {
      _id: 0,
      estado: "$endereco.uf",
      total_compras: 1,
    },
  },
]);
```

**Exercício 7:** Descubra o cliente que mais consumiu `QUEIJO PRATO`. Retorne um documento com a seguinte estrutura:

```
{
  "nomeCliente": "NOME",
  "uf": "UF DO CLIENTE",
  "totalConsumido": 100
}
```

**Resposta:**
```
db.vendas.aggregate([
  {
    $match: {
      "itens.nome": "QUEIJO PRATO",
    },
  },
  {
    $unwind: "$itens",
  },
  {
    $match: {
      "itens.nome": "QUEIJO PRATO",
    },
  },
  {
    $group: {
      _id: "$clienteId",
      totalConsumido: { $sum: "$itens.quantidade" },
    },
  },
  {
    $sort: {
      totalConsumido: -1,
    },
  },
  {
    $limit: 1,
  },
  {
    $lookup: {
      from: "clientes",
      localField: "_id",
      foreignField: "clienteId",
      as: "dados_cliente",
    },
  },
  {
    $unwind: "$dados_cliente",
  },
  {
    $project: {
      _id: 0,
      nomeCliente: "$dados_cliente.nome",
      uf: "$dados_cliente.endereco.uf",
      totalConsumido: 1,
    },
  },
]);
```

**Exercício 8:** Selecione todas as vendas do mês de `Março de 2020`, com `status EM SEPARACAO`. Acrescente um campo chamado `dataEntregaPrevista` com valor igual a três dias após a data da venda. Retorne apenas os campos `clienteId`, `dataVenda` e `dataEntregaPrevista`.

**Resposta:**
```
db.vendas.aggregate([
  {
    $match: {
      status: "EM SEPARACAO",
      dataVenda: { $gte: ISODate("2020-03-01"), $lte: ISODate("2020-03-31") },
    },
  },
  {
    $addFields: {
      dataEntregaPrevista: {
        $add: ["$dataVenda", 3 * 24 * 60 * 60000],
      },
    },
  },
  {
    $project: {
      _id: 0,
      clienteId: 1,
      dataVenda: 1,
      dataEntregaPrevista: 1,
    },
  },
]);
```

**Exercício 9:** Calcule a diferença absoluta em dias entre a data da primeira entrega prevista e a última, considerando o _pipeline_ do exercício 8.

**Resposta:**
```
db.vendas.aggregate([
  {
    $match: {
      status: "EM SEPARACAO",
      dataVenda: { $gte: ISODate("2020-03-01"), $lte: ISODate("2020-03-31") },
    },
  },
  {
    $addFields: {
      dataEntregaPrevista: {
        $add: ["$dataVenda", 3 * 24 * 60 * 60000],
      },
    },
  },
  {
    $project: {
      _id: 0,
      clienteId: 1,
      dataVenda: 1,
      dataEntregaPrevista: 1,
    },
  },
  {
    $group: {
      _id: null,
      primeira_entrega: { $min: "$dataEntregaPrevista" },
      ultima_entrega: { $max: "$dataEntregaPrevista" },
    },
  },
  {
    $project: {
      diferenca_absoluta: {
        $ceil: {
          $abs: {
            $divide: [
              { $subtract: ["$primeira_entrega", "$ultima_entrega"] },
              { $multiply: [24, 60, 60000] },
            ]
            ,
          },
        },
      },
    },
  },
]);
```

