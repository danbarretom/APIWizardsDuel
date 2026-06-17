const fetch = require('node-fetch');
const { API_BASE_URL, MAX_RANDOM_PAGES, PAGE_SIZE } = require('../constants');

const {
  calculatePower,
  calculateMagic,
  calculateDefense,
  calculateHp,
  calculateDamage,
} = require('./statsCalculator');

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[randomIndex];
    shuffled[randomIndex] = temp;
  }
  return shuffled;
}

function isValidCharacter(attributes) {
  return (
    attributes && attributes.name && attributes.name !== '' && attributes.image
  );
}

function isValidSpell(attributes) {
  return attributes && attributes.name && attributes.name !== '';
}

function processCharactersData(apiCharactersData) {
  const processedCharacters = [];

  apiCharactersData.forEach((character) => {
    const { attributes } = character;

    if (isValidCharacter(attributes)) {
      const power = calculatePower(attributes.house);
      const magic = calculateMagic(attributes.species);
      const defense = calculateDefense(attributes.ancestry);
      const hp = calculateHp(defense);

      processedCharacters.push({
        id: character.id,
        name: attributes.name,
        house: attributes.house || 'Unknown',
        species: attributes.species || 'Unknown',
        ancestry: attributes.ancestry || 'Unknown',
        image: attributes.image,
        power,
        magic,
        defense,
        hp,
        maxHp: hp,
      });
    }
  });

  return processedCharacters;
}

function processSpellsData(apiSpellsData) {
  const processedSpells = [];

  apiSpellsData.forEach((spell) => {
    const { attributes } = spell;

    if (isValidSpell(attributes)) {
      processedSpells.push({
        id: spell.id,
        name: attributes.name,
        effect: attributes.effect || 'Efeito desconhecido',
        category: attributes.category || 'Spell',
        light: attributes.light || 'Unknown',
        damage: calculateDamage(attributes.category),
      });
    }
  });

  return processedSpells;
}

async function fetchAndProcessCharacters() {
  const randomPage = Math.floor(Math.random() * MAX_RANDOM_PAGES) + 1;
  const response = await fetch(
    `${API_BASE_URL}/characters?page[size]=${PAGE_SIZE}&page[number]=${randomPage}`,
  );
  const jsonResponse = await response.json();

  const characters = processCharactersData(jsonResponse.data);
  return shuffleArray(characters);
}

// Aproveitei para extrair o "fetch" dos feitiços para cá também, aplicando ainda mais o DRY!
async function fetchAndProcessSpells() {
  const response = await fetch(
    `${API_BASE_URL}/spells?page[size]=${PAGE_SIZE}`,
  );
  const jsonResponse = await response.json();

  const spells = processSpellsData(jsonResponse.data);
  return shuffleArray(spells);
}

module.exports = {
  fetchAndProcessCharacters,
  fetchAndProcessSpells,
};
