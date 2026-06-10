import { writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const project = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const clean = (html) => `${html.replace(/[ \t]+$/gm, "").trim()}\n`;

const navGroups = [
  ["Marca", [
    ["guidelines", "Guidelines"],
    ["brand-strategy", "Estratégia"],
    ["voice", "Voz e mensagens"],
    ["logo-usage", "Logo e aplicação"],
  ]],
  ["Fundamentos", [
    ["color-tokens", "Cores"],
    ["typography", "Tipografia"],
    ["spacing-layout", "Espaçamento e layout"],
    ["movimento", "Movimento"],
  ]],
  ["Produto", [
    ["tables", "Componentes e tabelas"],
    ["infraestrutura", "Infraestrutura"],
  ]],
];

const icon = (name) => {
  const paths = {
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>',
    copy: '<rect x="8" y="8" width="10" height="10" rx="2"/><path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"/>',
  };
  return `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
};

const copyButton = (value) =>
  `<button class="copy-button" type="button" data-copy="${value}">${icon("copy")}<span>Copiar</span></button>`;

function header(root, docs = true) {
  return `
  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
  <header class="site-header">
    ${docs ? `<button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-controls="docs-navigation" aria-label="Abrir navegação">${icon("menu")}</button>` : `<a class="menu-toggle" href="#sistema" aria-label="Explorar o brandbook">${icon("menu")}</a>`}
    <a class="brand-link" href="${root}" aria-label="Verifica Pix, página inicial">
      <img src="${root}assets/logo/verificapix-francy.png" alt="Verifica Pix">
    </a>
    <span class="header-divider" aria-hidden="true"></span>
    <span class="header-label">Brandbook &amp; Design System</span>
    <div class="header-actions">
      <a class="top-link" href="${root}guidelines/">Marca</a>
      <a class="top-link" href="${root}tables/">Produto</a>
      <a class="button button-primary" href="${root}logo-usage/">Baixar logos ${icon("arrow")}</a>
    </div>
  </header>`;
}

function sidebar(current) {
  return `<aside class="docs-sidebar" id="docs-navigation" aria-label="Navegação do brandbook">
    ${navGroups.map(([group, links]) => `
      <div class="nav-group">
        <p class="nav-group-title">${group}</p>
        <nav class="docs-nav">
          ${links.map(([slug, label]) => `<a href="../${slug}/"${slug === current ? ' aria-current="page"' : ""}><span class="nav-dot"></span>${label}</a>`).join("")}
        </nav>
      </div>`).join("")}
  </aside>`;
}

function footer(root) {
  return `<footer class="site-footer">
    <div class="footer-inner">
      <img src="${root}assets/logo/verificapix-francy-white.png" alt="Verifica Pix">
      <p>Brandbook digital, versão 2.0. Confirme sempre a liquidação na conta bancária recebedora.</p>
    </div>
  </footer>`;
}

function docPage({ slug, title, description, eyebrow, intro, content }) {
  const root = "../";
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${description}">
  <title>${title} | Verifica Pix</title>
  <link rel="icon" href="${root}assets/logo/verificapix-symbol.svg" type="image/svg+xml">
  <link rel="stylesheet" href="${root}assets/css/brandbook-pages.css">
</head>
<body>
  ${header(root)}
  <div class="docs-layout">
    ${sidebar(slug)}
    <main class="docs-main" id="conteudo">
      <article class="docs-content">
        <header class="page-intro reveal">
          <span class="eyebrow">${eyebrow}</span>
          <h1>${title}</h1>
          <p>${intro}</p>
        </header>
        ${content}
      </article>
    </main>
  </div>
  ${footer(root)}
  <script src="${root}assets/js/brandbook.js"></script>
</body>
</html>`;
}

const productWindow = `
<div class="product-window" aria-label="Exemplo da interface de análise Verifica Pix">
  <div class="product-bar"><i class="window-dot"></i><i class="window-dot"></i><i class="window-dot"></i><span>Análise VP-48291</span></div>
  <div class="analysis-layout">
    <aside class="analysis-nav"><strong>Verifica Pix</strong><ul><li class="active">Análises</li><li>Comprovantes</li><li>Equipe</li><li>Regras</li></ul></aside>
    <div class="analysis-content">
      <div class="analysis-head"><div><h3>Comprovante recebido</h3><p>Hoje, 14:32 · Caixa 02</p></div><span class="status status-attention">Atenção</span></div>
      <div class="evidence-list">
        <div class="evidence-row"><span class="evidence-label">Valor informado</span><span class="evidence-value">R$ 1.249,90</span><span class="status status-low">Compatível</span></div>
        <div class="evidence-row"><span class="evidence-label">Beneficiário</span><span class="evidence-value">Loja Exemplo Ltda.</span><span class="status status-low">Compatível</span></div>
        <div class="evidence-row"><span class="evidence-label">Identificador</span><span class="evidence-value">E18236120...</span><span class="status status-attention">Revisar</span></div>
        <div class="evidence-row"><span class="evidence-label">Próxima ação</span><span class="evidence-value">Confirmar no banco recebedor</span><span class="status status-neutral">Manual</span></div>
      </div>
    </div>
  </div>
</div>`;

const pages = [
  {
    slug: "guidelines",
    title: "A marca que protege a decisão.",
    description: "Essência, missão, valores e princípios da marca Verifica Pix.",
    eyebrow: "Fundação da marca",
    intro: "Verifica Pix existe para transformar um momento de dúvida operacional em uma decisão mais clara, sem prometer o que uma análise de comprovante não pode garantir.",
    content: `
      <section class="doc-section reveal"><div class="section-heading"><h2>Essência</h2><p>Confiança não nasce de uma cor verde ou de um selo. Nasce de evidências organizadas, linguagem honesta e um próximo passo compreensível.</p></div>
        <blockquote class="quote">Antes de liberar o produto, verifique o Pix.<cite>Ideia central da marca</cite></blockquote>
      </section>
      <section class="doc-section reveal"><div class="section-heading"><h2>Missão e visão</h2><p>O propósito combina utilidade imediata no caixa com visibilidade operacional para quem administra o negócio.</p></div>
        <div class="split"><div class="surface"><h3>Missão</h3><p>Ajudar comerciantes a analisar comprovantes Pix com mais clareza antes de liberar produtos.</p></div><div class="surface surface-dark"><h3>Visão</h3><p>Ser a camada de confiança operacional mais simples entre o comprovante e a entrega.</p></div></div>
      </section>
      <section class="doc-section reveal"><div class="section-heading"><h2>Princípios</h2><p>Decisões de produto, design e comunicação devem passar por estes critérios.</p></div>
        <ol class="principle-list"><li><span class="principle-number">01</span><div><h3>Clareza antes de autoridade</h3><p>Explicar o que foi encontrado é mais importante do que parecer definitivo.</p></div></li><li><span class="principle-number">02</span><div><h3>Próxima ação visível</h3><p>Toda análise termina dizendo o que a pessoa deve fazer agora.</p></div></li><li><span class="principle-number">03</span><div><h3>Proteção sem medo</h3><p>A marca alerta com firmeza, sem explorar ansiedade ou culpar o operador.</p></div></li><li><span class="principle-number">04</span><div><h3>Limites explícitos</h3><p>O comprovante é uma evidência. A liquidação final pertence ao banco recebedor.</p></div></li></ol>
      </section>`
  },
  {
    slug: "brand-strategy",
    title: "Confiança antes da entrega.",
    description: "Posicionamento, ICP, problema e proposta de valor do Verifica Pix.",
    eyebrow: "Estratégia",
    intro: "A marca ocupa o intervalo crítico entre o recebimento de uma imagem de comprovante e a liberação do produto.",
    content: `
      <section class="doc-section reveal"><div class="section-heading"><h2>A tese central</h2><p>O problema não é apenas um comprovante falso. É uma operação que obriga alguém a decidir com pouco contexto e sem um processo comum.</p></div>
        <div class="surface surface-dark"><h3>A Brecha do Caixa Cego</h3><p>Funcionário pressionado, dono distante, fila andando e evidências dispersas. Verifica Pix organiza esse momento para que a decisão não dependa apenas do olhar individual.</p></div>
      </section>
      <section class="doc-section reveal"><div class="section-heading"><h2>ICP prioritário</h2><p>O cliente principal é um comerciante que delega o caixa, mas continua responsável pelo risco.</p></div>
        <div class="split"><div><h3>Carlos, o dono às cegas</h3><p>Tem entre 30 e 55 anos, acompanha a loja à distância e descobre problemas depois que o produto já saiu.</p></div><ul class="rule-list"><li>Recebe Pix diariamente</li><li>Tem funcionários no atendimento</li><li>Não consegue confirmar toda transação</li><li>Valoriza processo simples e rastreável</li></ul></div>
      </section>
      <section class="doc-section reveal"><div class="section-heading"><h2>Proposta de valor</h2><p>A promessa é apoio operacional, não uma garantia bancária.</p></div>
        <div class="comparison"><div class="comparison-column comparison-good"><span class="label"><i class="label-dot"></i>Dizemos</span><h3>Você não fica sozinho na decisão.</h3><p>Organizamos sinais, inconsistências e próximos passos.</p></div><div class="comparison-column comparison-bad"><span class="label"><i class="label-dot"></i>Não dizemos</span><h3>Seu Pix está 100% seguro.</h3><p>Nenhuma análise visual substitui a confirmação de liquidação.</p></div></div>
      </section>`
  },
  {
    slug: "voice",
    title: "Clara quando tudo parece incerto.",
    description: "Tom de voz, mensagens de análise e microcopy do Verifica Pix.",
    eyebrow: "Voz e mensagens",
    intro: "A voz Verifica Pix reduz a carga mental. Primeiro mostra a ação, depois explica a evidência e sempre reconhece os limites.",
    content: `
      <section class="doc-section reveal"><div class="section-heading"><h2>Seis atributos</h2><p>A combinação deve soar humana e operacional, nunca burocrática ou alarmista.</p></div>
        <ol class="principle-list"><li><span class="principle-number">01</span><div><h3>Direta</h3><p>Frases curtas, verbos ativos e um pedido por vez.</p></div></li><li><span class="principle-number">02</span><div><h3>Calma</h3><p>Sem exclamações em alertas e sem palavras que ampliem o medo.</p></div></li><li><span class="principle-number">03</span><div><h3>Precisa</h3><p>Nomeia a evidência e separa fato, inferência e recomendação.</p></div></li></ol>
      </section>
      <section class="doc-section reveal"><div class="section-heading"><h2>Mensagens de análise</h2><p>Os estados usam “risco aparente” porque o sistema examina evidências disponíveis, não o extrato final.</p></div>
        <div class="stack"><div class="surface"><span class="status status-low">Baixo risco aparente</span><h3>Nenhuma inconsistência relevante foi encontrada.</h3><p>Antes de liberar o produto, confirme o crédito na conta recebedora.</p></div><div class="surface"><span class="status status-attention">Atenção</span><h3>Alguns dados precisam de revisão.</h3><p>Compare o beneficiário e o identificador com a transação no banco.</p></div><div class="surface"><span class="status status-high">Alto risco aparente</span><h3>Foram encontradas inconsistências relevantes.</h3><p>Não libere o produto sem uma confirmação adicional.</p></div></div>
      </section>
      <section class="doc-section reveal"><div class="section-heading"><h2>Usamos e evitamos</h2><p>O vocabulário deve proteger a decisão sem criar uma certeza artificial.</p></div>
        <div class="comparison"><div class="comparison-column comparison-good"><span class="label"><i class="label-dot"></i>Use</span><ul class="rule-list"><li>“Encontramos uma inconsistência.”</li><li>“Confirme na conta recebedora.”</li><li>“Revise estes dados antes de continuar.”</li></ul></div><div class="comparison-column comparison-bad"><span class="label"><i class="label-dot"></i>Evite</span><ul class="rule-list"><li>“Fraude confirmada.”</li><li>“Pagamento 100% seguro.”</li><li>“Você caiu em um golpe.”</li></ul></div></div>
      </section>`
  },
  {
    slug: "logo-usage",
    title: "Um V que verifica.",
    description: "Arquivos finais, versões e regras de uso da logo Verifica Pix.",
    eyebrow: "Logo e aplicação",
    intro: "A versão final preserva o V aberto da locomarca e a assinatura tipográfica Francy. O símbolo representa verificação em curso, não uma promessa absoluta.",
    content: `
      <section class="doc-section reveal"><div class="section-heading"><h2>Assinatura principal</h2><p>Use a versão Francy recuperada para comunicação institucional. O arquivo PNG preserva o desenho original mesmo quando a fonte não está instalada.</p></div>
        <div class="logo-stage"><img src="../assets/logo/verificapix-francy.png" alt="Logo principal Verifica Pix com símbolo em V e tipografia Francy"></div>
        <div class="callout" style="margin-top:1.25rem">${icon("info")}<p><strong>Arquivo recomendado:</strong> <code>verificapix-francy.png</code>. Para interfaces compactas, use o símbolo SVG.</p></div>
      </section>
      <section class="doc-section reveal"><div class="section-heading"><h2>Família de marca</h2><p>As versões garantem legibilidade em fundos claros, escuros e aplicações de uma cor.</p></div>
        <div class="logo-symbol-grid"><div class="symbol-tile"><img src="../assets/logo/verificapix-symbol.svg" alt="Símbolo verde"></div><div class="symbol-tile navy"><img src="../assets/logo/verificapix-symbol-white.svg" alt="Símbolo branco em fundo navy"></div><div class="symbol-tile green"><img src="../assets/logo/verificapix-symbol-white.svg" alt="Símbolo branco em fundo verde"></div></div>
        <div class="table-wrap" style="margin-top:1.25rem"><table class="data-table"><thead><tr><th>Arquivo</th><th>Uso</th></tr></thead><tbody><tr><td><code>verificapix-francy.png</code></td><td>Assinatura institucional em fundo claro</td></tr><tr><td><code>verificapix-francy-white.png</code></td><td>Assinatura monocromática em fundo escuro</td></tr><tr><td><code>verificapix-symbol.svg</code></td><td>Avatar, favicon e controles compactos</td></tr><tr><td><code>verificapix-horizontal.svg</code></td><td>Implementações vetoriais com Francy instalada</td></tr></tbody></table></div>
      </section>
      <section class="doc-section reveal"><div class="section-heading"><h2>Proteção do desenho</h2><p>A área livre mínima equivale à largura do traço principal do V. O símbolo nunca deve ser fechado, inclinado ou separado da sua caixa aberta.</p></div>
        <div class="comparison"><div class="comparison-column comparison-good"><span class="label"><i class="label-dot"></i>Correto</span><ul class="rule-list"><li>Preservar proporção e cores</li><li>Usar fundo com contraste</li><li>Manter o V aberto completo</li></ul></div><div class="comparison-column comparison-bad"><span class="label"><i class="label-dot"></i>Incorreto</span><ul class="rule-list"><li>Adicionar sombras ou gradientes</li><li>Recompor o nome com outra fonte</li><li>Transformar o V em um selo de aprovação</li></ul></div></div>
      </section>`
  },
  {
    slug: "color-tokens",
    title: "Cor com função.",
    description: "Paleta, tokens semânticos e orientações de contraste Verifica Pix.",
    eyebrow: "Fundamento visual",
    intro: "Green conduz progresso e verificação. Navy estrutura a experiência. Estados de risco têm cores próprias, sempre acompanhadas por texto.",
    content: `
      <section class="doc-section reveal"><div class="section-heading"><h2>Paleta principal</h2><p>Os tokens usam OKLCH para manter relações mais previsíveis de luminosidade e saturação.</p></div>
        <div class="table-wrap"><table class="token-table"><thead><tr><th>Cor</th><th>Token</th><th>Valor</th><th>Ação</th></tr></thead><tbody>
        <tr><td><div class="swatch" style="background:var(--vp-green-600)"></div></td><td class="token-name">--vp-green-600</td><td><code>oklch(0.60 0.15 145)</code></td><td>${copyButton("oklch(0.60 0.15 145)")}</td></tr>
        <tr><td><div class="swatch" style="background:var(--vp-green-700)"></div></td><td class="token-name">--vp-green-700</td><td><code>oklch(0.49 0.12 145)</code></td><td>${copyButton("oklch(0.49 0.12 145)")}</td></tr>
        <tr><td><div class="swatch" style="background:var(--vp-navy-900)"></div></td><td class="token-name">--vp-navy-900</td><td><code>oklch(0.29 0.065 250)</code></td><td>${copyButton("oklch(0.29 0.065 250)")}</td></tr>
        <tr><td><div class="swatch" style="background:var(--vp-paper)"></div></td><td class="token-name">--vp-paper</td><td><code>oklch(0.985 0.006 145)</code></td><td>${copyButton("oklch(0.985 0.006 145)")}</td></tr>
        </tbody></table></div>
      </section>
      <section class="doc-section reveal"><div class="section-heading"><h2>Semântica</h2><p>A mesma cor pode ter significados diferentes em outras marcas. Aqui, cada função é deliberada.</p></div>
        <div class="split"><div class="surface"><span class="status status-low">Baixo risco aparente</span><h3>Verde</h3><p>Progresso, compatibilidade e ação concluída. Nunca prova liquidação.</p></div><div class="surface"><span class="status status-attention">Atenção</span><h3>Âmbar</h3><p>Revisão manual, evidência incompleta ou dado que merece contexto.</p></div><div class="surface"><span class="status status-high">Alto risco aparente</span><h3>Vermelho</h3><p>Inconsistência relevante e necessidade de interromper a entrega.</p></div><div class="surface"><span class="status status-neutral">Informativo</span><h3>Navy</h3><p>Estrutura, informação operacional e estados sem risco.</p></div></div>
      </section>
      <section class="doc-section reveal"><div class="section-heading"><h2>Contraste</h2><p>Não publique índices fixos sem testar a combinação final, incluindo peso e tamanho da fonte.</p></div><div class="callout">${icon("info")}<p>Meta: WCAG 2.2 AA, 4.5:1 para texto comum e 3:1 para texto grande e elementos gráficos essenciais.</p></div></section>`
  },
  {
    slug: "typography",
    title: "Francy dá a assinatura.",
    description: "Famílias, escala e hierarquia tipográfica Verifica Pix.",
    eyebrow: "Fundamento visual",
    intro: "Francy carrega reconhecimento de marca. Sora sustenta a presença digital quando os arquivos licenciados não estão disponíveis. Plus Jakarta Sans organiza a interface.",
    content: `
      <section class="doc-section reveal"><div class="section-heading"><h2>Famílias</h2><p>A tipografia muda conforme a função, mas preserva uma voz robusta, clara e geométrica.</p></div>
        <div class="stack"><div class="surface"><span class="label">Marca e display</span><p class="type-display">Verifica</p><p>Francy, com Sora como fallback público.</p></div><div class="surface"><span class="label">Interface e leitura</span><h3 style="font-family:var(--font-body);font-size:2.4rem">Decisão clara, mesmo sob pressão.</h3><p>Plus Jakarta Sans em textos, controles e dados.</p></div><div class="surface"><span class="label">Dados técnicos</span><p style="font:600 1.25rem var(--font-mono)">E18236120A202606101432</p><p>Roboto Mono apenas em tokens, IDs e código.</p></div></div>
      </section>
      <section class="doc-section reveal"><div class="section-heading"><h2>Escala fluida</h2><p>Os títulos crescem com a tela sem comprometer leitura em dispositivos pequenos.</p></div>
        <div class="table-wrap"><table class="token-table"><thead><tr><th>Uso</th><th>Token</th><th>Escala</th></tr></thead><tbody><tr><td>Hero</td><td><code>--text-hero</code></td><td><code>clamp(3.3rem, 7.4vw, 7rem)</code></td></tr><tr><td>Título de página</td><td><code>--text-4xl</code></td><td><code>clamp(2.5rem, 5vw, 4.8rem)</code></td></tr><tr><td>Título de seção</td><td><code>--text-3xl</code></td><td><code>clamp(1.9rem, 3vw, 3rem)</code></td></tr><tr><td>Corpo</td><td><code>--text-base</code></td><td><code>1rem</code></td></tr></tbody></table></div>
      </section>
      <section class="doc-section reveal"><div class="section-heading"><h2>Regras de composição</h2><p>Hierarquia forte não depende de usar muitas fontes ou pesos.</p></div><ul class="principle-list"><li><span class="principle-number">01</span><div><h3>Limite de 72 caracteres</h3><p>Textos longos devem permanecer confortáveis para leitura contínua.</p></div></li><li><span class="principle-number">02</span><div><h3>Contraste de escala</h3><p>Cada nível precisa ser claramente diferente do anterior.</p></div></li><li><span class="principle-number">03</span><div><h3>Caixa alta com moderação</h3><p>Reserve para rótulos curtos, nunca para parágrafos.</p></div></li></ul></section>`
  },
  {
    slug: "spacing-layout",
    title: "Ritmo para decidir rápido.",
    description: "Escala de espaçamento, grids e breakpoints Verifica Pix.",
    eyebrow: "Fundamento visual",
    intro: "A base de 4px cria consistência. O ritmo varia de propósito: interfaces operacionais são densas, narrativas de marca respiram.",
    content: `
      <section class="doc-section reveal"><div class="section-heading"><h2>Escala</h2><p>Prefira os tokens do sistema a valores arbitrários.</p></div>
        <div class="spacing-demo">${[[1,4],[2,8],[3,12],[4,16],[6,24],[8,32],[12,48],[16,64]].map(([n,px])=>`<div class="spacing-row"><code>space-${n}</code><span class="spacing-bar" style="width:min(100%,${px*5}px)"></span><span>${px}px</span></div>`).join("")}</div>
      </section>
      <section class="doc-section reveal"><div class="section-heading"><h2>Grid e conteúdo</h2><p>O site usa uma estrutura de 12 colunas; a documentação combina navegação persistente e coluna de leitura.</p></div>
        <div class="split"><div class="surface"><h3>Marketing</h3><p>Máximo de 1380px, composição assimétrica e demonstração de produto dominante.</p></div><div class="surface"><h3>Documentação</h3><p>Sidebar de 252px, conteúdo máximo de 1000px e parágrafos até 72 caracteres.</p></div></div>
      </section>
      <section class="doc-section reveal"><div class="section-heading"><h2>Breakpoints</h2><p>A experiência adapta estrutura, não apenas tamanho.</p></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Largura</th><th>Comportamento</th></tr></thead><tbody><tr><td>375px</td><td>Uma coluna, menu em drawer, ações com largura total</td></tr><tr><td>768px</td><td>Comparações em duas colunas quando houver espaço</td></tr><tr><td>1024px</td><td>Sidebar persistente e produto completo</td></tr><tr><td>1440px</td><td>Ritmo amplo e largura máxima controlada</td></tr></tbody></table></div></section>`
  },
  {
    slug: "movimento",
    title: "Movimento que explica.",
    description: "Princípios, durações e acessibilidade de motion Verifica Pix.",
    eyebrow: "Fundamento visual",
    intro: "A animação serve para orientar atenção e confirmar mudança de estado. Alertas de risco não pulsam, não saltam e não celebram.",
    content: `
      <section class="doc-section reveal"><div class="section-heading"><h2>Princípios</h2><p>Movimento é parte da linguagem operacional e deve permanecer discreto.</p></div><ol class="principle-list"><li><span class="principle-number">01</span><div><h3>Explicar continuidade</h3><p>Use transição quando um elemento muda de estado ou localização.</p></div></li><li><span class="principle-number">02</span><div><h3>Preservar estabilidade</h3><p>Anime opacidade e transform, evitando mudanças que recalculam layout.</p></div></li><li><span class="principle-number">03</span><div><h3>Respeitar contexto</h3><p>Reduza movimento em cenários de risco e para quem solicitar.</p></div></li></ol></section>
      <section class="doc-section reveal"><div class="section-heading"><h2>Tokens</h2><p>Duas durações cobrem a maior parte do sistema.</p></div><div class="table-wrap"><table class="token-table"><thead><tr><th>Token</th><th>Valor</th><th>Uso</th></tr></thead><tbody><tr><td><code>--duration-fast</code></td><td>180ms</td><td>Hover, foco, botão e badge</td></tr><tr><td><code>--duration-base</code></td><td>420ms</td><td>Entrada de seção e navegação móvel</td></tr><tr><td><code>--ease-out</code></td><td><code>cubic-bezier(0.16,1,0.3,1)</code></td><td>Desaceleração natural</td></tr></tbody></table></div></section>
      <section class="doc-section reveal"><div class="section-heading"><h2>Acessibilidade</h2><p>O conteúdo nunca depende da animação para ser compreendido.</p></div><div class="callout">${icon("info")}<p>Com <code>prefers-reduced-motion: reduce</code>, durações são praticamente zeradas e a rolagem suave é desativada.</p></div></section>`
  },
  {
    slug: "tables",
    title: "Componentes para evidências.",
    description: "Componentes, estados, botões e tabelas do produto Verifica Pix.",
    eyebrow: "Interface de produto",
    intro: "O sistema de componentes foi desenhado para tornar evidências comparáveis e o próximo passo inequívoco.",
    content: `
      <section class="doc-section reveal"><div class="section-heading"><h2>Análise de comprovante</h2><p>A interface separa o dado observado, o valor encontrado e a interpretação do sistema.</p></div>${productWindow}</section>
      <section class="doc-section reveal"><div class="section-heading"><h2>Estados</h2><p>Todo status combina cor, indicador e texto explícito.</p></div><div class="surface"><div style="display:flex;flex-wrap:wrap;gap:1rem"><span class="status status-low">Baixo risco aparente</span><span class="status status-attention">Atenção</span><span class="status status-high">Alto risco aparente</span><span class="status status-neutral">Informativo</span></div></div></section>
      <section class="doc-section reveal"><div class="section-heading"><h2>Tabela operacional</h2><p>Linhas são legíveis, cabeçalhos persistem semanticamente e a tabela pode rolar em telas pequenas.</p></div><div class="table-wrap"><table class="data-table"><thead><tr><th scope="col">Análise</th><th scope="col">Valor</th><th scope="col">Operador</th><th scope="col">Status</th></tr></thead><tbody><tr><td>VP-48291</td><td>R$ 1.249,90</td><td>Caixa 02</td><td><span class="status status-attention">Atenção</span></td></tr><tr><td>VP-48290</td><td>R$ 89,00</td><td>Caixa 01</td><td><span class="status status-low">Baixo risco</span></td></tr><tr><td>VP-48289</td><td>R$ 3.599,00</td><td>Caixa 03</td><td><span class="status status-high">Alto risco</span></td></tr></tbody></table></div></section>
      <section class="doc-section reveal"><div class="section-heading"><h2>Ações</h2><p>Verbos descrevem o resultado. A ação principal deve ser única por contexto.</p></div><div class="surface" style="display:flex;flex-wrap:wrap;gap:1rem"><button class="button button-primary">Confirmar revisão</button><button class="button button-secondary">Ver evidências</button></div></section>`
  },
  {
    slug: "infraestrutura",
    title: "Uma base pronta para crescer.",
    description: "Domínios, publicação e arquitetura de presença digital Verifica Pix.",
    eyebrow: "Operação digital",
    intro: "A infraestrutura começa simples, com arquivos estáticos e GitHub Pages, e preserva um caminho claro para produto, API e ambientes futuros.",
    content: `
      <section class="doc-section reveal"><div class="section-heading"><h2>Domínio principal</h2><p><strong>verificapix.org</strong> é o ativo institucional. Variações defensivas devem redirecionar para a propriedade principal.</p></div><div class="surface surface-dark"><h3>Arquitetura recomendada</h3><p><code>verificapix.org</code> para apresentação, <code>app.verificapix.org</code> para produto e <code>docs.verificapix.org</code> para documentação técnica futura.</p></div></section>
      <section class="doc-section reveal"><div class="section-heading"><h2>Publicação atual</h2><p>O brandbook é um site estático versionado, rápido e sem dependências de runtime.</p></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Camada</th><th>Implementação</th></tr></thead><tbody><tr><td>Repositório</td><td>GitHub · Triadeia/verificapix</td></tr><tr><td>Hospedagem</td><td>GitHub Pages</td></tr><tr><td>Frontend</td><td>HTML, CSS e JavaScript sem framework</td></tr><tr><td>Assets</td><td>SVG e PNG otimizados, fontes web públicas</td></tr></tbody></table></div></section>
      <section class="doc-section reveal"><div class="section-heading"><h2>Evolução</h2><p>Cada fase adiciona capacidade sem descartar o sistema visual.</p></div><ol class="principle-list"><li><span class="principle-number">01</span><div><h3>Brandbook estático</h3><p>Fonte única de identidade, conteúdo e componentes.</p></div></li><li><span class="principle-number">02</span><div><h3>Produto autenticado</h3><p>Aplicação em subdomínio, reutilizando tokens e padrões.</p></div></li><li><span class="principle-number">03</span><div><h3>Serviços e integrações</h3><p>API isolada, observabilidade e políticas de dados documentadas.</p></div></li></ol></section>`
  },
];

function homePage() {
  const systemLinks = [
    ["01", "Guidelines", "Essência, missão e princípios", "guidelines"],
    ["02", "Estratégia", "ICP, problema e proposta de valor", "brand-strategy"],
    ["03", "Voz", "Mensagens de análise e microcopy", "voice"],
    ["04", "Logo", "Assinatura Francy e V da locomarca", "logo-usage"],
    ["05", "Cores", "Tokens e semântica de risco", "color-tokens"],
    ["06", "Tipografia", "Hierarquia e famílias", "typography"],
    ["07", "Layout", "Espaçamento e responsividade", "spacing-layout"],
    ["08", "Componentes", "Interface real do produto", "tables"],
  ];
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Brandbook e Design System do Verifica Pix. Marca, produto, componentes e padrões para decisões mais seguras antes da entrega.">
  <title>Verifica Pix | Brandbook &amp; Design System</title>
  <link rel="icon" href="assets/logo/verificapix-symbol.svg" type="image/svg+xml">
  <link rel="stylesheet" href="assets/css/brandbook-pages.css">
</head>
<body class="home-body">
  ${header("", false)}
  <main class="home-main" id="conteudo">
    <section class="home-hero">
      <div class="hero-grid">
        <div class="hero-copy reveal"><span class="eyebrow">Brandbook digital 2.0</span><h1>Veja antes de <span>liberar.</span></h1><p>Um sistema de marca e produto para transformar comprovantes Pix em decisões operacionais mais claras.</p><div class="hero-actions"><a class="button button-primary" href="guidelines/">Explorar o brandbook ${icon("arrow")}</a><a class="button button-secondary" href="tables/">Ver a interface</a></div><p class="hero-note">Análise de evidências. Confirmação final sempre na conta recebedora.</p></div>
        <div class="hero-product reveal">${productWindow}</div>
      </div>
    </section>
    <section class="proof-strip"><div class="proof-inner"><p>Uma linguagem comum para toda a operação</p><div class="proof-roles"><span>Donos</span><span>Caixas</span><span>Operações</span><span>Produto</span><span>Parceiros</span></div></div></section>
    <section class="home-section"><div class="home-section-inner"><div class="home-section-heading reveal"><h2>Da dúvida ao próximo passo.</h2><p>O Verifica Pix não tenta parecer um banco. Ele organiza o que está visível, mostra o que merece atenção e orienta uma confirmação responsável.</p></div>
      <div class="story-steps"><article class="story-step reveal"><span>01</span><h3>Receba a evidência</h3><p>O comprovante chega ao caixa e entra em um fluxo comum, sem depender apenas da experiência de uma pessoa.</p></article><article class="story-step reveal"><span>02</span><h3>Compare os sinais</h3><p>Valor, beneficiário, identificador, horário e coerência visual ficam organizados para revisão.</p></article><article class="story-step reveal"><span>03</span><h3>Decida com contexto</h3><p>O sistema comunica risco aparente e indica a próxima ação, incluindo a confirmação no banco recebedor.</p></article></div>
    </div></section>
    <section class="home-section" id="sistema" style="background:var(--vp-surface)"><div class="home-section-inner"><div class="home-section-heading reveal"><h2>Uma marca pronta para produto.</h2><p>O brandbook conecta estratégia, linguagem e componentes. Cada regra mostra como a identidade funciona em situações reais.</p></div><div class="system-index reveal">${systemLinks.map(([n,t,d,s])=>`<a class="system-link" href="${s}/"><span>${n}</span><strong>${t}</strong><p>${d}</p></a>`).join("")}</div></div></section>
    <section class="home-section"><div class="home-section-inner"><div class="home-section-heading reveal"><h2>O produto é a principal imagem da marca.</h2><p>Em vez de promessas abstratas, mostramos a interface, os critérios e os limites que sustentam a confiança.</p></div><div class="split"><div class="receipt reveal"><strong>COMPROVANTE PIX</strong><hr class="receipt-rule"><div class="receipt-row"><span>Valor</span><strong>R$ 1.249,90</strong></div><div class="receipt-row"><span>Data</span><span>10/06/2026 14:32</span></div><div class="receipt-row"><span>Beneficiário</span><span>Loja Exemplo Ltda.</span></div><hr class="receipt-rule"><span class="status status-attention">Revisão necessária</span></div><div class="surface surface-dark reveal"><span class="label" style="color:var(--vp-green-200)">Resultado</span><h2 style="font-size:var(--text-3xl)">Um sinal claro. Uma ação responsável.</h2><p>O identificador precisa ser comparado com a transação na conta recebedora antes de liberar o produto.</p><a class="button button-primary" href="voice/">Conhecer a linguagem ${icon("arrow")}</a></div></div></div></section>
    <section class="home-section cta-section"><div class="home-section-inner"><div class="home-section-heading reveal"><h2>Antes de liberar, verifique.</h2><div><p>Use este sistema como fonte oficial para marca, produto, conteúdo e implementação.</p><a class="button button-primary" href="logo-usage/">Acessar arquivos da marca ${icon("arrow")}</a></div></div></div></section>
  </main>
  ${footer("")}
  <script src="assets/js/brandbook.js"></script>
</body>
</html>`;
}

await writeFile(resolve(project, "index.html"), clean(homePage()));
await Promise.all(pages.map((page) => writeFile(resolve(project, page.slug, "index.html"), clean(docPage(page)))));
console.log(`Built ${pages.length + 1} HTML pages.`);
