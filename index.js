/* eslint-disable linebreak-style */
const express = require('express');

// Importando os nossos arquivos de rotas
const charactersRoutes = require('./routes/characters');
const spellsRoutes = require('./routes/spells');
const gameRoutes = require('./routes/game');

const app = express();

app.use(express.static('public'));
app.use(express.json());

// "Plugando" as rotas na API base
app.use('/api', charactersRoutes);
app.use('/api', spellsRoutes);
app.use('/api', gameRoutes);

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Servidor rodando na porta 3000. Pronto para receber conexões!');
});
