# Scan NFC-e

Aplicativo mobile em React Native/Expo para leitura de QR Code de NFC-e, armazenamento das notas, análise de gastos e comparação de produtos.

## Visão geral

Este repositório representa o cliente mobile do ecossistema `Scan NFC-e` e integra com:

- `TCC_Backend`: API principal
- `Scan_NFCe_Reset`: fluxo web de redefinição de senha
- `Scan_NFCe_Help`: central de ajuda

## Funcionalidades preservadas

- cadastro e login
- recuperação de senha
- leitura de QR Code de NFC-e
- armazenamento e exclusão de notas
- listagem por estabelecimento
- visualização detalhada
- análise de gastos
- comparação de produtos
- preferências do usuário

## Stack atual

- Expo SDK 57
- React Native 0.86
- React Navigation 7
- Expo Camera
- Expo Secure Store
- AsyncStorage

## Estrutura principal

```text
src/
  components/
  config/
  context/
  navigation/
  screens/
  services/
  storage/
  theme/
  utils/
```

## Variáveis de ambiente

Crie um arquivo `.env` a partir de `.env.example`.

- `EXPO_PUBLIC_API_URL`: URL base da API
- `EXPO_PUBLIC_HELP_URL`: URL da central de ajuda

## Execução local

```bash
npm install
npx expo start -c
```

## Estado atual da modernização

O app já está atualizado para uma base Expo moderna, mas ainda convive com parte do código legado do projeto original. A fase atual da profissionalização cobre:

- documentação inicial do repositório
- contrato de modernização
- padronização de configuração por ambiente
- remoção gradual de links hardcoded

## Checklist funcional

- login com sessão persistida
- cadastro de usuário
- acesso ao fluxo de recuperação de senha
- leitura e salvamento de NFC-e
- análise de gastos e comparação
- acesso à ajuda
