# Bushi Belts

Loja de faixas de Jiu-Jitsu inspirada no Bushidō. React, Vite, Tailwind, Zustand e Express.

## Desenvolvimento

Use Node 22.12+ ou 24 LTS, conforme os requisitos do Vite 8.

```sh
npm install
npm run dev
```

A loja abre em http://localhost:3000. O Vite encaminha `/api` para o servidor na porta 4000.

Para habilitar o checkout, copie `.env.example` para `.env` na raiz, preencha o token de teste do Mercado Pago localmente e execute em outro terminal:

```sh
npm run server
```

Nunca coloque o token privado em variáveis `VITE_*`. `MP_SANDBOX=true` seleciona o checkout de teste. Em produção, use HTTPS, configure `FRONTEND_URL` e encaminhe `/api` ao backend, ou configure `VITE_API_URL` antes do build.

## Verificação

```sh
npm test
npm run lint
npm run build
```

O catálogo compartilhado em `src/domain/catalog.js` define preços, tamanhos e limites de graus. O servidor recalcula o total, valida quantidades e opções e ignora preços enviados pelo navegador. O adicional de R$ 15 inclui nome e/ou academia. Confirme essa regra comercial antes do lançamento.

## Estado da integração

O checkout hospedado no Mercado Pago substitui o formulário de cartão anterior. A loja não coleta número de cartão nem CVV. A sacola fica salva no navegador e não é apagada ao criar o pagamento.

Ainda é necessário, antes de operar comercialmente:

- Validar o fluxo completo com credenciais de teste do lojista.
- Definir frete, prazo, endereço de entrega e política de trocas.
- Persistir pedidos e personalizações em banco, implementar webhook validado e conciliar pagamentos. A criação de uma preferência não confirma pagamento.
- Adicionar proteção contra abuso ao endpoint de checkout.
- Resolver os alertas de dependências reportados pelo npm. A tentativa de `npm audit fix` falhou com erro interno `edgesOut`.

A prévia usa uma base fotográfica editada a partir da referência fornecida, em `public/products/belt-base.png`, com cores, ponteira, graus e bordados aplicados dinamicamente em SVG. A etiqueta foi adaptada para Bushi. Não representa uma fotografia do produto final fabricado. A faixa vermelha permite até sete graus conforme orientação do responsável pelo projeto.
