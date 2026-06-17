# Wizard Duel

Card game temático do universo Harry Potter, desenvolvido com Node.js + Express no back-end e HTML/CSS/JS puro no front-end, consumindo a [PotterDB API](https://api.potterdb.com).

## Como executar

```bash
npm install
npm start
# Acesse: http://localhost:3000
```

## Como funciona o jogo

- Cada carta representa um personagem do universo Harry Potter com 4 atributos: **Poder**, **Magia**, **Defesa** e **Sorte**
- Na fase de draft, o jogador escolhe 2 personagens para compor seu deck
- A cada rodada, o jogador escolhe um feitiço para atacar o personagem CPU
- O personagem com HP zerado é eliminado; o dono de quem eliminar mais personagens vence o duelo

---
