const express = require('express');

const router = express.Router();
const { fetchAndProcessCharacters } = require('../services/potterApi');
const { CARDS_IN_PACK } = require('../constants');

router.get('/pack', async (req, res) => {
  try {
    const shuffledCharacters = await fetchAndProcessCharacters();
    res.json({ cards: shuffledCharacters.slice(0, CARDS_IN_PACK) });
  } catch (error) {
    res.status(500).json({
      error: 'Erro no servidor',
      message:
        'Não foi possível carregar o seu pacote de cartas. Verifique sua conexão.',
    });
  }
});

module.exports = router;
