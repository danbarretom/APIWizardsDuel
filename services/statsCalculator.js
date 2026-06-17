// Importamos apenas os números necessários para cálculos
const {
  DEFAULT_POWER,
  GRYFFINDOR_POWER,
  SLYTHERIN_POWER,
  HUFFLEPUFF_POWER,
  RAVENCLAW_POWER,
  DEFAULT_MAGIC,
  HUMAN_MAGIC,
  HALF_GIANT_MAGIC,
  GIANT_MAGIC,
  HOUSE_ELF_MAGIC,
  GHOST_MAGIC,
  WEREWOLF_MAGIC,
  VAMPIRE_MAGIC,
  CENTAUR_MAGIC,
  DEFAULT_DEFENSE,
  PURE_BLOOD_DEFENSE,
  HALF_BLOOD_DEFENSE,
  MUGGLE_BORN_DEFENSE,
  MUGGLE_DEFENSE,
  SQUIB_DEFENSE,
  HP_BASE,
  HP_VARIANCE,
  DEFAULT_DAMAGE,
  CHARM_DAMAGE,
  CURSE_DAMAGE,
  HEX_DAMAGE,
  JINX_DAMAGE,
  SPELL_CATEGORY_DAMAGE,
  TRANSFIGURATION_DAMAGE,
  COUNTER_SPELL_DAMAGE,
  HEALING_SPELL_DAMAGE,
} = require('../constants');

function calculatePower(house) {
  let power = DEFAULT_POWER;
  if (house === 'Gryffindor') power = GRYFFINDOR_POWER;
  if (house === 'Slytherin') power = SLYTHERIN_POWER;
  if (house === 'Hufflepuff') power = HUFFLEPUFF_POWER;
  if (house === 'Ravenclaw') power = RAVENCLAW_POWER;
  return power;
}

function calculateMagic(species) {
  let magic = DEFAULT_MAGIC;
  if (species === 'human') magic = HUMAN_MAGIC;
  if (species === 'half-giant') magic = HALF_GIANT_MAGIC;
  if (species === 'giant') magic = GIANT_MAGIC;
  if (species === 'house elf') magic = HOUSE_ELF_MAGIC;
  if (species === 'ghost') magic = GHOST_MAGIC;
  if (species === 'werewolf') magic = WEREWOLF_MAGIC;
  if (species === 'vampire') magic = VAMPIRE_MAGIC;
  if (species === 'centaur') magic = CENTAUR_MAGIC;
  return magic;
}

function calculateDefense(ancestry) {
  let defense = DEFAULT_DEFENSE;
  if (ancestry === 'pure-blood') defense = PURE_BLOOD_DEFENSE;
  if (ancestry === 'half-blood') defense = HALF_BLOOD_DEFENSE;
  if (ancestry === 'muggle-born') defense = MUGGLE_BORN_DEFENSE;
  if (ancestry === 'muggle') defense = MUGGLE_DEFENSE;
  if (ancestry === 'squib') defense = SQUIB_DEFENSE;
  return defense;
}

function calculateHp(defense) {
  return defense + Math.floor(Math.random() * HP_VARIANCE) + HP_BASE;
}

function calculateDamage(category) {
  let damage = DEFAULT_DAMAGE;
  if (category === 'Charm') damage = CHARM_DAMAGE;
  if (category === 'Curse') damage = CURSE_DAMAGE;
  if (category === 'Hex') damage = HEX_DAMAGE;
  if (category === 'Jinx') damage = JINX_DAMAGE;
  if (category === 'Spell') damage = SPELL_CATEGORY_DAMAGE;
  if (category === 'Transfiguration') damage = TRANSFIGURATION_DAMAGE;
  if (category === 'Counter-spell') damage = COUNTER_SPELL_DAMAGE;
  if (category === 'Healing spell') damage = HEALING_SPELL_DAMAGE;
  return damage;
}

module.exports = {
  calculatePower,
  calculateMagic,
  calculateDefense,
  calculateHp,
  calculateDamage,
};
