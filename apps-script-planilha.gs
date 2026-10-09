/**
 * Thermolux Energia Solar — grava os leads da LP (lp-thermolux) na planilha.
 *
 * COMO ATIVAR:
 * 1. Planilha do cliente → Extensões → Apps Script → apague o padrão → cole TODO
 *    este arquivo → salve.
 * 2. Implantar → Nova implantação → tipo "App da Web".
 *    - Executar como: Eu
 *    - Quem pode acessar: QUALQUER PESSOA   <<< se não for este, o site leva 401
 * 3. Autorize (Avançado → Acessar (não seguro) → Permitir).
 * 4. Copie a URL /exec e cole em SHEET_BACKUP no index.html.
 *
 * Para ATUALIZAR sem trocar a URL: Gerenciar implantações → Editar (lápis)
 * → Versão: Nova versão → Implantar.
 *
 * A linha é montada NA ORDEM DO CABEÇALHO REAL da planilha (mapeando por nome de
 * coluna), não na ordem de COLS. Isso é o que impede os valores de saírem trocados
 * quando o cabeçalho da planilha não é exatamente igual a COLS.
 */

// Vazio = usa a planilha onde este script está colado. Preenchido = abre por ID.
var SHEET_ID = '1MCPBGqtlg02Oe6lzVaB293chef6wRTaFA1aPZ49f6A4';
var SHEET_NAME = 'Leads'; // aba; criada automaticamente se não existir

// Cabeçalho desejado (usado se a aba estiver vazia; o que faltar é acrescentado no fim).
var COLS = [
  // visíveis
  'recebido_em','nome','telefone','cidade','conta_mensal','tipo_projeto','economia_estimada',
  'form_type','utm_campaign','keyword','device','utm_source','utm_medium',
  // grupo recolhido (rastreamento técnico)
  'gclid','gbraid','wbraid','campanha_id','grupo_id','anuncio_id','match_type','rede',
  'utm_term','utm_content','fbclid','ad_campaign','ad_conjunto','ad_nome',
  'landing_url','page_url','page_referer','ip','timestamp','pagina','clickup_client_id','conta_luz'
];

function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    var ss = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    if (sh.getLastRow() === 0) {
      sh.appendRow(COLS);
      sh.getRange(1, 1, 1, COLS.length).setFontWeight('bold');
      sh.setFrozenRows(1);
    }

    // Auto-heal do cabeçalho: acrescenta no fim as colunas que ainda não existem.
    var header = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    var faltam = COLS.filter(function(c){ return header.indexOf(c) === -1; });
    if (faltam.length) {
      sh.getRange(1, header.length + 1, 1, faltam.length).setValues([faltam]);
      header = header.concat(faltam);
    }

    var recebido = Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm:ss');

    // Monta a linha NA ORDEM DO CABEÇALHO REAL — nunca na ordem de COLS.
    var row = header.map(function(col) {
      if (col === 'recebido_em' || col === 'data_hora' || col === 'data') return recebido;
      if (col === 'timestamp') return data.timestamp || '';
      return (data[col] !== undefined && data[col] !== null) ? data[col] : '';
    });

    sh.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Health check: abrir a URL /exec no navegador tem que mostrar este JSON.
// Se mostrar "Página não encontrada", a implantação está morta.
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, msg: 'Thermolux lead endpoint ativo.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
