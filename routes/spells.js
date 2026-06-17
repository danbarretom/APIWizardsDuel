const express = require('express');

const router = express.Router();
const { fetchAndProcessSpells } = require('../services/potterApi');
const { NUMBER_OF_SPELLS_RETURNED } = require('../constants');

router.get('/spells', async (req, res) => {
  try {
    const shuffledSpells = await fetchAndProcessSpells();

    res.json({ spells: shuffledSpells.slice(0, NUMBER_OF_SPELLS_RETURNED) });
  } catch (error) {
    res.status(500).json({
      error: 'Erro no servidor',
      message: 'Não foi possível buscar os feitiços disponíveis.',
    });
  }
});

module.exports = router;
