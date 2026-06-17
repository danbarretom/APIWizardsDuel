/* eslint-env browser */

// ─── ESTADO GLOBAL E LÓGICA DO JOGO ───────────────────

// Atrelamos o state ao window e renomeamos para gameState por clareza
window.gameState = {
  phase: 'loading',
  pack: [],
  selectedCards: [],
  playerDeck: [],
  cpuDeck: [],
  spells: [],
  playerSpells: [],
  round: 1,
  scoreP: 0,
  scoreC: 0,
  waiting: false,
};

window.loadGame = async function loadGame() {
  const bar = document.getElementById('loadBar');
  const msg = document.getElementById('loadMsg');

  msg.textContent = 'Invocando personagens...';
  bar.style.width = '20%';

  const packData = await window.fetchPackData();
  window.gameState.pack = packData.cards;

  bar.style.width = '55%';
  msg.textContent = 'Consultando o livro de feitiços...';

  const spellData = await window.fetchSpellsData();
  window.gameState.spells = spellData.spells;

  bar.style.width = '85%';
  msg.textContent = 'Preparando o adversário...';

  const cpuData = await window.fetchCpuDeckData();
  window.gameState.cpuDeck = cpuData.deck;

  const shuffled = [...window.gameState.spells];
  for (let x = shuffled.length - 1; x > 0; x -= 1) {
    const y = Math.floor(Math.random() * (x + 1));
    const z = shuffled[x];
    shuffled[x] = shuffled[y];
    shuffled[y] = z;
  }
  window.gameState.playerSpells = shuffled.slice(0, 5);

  bar.style.width = '100%';
  msg.textContent = 'Pronto!';

  setTimeout(() => {
    document.getElementById('screen-loading').classList.add('fade-out');
    setTimeout(() => {
      document.getElementById('screen-loading').style.display = 'none';
      window.showScreen('screen-draft');
      window.renderPack();
    }, 600);
  }, 400);
};

window.toggleDraftCard = function toggleDraftCard(idx) {
  const pos = window.gameState.selectedCards.indexOf(idx);
  if (pos >= 0) {
    window.gameState.selectedCards.splice(pos, 1);
  } else {
    if (window.gameState.selectedCards.length >= 2) return;
    window.gameState.selectedCards.push(idx);
  }
  window.renderPack();
};

window.rerollPack = async function rerollPack() {
  // 1. CAPTURA O BOTÃO E DESABILITA O CLIQUE
  const btn = document.querySelector('button[onclick="window.rerollPack()"]');
  if (btn) btn.disabled = true;

  window.gameState.selectedCards = [];
  document.getElementById('packGrid').innerHTML = '<div style="text-align:center;padding:40px;font-family:Cinzel,serif;font-size:0.7rem;letter-spacing:2px;color:var(--parchment-dark);grid-column:1/-1">Invocando novos bruxos...</div>';

  const data = await window.fetchPackData();
  window.gameState.pack = data.cards;
  window.renderPack();

  // 2. REABILITA O BOTÃO APÓS A TELA SER PINTADA COM O NOVO PACK
  if (btn) btn.disabled = false;
};

window.confirmDraft = function confirmDraft() {
  if (window.gameState.selectedCards.length < 2) return;
  const p1 = window.gameState.pack[window.gameState.selectedCards[0]];
  const p2 = window.gameState.pack[window.gameState.selectedCards[1]];
  window.gameState.playerDeck = [p1, p2];
  window.startBattle();
};

window.startBattle = function startBattle() {
  window.gameState.round = 1;
  window.gameState.scoreP = 0;
  window.gameState.scoreC = 0;
  window.gameState.waiting = false;

  document.getElementById('scoreP').textContent = '0';
  document.getElementById('scoreC').textContent = '0';
  document.getElementById('roundNum').textContent = '1';
  document.getElementById('battleLog').innerHTML = '';
  document.getElementById('btnNext').style.display = 'none';

  window.showScreen('screen-battle');
  window.renderBattleState();
  window.logMessage(
    '⚔ O duelo começou! Escolha um feitiço para atacar.',
    'info',
  );
  window.setStatus('Escolha um feitiço para atacar!');
};

window.getActiveIdx = function getActiveIdx(deck) {
  for (let i = 0; i < deck.length; i += 1) {
    if (deck[i].hp > 0) return i;
  }
  return -1;
};

window.castSpell = function castSpell(spellIdx) {
  if (window.gameState.waiting) return;
  window.gameState.waiting = true;
  window.renderSpells(false);

  const sp = window.gameState.playerSpells[spellIdx];
  const pIdx = window.getActiveIdx(window.gameState.playerDeck);
  const cIdx = window.getActiveIdx(window.gameState.cpuDeck);
  const pChar = window.gameState.playerDeck[pIdx];
  const cChar = window.gameState.cpuDeck[cIdx];

  const pDmg = Math.floor(
    sp.damage * (pChar.magic / 100) * (Math.random() * 0.4 + 0.8),
  );

  if (sp.damage < 0) {
    const heal = Math.abs(pDmg);
    pChar.hp = Math.min(pChar.maxHp, pChar.hp + heal);
    window.logMessage(
      `✨ ${sp.name} — você curou ${heal} HP! (${pChar.name}: ${pChar.hp} HP)`,
      'heal',
    );
    document.getElementById('battleCardP').classList.add('battling');
    setTimeout(() => {
      const card = document.getElementById('battleCardP');
      if (card) card.classList.remove('battling');
    }, 500);
  } else {
    cChar.hp -= pDmg;
    window.logMessage(
      `⚡ ${sp.name} → ${cChar.name} perdeu ${pDmg} HP! (${cChar.name}: ${Math.max(0, cChar.hp)} HP)`,
      'win',
    );
    document.getElementById('battleCardC').classList.add('hit');
    setTimeout(() => {
      const card = document.getElementById('battleCardC');
      if (card) card.classList.remove('hit');
    }, 600);
  }

  setTimeout(() => {
    const cpuSpellIdx = Math.floor(
      Math.random() * window.gameState.spells.length,
    );
    const cpuSp = window.gameState.spells[cpuSpellIdx];
    const cpuDmg = Math.floor(
      cpuSp.damage * (cChar.magic / 100) * (Math.random() * 0.4 + 0.8),
    );

    if (cpuSp.damage < 0) {
      const cpuHeal = Math.abs(cpuDmg);
      cChar.hp = Math.min(cChar.maxHp, cChar.hp + cpuHeal);
      window.logMessage(
        `🧙 CPU: ${cpuSp.name} — CPU curou ${cpuHeal} HP! (${cChar.name}: ${cChar.hp} HP)`,
        'heal',
      );
      const cardC = document.getElementById('battleCardC');
      if (cardC) {
        cardC.classList.add('battling');
        setTimeout(() => {
          cardC.classList.remove('battling');
        }, 500);
      }
    } else {
      pChar.hp -= cpuDmg;
      window.logMessage(
        `💀 CPU: ${cpuSp.name} → ${pChar.name} perdeu ${cpuDmg} HP! (${pChar.name}: ${Math.max(0, pChar.hp)} HP)`,
        'lose',
      );
      const cardP = document.getElementById('battleCardP');
      if (cardP) {
        cardP.classList.add('hit');
        setTimeout(() => {
          cardP.classList.remove('hit');
        }, 600);
      }
    }

    setTimeout(() => {
      let roundOver = false;

      if (pIdx >= 0 && window.gameState.playerDeck[pIdx].hp <= 0) {
        window.logMessage(
          `💀 ${window.gameState.playerDeck[pIdx].name} foi derrotado!`,
          'lose',
        );
        window.gameState.scoreC += 1;
        document.getElementById('scoreC').textContent = window.gameState.scoreC;
        roundOver = true;
      }
      if (cIdx >= 0 && window.gameState.cpuDeck[cIdx].hp <= 0) {
        window.logMessage(
          `🏆 ${window.gameState.cpuDeck[cIdx].name} foi derrotado!`,
          'win',
        );
        window.gameState.scoreP += 1;
        document.getElementById('scoreP').textContent = window.gameState.scoreP;
        roundOver = true;
      }

      window.renderBattleState();

      const pAlive = window.getActiveIdx(window.gameState.playerDeck);
      const cAlive = window.getActiveIdx(window.gameState.cpuDeck);

      if (pAlive < 0 || cAlive < 0) {
        setTimeout(window.endGame, 800);
        return;
      }

      window.gameState.waiting = false;

      if (roundOver) {
        window.gameState.round += 1;
        document.getElementById('roundNum').textContent = window.gameState.round;
        window.logMessage(`— Rodada ${window.gameState.round} —`, 'info');
      }

      window.setStatus('Escolha um feitiço para atacar!');
      window.renderSpells(true);
    }, 700);
  }, 800);
};

window.nextRound = function nextRound() {
  document.getElementById('btnNext').style.display = 'none';
  window.gameState.round += 1;
  document.getElementById('roundNum').textContent = window.gameState.round;
  window.logMessage(`— Rodada ${window.gameState.round} —`, 'info');
  window.gameState.waiting = false;
  window.renderBattleState();
  window.setStatus('Escolha um feitiço para atacar!');
};

window.endGame = function endGame() {
  const over = document.getElementById('screen-over');
  const glyph = document.getElementById('overGlyph');
  const title = document.getElementById('overTitle');
  const sub = document.getElementById('overSub');
  const score = document.getElementById('overScore');

  if (window.gameState.scoreP > window.gameState.scoreC) {
    glyph.textContent = '🏆';
    title.textContent = 'Vitória!';
    sub.textContent = 'Você dominou o duelo!';
  } else if (window.gameState.scoreC > window.gameState.scoreP) {
    glyph.textContent = '💀';
    title.textContent = 'Derrota';
    sub.textContent = 'O CPU foi mais poderoso desta vez.';
  } else {
    glyph.textContent = '✦';
    title.textContent = 'Empate';
    sub.textContent = 'Bruxos igualmente poderosos.';
  }
  score.textContent = `Você ${window.gameState.scoreP}  ×  ${window.gameState.scoreC} CPU`;
  over.classList.add('active');
};

window.restartGame = function restartGame() {
  document.getElementById('screen-over').classList.remove('active');
  window.gameState.selectedCards = [];
  window.gameState.pack = [];
  window.gameState.playerDeck = [];

  const loadEl = document.getElementById('screen-loading');
  loadEl.style.display = 'flex';
  loadEl.classList.remove('fade-out');
  document.getElementById('loadBar').style.width = '0%';
  window.showScreen('');
  window.loadGame();
};

// Inicializa o jogo!
window.loadGame();
