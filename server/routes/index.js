// server/routes/index.js (ou equivalente)
module.exports = require("./routes");

const express = require('express');
const router = express.Router();
// (Ajuste as importações e modelo conforme seu projeto)
// Suponha um modelo LinkModel com campo `destination`
router.get('/:code', async (req, res, next) => {
  try {
    // Buscar o link encurtado no banco de dados
    const link = await LinkModel.findOne({ code: req.params.code });
    if (!link) return next(); // Código não encontrado, passe para próxima rota (404)

    // Codificar o URL de destino para incluir no parâmetro `target`
    const targetUrl = encodeURIComponent(link.destination);
    // Montar a URL de redirecionamento do Linkvertise
    const lvUrl = `https://linkvertise.com/1345741/dynamic?target=${targetUrl}`;
    // Redirecionar diretamente ao Linkvertise (status 302 padrão)
    return res.redirect(lvUrl);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;



