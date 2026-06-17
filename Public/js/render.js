/* eslint-env browser */

window.getHouseColor = function getHouseColor(h) {
  if (h === 'Gryffindor') return '#6b1010';
  if (h === 'Slytherin') return '#0a3018';
  if (h === 'Hufflepuff') return '#3a2800';
  if (h === 'Ravenclaw') return '#0a1a3a';
  return '#1e1040';
};

window.getHouseEmoji = function getHouseEmoji(h) {
  if (h === 'Gryffindor') return '🦁';
  if (h === 'Slytherin') return '🐍';
  if (h === 'Hufflepuff') return '🦡';
  if (h === 'Ravenclaw') return '🦅';
  return '✦';
};

window.hpColor = function hpColor(pct) {
  if (pct > 0.6) return 'linear-gradient(90deg,#0a4a2a,#22cc77)';
  if (pct > 0.3) return 'linear-gradient(90deg,#4a3a00,#ccaa22)';
  return 'linear-gradient(90deg,#4a0a0a,#cc2222)';
};

// Removemos a reatribuição do parâmetro type (no-param-reassign)
window.logMessage = function logMessage(msg, typeParam) {
  const logType = typeParam || 'info';
  const el = document.getElementById('battleLog');
  const span = document.createElement('span');
  span.className = `log-entry ${logType}`;
  span.textContent = msg;
  el.appendChild(span);
  el.scrollTop = el.scrollHeight;
};

window.setStatus = function setStatus(msg) {
  document.getElementById('battleStatus').textContent = msg;
};

window.showScreen = function showScreen(id) {
  document.querySelectorAll('.screen').forEach((s) => {
    s.classList.remove('active');
  });
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
};

window.renderCard = function renderCard(char) {
  const pct = char.hp / char.maxHp;
  const houseColor = window.getHouseColor(char.house);
  const houseEmoji = window.getHouseEmoji(char.house);

  let html = '<div class="card-img">';
  html += `<img src="${char.image}" alt="${char.name}" onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'">`;
  html += `<div class="house-badge" style="background:${houseColor}">${houseEmoji}</div>`;
  html += '</div>';
  html += '<div class="card-body">';
  html += `<div class="card-name">${char.name}</div>`;
  html += `<div class="card-meta">${char.species} · ${char.house}</div>`;
  html += '<div class="hp-bar-wrap">';
  html += '<span class="hp-label">HP</span>';
  html += `<div class="hp-track"><div class="hp-fill" style="width:${Math.max(0, pct * 100)}%;background:${window.hpColor(pct)}"></div></div>`;
  html += `<span class="hp-val">${Math.max(0, char.hp)}/${char.maxHp}</span>`;
  html += '</div>';
  html += '<div class="mini-stats">';
  html += `<div class="mini-stat"><span class="mini-stat-icon">⚡</span><span class="mini-stat-val">${char.power}</span><span class="mini-stat-lbl">Poder</span></div>`;
  html += `<div class="mini-stat"><span class="mini-stat-icon">🔮</span><span class="mini-stat-val">${char.magic}</span><span class="mini-stat-lbl">Magia</span></div>`;
  html += `<div class="mini-stat"><span class="mini-stat-icon">🛡</span><span class="mini-stat-val">${char.defense}</span><span class="mini-stat-lbl">Defesa</span></div>`;
  html += '</div></div>';
  return html;
};

window.renderDeckBadges = function renderDeckBadges(deck, activeIdx, elId) {
  const el = document.getElementById(elId);
  let html = '';

  deck.forEach((char, i) => {
    // Resolução do no-nested-ternary (Evitar ternários duplos)
    let cls = 'deck-thumb';
    if (char.hp <= 0) {
      cls = 'deck-thumb dead';
    } else if (i === activeIdx) {
      cls = 'deck-thumb active';
    }

    html += `<div class="${cls}"><img src="${char.image}" onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'"></div>`;
  });

  el.innerHTML = html;
};

window.renderSpells = function renderSpells(enabled) {
  const el = document.getElementById('spellList');
  let html = '';

  window.gameState.playerSpells.forEach((sp, i) => {
    const isHeal = sp.damage < 0;
    const dmgLabel = isHeal
      ? `💚 +${Math.abs(sp.damage)} HP`
      : `💀 ${sp.damage} dmg`;
    const dmgClass = isHeal ? 'spell-dmg heal' : 'spell-dmg attack';
    const dis = enabled ? '' : 'disabled';

    html += `<button class="spell-btn" ${dis} onclick="window.castSpell(${i})">`;
    html += `<div><span class="spell-name">${sp.name}</span><span class="spell-effect">${sp.effect}</span></div>`;
    html += `<span class="${dmgClass}">${dmgLabel}</span>`;
    html += '</button>';
  });

  el.innerHTML = html;
};

window.renderPack = function renderPack() {
  const grid = document.getElementById('packGrid');
  grid.innerHTML = '';

  window.gameState.pack.forEach((char, i) => {
    const isSelected = window.gameState.selectedCards.includes(i);
    const div = document.createElement('div');
    div.className = `card ${isSelected ? 'selected' : ''}`;
    div.innerHTML = window.renderCard(char);
    div.setAttribute('data-idx', i);
    // Solução para o "Unexpected unnamed function" e variável
    div.onclick = () => window.toggleDraftCard(i);
    grid.appendChild(div);
  });

  document.getElementById('draftCount').textContent = window.gameState.selectedCards.length;
  document.getElementById('btnConfirmDraft').disabled = window.gameState.selectedCards.length < 2;
};

window.renderBattleState = function renderBattleState() {
  const pIdx = window.getActiveIdx(window.gameState.playerDeck);
  const cIdx = window.getActiveIdx(window.gameState.cpuDeck);

  if (pIdx < 0 || cIdx < 0) {
    window.endGame();
    return;
  }

  const pChar = window.gameState.playerDeck[pIdx];
  const cChar = window.gameState.cpuDeck[cIdx];

  document.getElementById('playerActiveName').textContent = pChar.name;
  document.getElementById('cpuActiveName').textContent = cChar.name;

  const pSlot = document.getElementById('playerCardSlot');
  const cSlot = document.getElementById('cpuCardSlot');

  const pdiv = document.createElement('div');
  pdiv.className = 'card battle-card';
  pdiv.id = 'battleCardP';
  pdiv.innerHTML = window.renderCard(pChar);
  pSlot.innerHTML = '';
  pSlot.appendChild(pdiv);

  const cdiv = document.createElement('div');
  cdiv.className = 'card battle-card';
  cdiv.id = 'battleCardC';
  cdiv.innerHTML = window.renderCard(cChar);
  cSlot.innerHTML = '';
  cSlot.appendChild(cdiv);

  window.renderDeckBadges(
    window.gameState.playerDeck,
    pIdx,
    'playerDeckBadges',
  );
  window.renderDeckBadges(window.gameState.cpuDeck, cIdx, 'cpuDeckBadges');
  window.renderSpells(!window.gameState.waiting);
};
