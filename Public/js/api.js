/* eslint-env browser */

// ─── COMUNICAÇÃO COM A API (BACK-END) ─────────────────

// Ao atrelar a função ao objeto window, garantimos que ela esteja
// disponível globalmente para o game.js acessar, e evitamos avisos do linter.
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
