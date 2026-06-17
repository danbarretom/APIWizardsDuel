/* eslint-env browser */

window.fetchPackData = async function fetchPackData() {
  const response = await fetch('/api/pack');
  // O Linter pediu para removermos o "await" no retorno de funções async
  return response.json();
};

window.fetchSpellsData = async function fetchSpellsData() {
  const response = await fetch('/api/spells');
  return response.json();
};

window.fetchCpuDeckData = async function fetchCpuDeckData() {
  const response = await fetch('/api/cpu-deck', { method: 'POST' });
  return response.json();
};
