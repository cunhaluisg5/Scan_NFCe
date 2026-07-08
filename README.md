# Scan NFC-e

Aplicativo mobile do ecossistema Scan NFC-e para leitura de QR Code de NFC-e de Minas Gerais, salvamento de notas, análise de gastos e comparação de preços entre compras.

## Visão geral

Este repositório concentra a experiência principal do usuário e se integra com:

- `TCC_Backend`: API de autenticação, notas, crawler e recuperação de senha
- `Scan_NFCe_Reset`: aplicação web usada para redefinir a senha recebida por e-mail
- `Scan_NFCe_Help`: central de ajuda e documentação de uso

## Principais funcionalidades

- cadastro e login com sessão persistida
- recuperação de senha com redirecionamento para a aplicação web dedicada
- leitura de QR Code de NFC-e compatível com o portal da SEFAZ MG
- revisão da nota antes do salvamento ou gravação automática
- listagem de compras por estabelecimento
- visualização detalhada de itens, totais e dados fiscais
- análise temporal de gastos
- comparação de produtos por mês
- preferências do usuário e links rápidos de suporte

## Stack

- Expo SDK 57
- React Native 0.86
- React 19
- React Navigation 7
- Expo Camera
- Expo Secure Store
- AsyncStorage
- Jest + Testing Library

## Estrutura do projeto

```text
src/
  components/   componentes reutilizáveis e blocos de interface
  config/       configuração de ambiente
  context/      autenticação e estado global
  navigation/   árvore principal de navegação
  screens/      telas do aplicativo
  services/     cliente HTTP e integração com a API
  storage/      persistência local
  theme/        tokens visuais
  utils/        formatação, datas e normalização de NFC-e
```

## Variáveis de ambiente

Crie um arquivo `.env` a partir de `.env.example`.

- `EXPO_PUBLIC_API_URL`: URL base da API
- `EXPO_PUBLIC_API_TIMEOUT_MS`: tempo limite das requisições
- `EXPO_PUBLIC_HELP_URL`: URL pública da central de ajuda

## Pré-requisitos

- Node.js compatível com o projeto
- npm
- Expo Go no Android ou emulador configurado
- backend `TCC_Backend` em execução

## Como executar localmente

```bash
npm install
npx expo start -c
```

Scripts úteis:

```bash
npm run start
npm run android
npm run web
npm run lint
npm test
```

## Fluxo principal

1. O usuário cria a conta ou entra com e-mail e senha.
2. O aplicativo mantém a sessão autenticada com armazenamento seguro.
3. A leitura da NFC-e consulta o backend, valida a nota e retorna os dados normalizados.
4. A nota pode ser salva manualmente ou automaticamente, conforme a configuração.
5. As notas salvas alimentam a listagem, os detalhes, a análise de gastos e a comparação de produtos.

## Testes e qualidade

- testes automatizados com `jest`
- validação de lint com `eslint`
- workflow de CI para instalação, lint, testes e build web

## Troubleshooting

- `fetch failed`: confirme se a API está no ar e se `EXPO_PUBLIC_API_URL` aponta para o IP acessível pelo celular
- QR Code incompatível: valide se a nota pertence ao fluxo de NFC-e de Minas Gerais
- Expo Go incompatível: inicie o projeto com a versão do SDK suportada por `expo`
- tela sem dados: verifique se a nota foi salva para o mesmo usuário autenticado

## Publicação e operação

- revise `app.json`, ícones, splash e permissões antes da release
- use variáveis de ambiente separadas para desenvolvimento e produção
- não versionar segredos nem URLs privadas

## Capturas de tela

Os prints antigos foram removidos para evitar documentação desatualizada. As próximas capturas devem ser geradas a partir da interface atual antes da publicação.

## Roadmap

- ampliar a cobertura de testes de interface
- refinar a experiência visual para release
- concluir o checklist operacional de publicação Android
