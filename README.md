# Rota da Viagem — Cuiabá & Chapada dos Guimarães

App em Next.js + Tailwind para controlar as atividades da viagem. Só front-end (sem API). O estado (o que foi feito e o que foi excluído) fica salvo no navegador via `localStorage`.

## Como rodar

```bash
npm install
npm run dev
```

Abra http://localhost:3000

## Como funciona

- Organizado por **cidade** e **data**, um bloco embaixo do outro:
  - **Cuiabá** — dias 13, 14 e 16
  - **Chapada dos Guimarães** — dia 15
- Clique no **quadradinho** pra marcar como feito (risca o item).
- Botão **X** exclui a atividade.
- Não tem botão de adicionar: para incluir algo novo, é só me pedir.
- **Restaurar lista original** volta tudo ao estado inicial.

## Onde editar as atividades

Tudo fica em `app/data.ts`.
