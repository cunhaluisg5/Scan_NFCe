# Contrato de modernização do aplicativo mobile

## Objetivo

Registrar o ponto de partida técnico do app `Scan_NFCe` para orientar a modernização sem quebrar as funcionalidades originais do TCC.

## Dependências externas

- `TCC_Backend`
- `Scan_NFCe_Reset`
- `Scan_NFCe_Help`

## Fluxos que não podem quebrar

1. autenticação
2. cadastro
3. recuperação de senha
4. leitura de NFC-e
5. salvamento e exclusão de notas
6. listagem por estabelecimento
7. análise de gastos
8. comparação de produtos
9. preferências do usuário

## Riscos atuais

- convivência entre código novo e legado
- ausência de documentação operacional do app
- ausência de `.env.example`
- links externos hardcoded

## Critérios de aceite desta fase

- repositório documentado
- ambiente configurável por variáveis
- link da ajuda centralizado
- escopo da modernização explicitado
