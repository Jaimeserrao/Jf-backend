
// BACKEND - checkout_backend.js
// Instale as dependências com: npm install express cors body-parser mercadopago

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mercadopago = require('mercadopago');

// Substitua com seu Access Token do Mercado Pago
mercadopago.configure({
  access_token: 'SEU_ACCESS_TOKEN_AQUI'
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/criar-pagamento', async (req, res) => {
  try {
    const { itens } = req.body;

    const preference = {
      items: itens.map(item => ({
        title: item.name,
        unit_price: item.price,
        quantity: 1,
        currency_id: 'BRL'
      })),
      back_urls: {
        success: 'https://seusite.com/sucesso',
        failure: 'https://seusite.com/falha',
        pending: 'https://seusite.com/pendente'
      },
      auto_return: 'approved'
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
