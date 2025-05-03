// server/routes/index.js (ou equivalente)
module.exports = require("./routes");

const express = require('express');
const router = express.Router();
// (Ajuste as importações e modelo conforme seu projeto)
// Suponha um modelo LinkModel com campo `destination`
router.get('/:code', async (req, res, next) => {
  try {
    const link = await LinkModel.findOne({ code: req.params.code });
    if (!link) return res.status(404).send('Link não encontrado');

    const targetUrl = encodeURIComponent(link.destination);
    const lvUrl = `https://linkvertise.com/1345741/dynamic?target=${targetUrl}`;
    console.log(`Redirecionando para: ${lvUrl}`);
    return res.redirect(lvUrl);
  } catch (err) {
    console.error('Erro ao redirecionar:', err);
    return res.status(500).send('Erro interno do servidor');
  }
});


module.exports = router;



