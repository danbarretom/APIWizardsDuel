const express = require('express');

const router = express.Router();
const { fetchAndProcessCharacters } = require('../services/potterApi');
const { CARDS_IN_CPU_DECK } = require('../constants');

router.post('/cpu-deck', async (req, res) => {
  try {
    const shuffledCharacters = await fetchAndProcessCharacters();
    res.json({ deck: shuffledCharacters.slice(0, CARDS_IN_CPU_DECK) });
  } catch (error) {
    res.status(500).json({
      error: 'Erro no servidor',
      message: 'Ocorreu um problema ao montar o deck do oponente.',
    });
  }
});

module.exports = router;
