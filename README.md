# Thermolux Energia Solar — LP de captação (Google Ads)

LP do sistema fotovoltaico da Thermolux (Porto Alegre/RS, desde 1975). Visual **editorial claro**
(papel `#F4F1EA`, verde-musgo `#1F3A2E`, mostarda `#E3A52B`, Fraunces + Manrope) com **fotos reais**
das obras do cliente em `assets/`. Motor de conversão 1Nort (base Connect + calculadora FiberSun).

## Configuração (constantes no `<script>` final)
| Constante | Valor |
|---|---|
| `WEBHOOK` | `https://webhooks.matheusscherrer.com.br/webhook/landing-page` |
| `PAGINA` | `lp-thermolux` |
| `WHATSAPP_NUMBER` | `5551999864756` — (51) 99986-4756 |
| `CLICKUP_CLIENT_ID` | `86akqeqb6` |
| `SHEET_BACKUP` | `https://script.google.com/macros/s/AKfycbyGZWvVtKoCSCZBBsx9v5Y3UwG8t-DXzUjyooii93t1VCCsP3NT5l9_KXaaYFVF396Cgg/exec` |
| GTM | `GTM-583QRCRN` (head + noscript) |
| Planilha | `1MCPBGqtlg02Oe6lzVaB293chef6wRTaFA1aPZ49f6A4` (aba `Leads`) |

## Motor
- 3 formulários: hero (`hero`), calculadora (`calculadora`, envia ao calcular), modal (`modal_orcamento`).
- Todos → `sendWebhook` (planilha no-cors + n8n) → `dataLayer lead_gerado` → WhatsApp com os campos.
- Todos os CTAs, links de WhatsApp, botão flutuante (desktop) e barra fixa (mobile) abrem o modal.
- Atribuição Google Ads + cookies 30d (prefixo `thx_`) + `landing_url`.

## Google Ads → Sufixo do URL final
`campanha_id={campaignid}&grupo_id={adgroupid}&anuncio_id={creative}&keyword={keyword}&match_type={matchtype}&rede={network}&device={device}`

## Entrega
Preview: `https://1nortdigital.github.io/thermolux-lp/`. Final: `thermolux-site.zip` (index.html + assets) na raiz do domínio com HTTPS.
