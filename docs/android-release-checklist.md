# Checklist de Release Android

## Identidade do aplicativo

- Nome exibido: `Scan NFC-e`
- `applicationId`: `com.scannfce`
- Versão atual: `2.0.0`
- `versionCode` atual: `2`
- Ícone e splash configurados em [app.json](/C:/Users/luisg/Documents/GitHub/Scan_NFCe/app.json)

## Variáveis de ambiente

Antes da publicação, revisar:

- `EXPO_PUBLIC_API_URL`
- `EXPO_PUBLIC_API_TIMEOUT_MS`
- `EXPO_PUBLIC_HELP_URL`

Para produção, usar URLs públicas reais do backend e da central de ajuda.

## Assinatura Android

Definir as credenciais de assinatura por variáveis/gradle properties:

- `SCANNFCE_UPLOAD_STORE_FILE`
- `SCANNFCE_UPLOAD_STORE_PASSWORD`
- `SCANNFCE_UPLOAD_KEY_ALIAS`
- `SCANNFCE_UPLOAD_KEY_PASSWORD`

Sem essas variáveis, o build `release` deve ser tratado apenas como ambiente local de validação.

## Permissões revisadas

Permissões mantidas no Android:

- `INTERNET`
- `CAMERA`
- `VIBRATE`

Permissões removidas por não fazerem parte do fluxo atual:

- contatos
- calendário
- armazenamento externo
- microfone
- localização
- telefone
- configurações do sistema

## Conteúdo obrigatório para loja

- política de privacidade: [privacy-policy.md](/C:/Users/luisg/Documents/GitHub/Scan_NFCe/docs/privacy-policy.md)
- termos de uso: [terms-of-use.md](/C:/Users/luisg/Documents/GitHub/Scan_NFCe/docs/terms-of-use.md)
- descrição curta e longa da loja
- ícone final
- screenshots atuais do aplicativo

## Checklist técnico final

- `npm ci`
- `npm test`
- `npm run build`
- revisar `.env` de produção
- validar leitura de NFC-e, login, recuperação de senha, ajuda e análises
- confirmar que a URL da ajuda está configurada
- confirmar que o backend de produção aceita o app móvel

## Observações operacionais

- logs de desenvolvimento foram limitados ao ambiente `__DEV__`
- o app não deve ser publicado apontando para `localhost` ou IP local
- a central de ajuda e a API precisam estar disponíveis por HTTPS em produção
