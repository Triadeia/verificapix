import { mkdir, writeFile } from "node:fs/promises";
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
    ["components", "Componentes"],
    ["tables", "Tabelas"],
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

function docPage({ slug, title, description, eyebrow, intro, content }, nested = false) {
  const root = nested ? "../../" : "../";
  const resolvedContent = nested
    ? content.replaceAll('src="../assets/', 'src="../../assets/')
    : content;
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${description}">
  <title>${title} | Verifica Pix</title>
  <link rel="icon" href="${root}assets/logo/verificapix-symbol.svg" type="image/svg+xml">
  <link rel="stylesheet" href="${root}assets/css/brandbook.css">
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
        ${resolvedContent}
      </article>
    </main>
  </div>
  ${footer(root)}
  <script src="${root}assets/js/main.js"></script>
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
    slug: "components",
    title: "Um sistema para decidir com clareza.",
    description: "Biblioteca de componentes e estados operacionais do Verifica Pix.",
    eyebrow: "Biblioteca de produto",
    intro: "Cada componente reduz ambiguidade entre evidência, interpretação e próxima ação. Cor reforça o significado, mas nunca trabalha sozinha.",
    content: `
      <section class="doc-section reveal"><div class="section-heading"><h2>Ações e controles</h2><p>O CTA principal descreve o resultado esperado. Controles secundários preservam contexto e nunca competem visualmente.</p></div>
        <div class="component-showcase"><button class="button button-primary" type="button">Iniciar validação</button><button class="button button-secondary" type="button">Ver evidências</button><button class="button button-quiet" type="button">Cancelar</button><label class="field"><span>Identificador da transação</span><input type="text" value="E18236120..." aria-describedby="component-field-help"><small id="component-field-help">Use o identificador apresentado no comprovante.</small></label></div>
      </section>
      <section class="doc-section reveal"><div class="section-heading"><h2>Estados operacionais</h2><p>Os estados cobrem análise concluída, evidência suspeita, resultado inconclusivo, processamento e falha técnica.</p></div>
        <div class="status-grid"><article><span class="status status-low">Compatível</span><h3>Sem divergência relevante</h3><p>Confirme a liquidação na conta recebedora.</p></article><article><span class="status status-high">Suspeito</span><h3>Inconsistência relevante</h3><p>Interrompa a entrega e faça uma confirmação adicional.</p></article><article><span class="status status-inconclusive">Inconclusivo</span><h3>Evidência insuficiente</h3><p>Solicite uma imagem legível ou consulte outro canal.</p></article><article><span class="status status-processing">Processando</span><h3>Análise em andamento</h3><p>Mantenha a entrega em espera.</p></article><article><span class="status status-error">Erro</span><h3>Não foi possível analisar</h3><p>Tente novamente sem descartar a verificação manual.</p></article></div>
      </section>
      <section class="doc-section reveal"><div class="section-heading"><h2>Cartões de evidência</h2><p>Informação observada, leitura do sistema e recomendação ficam visualmente separadas.</p></div>
        <div class="evidence-card-grid"><article class="evidence-card"><small>Valor informado</small><strong>R$ 1.249,90</strong><span class="status status-low">Compatível</span></article><article class="evidence-card"><small>Beneficiário</small><strong>Loja Exemplo Ltda.</strong><span class="status status-low">Compatível</span></article><article class="evidence-card"><small>Identificador</small><strong>E18236120...</strong><span class="status status-attention">Revisar</span></article></div>
      </section>
      <section class="doc-section reveal"><div class="section-heading"><h2>Princípios de implementação</h2><p>A biblioteca segue contratos simples para permanecer acessível e reutilizável.</p></div>
        <ul class="rule-list"><li>Foco visível em todos os controles interativos</li><li>Estados comunicados com texto, ícone e cor</li><li>Áreas de toque com pelo menos 44px</li><li>Movimento reduzido respeitado pelo sistema operacional</li><li>Mensagens sem garantia de liquidação bancária</li></ul>
      </section>`
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
  const capabilities = [
    ["Receber", "comprovantes"],
    ["Comparar", "evidências"],
    ["Classificar", "risco aparente"],
    ["Orientar", "a próxima ação"],
    ["Registrar", "a decisão"],
    ["Acompanhar", "a operação"],
  ];
  const useCases = [
    ["01", "Conferir beneficiário", "Compare o nome informado com o contexto da venda."],
    ["02", "Revisar identificador", "Encontre sinais que merecem confirmação adicional."],
    ["03", "Checar valor e horário", "Organize dados básicos antes de liberar o produto."],
    ["04", "Padronizar o caixa", "Dê à equipe um processo comum para seguir."],
    ["05", "Acionar o responsável", "Leve casos de atenção para quem pode decidir."],
    ["06", "Registrar a análise", "Mantenha o histórico do que foi visto e decidido."],
  ];
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Verifica Pix organiza evidências de comprovantes Pix e orienta uma decisão mais clara antes de liberar o produto.">
  <title>Verifica Pix | Antes de liberar, verifique</title>
  <link rel="icon" href="assets/logo/verificapix-symbol.svg" type="image/svg+xml">
  <link rel="stylesheet" href="assets/css/brandbook.css">
</head>
<body class="landing-body">
  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
  <header class="marketing-header">
    <a class="marketing-brand" href="#" aria-label="Verifica Pix, início"><img src="assets/logo/verificapix-francy-white.png" alt="Verifica Pix"></a>
    <nav class="marketing-nav" aria-label="Navegação principal">
      <a href="#como-funciona">Como funciona</a>
      <a href="#analise">Análise</a>
      <a href="#operacao">Operação</a>
      <a href="#faq">Dúvidas</a>
      <a href="guidelines/">Brandbook</a>
    </nav>
    <a class="marketing-cta" href="#como-funciona">Conhecer o Verifica Pix ${icon("arrow")}</a>
    <a class="marketing-menu" href="#como-funciona" aria-label="Ir para como funciona">${icon("menu")}</a>
  </header>
  <main class="landing-main" id="conteudo">
    <section class="landing-hero">
      <div class="landing-hero-grid">
        <div class="landing-hero-copy reveal">
          <span class="landing-kicker">Validação de Lastro direto pelo WhatsApp</span>
          <h1>Saia da Ilusão de Comprovante. Decida com <span>contexto.</span></h1>
          <p>Envie o comprovante pelo WhatsApp, organize evidências e oriente a equipe antes de liberar o produto.</p>
          <div class="landing-actions"><a class="landing-button landing-button-green" href="#como-funciona">Ver como funciona ${icon("arrow")}</a><a class="landing-button landing-button-ghost" href="tables/">Explorar a interface</a></div>
          <div class="landing-steps"><span>Receba a evidência</span><span>Compare os sinais</span><span>Registre a decisão</span></div>
        </div>
        <div class="phone-stage reveal" aria-label="Demonstração do fluxo de análise">
          <div class="phone-orbit orbit-one"></div><div class="phone-orbit orbit-two"></div>
          <div class="phone-frame">
            <div class="phone-top"><span>14:32</span><strong>Verifica Pix</strong><span>online</span></div>
            <div class="chat-day">Hoje</div>
            <div class="chat-bubble chat-user"><span>Comprovante recebido no Caixa 02</span><small>14:32</small></div>
            <div class="receipt-mini"><div><span>Valor</span><strong>R$ 1.249,90</strong></div><div><span>Beneficiário</span><strong>Loja Exemplo Ltda.</strong></div><div><span>ID</span><strong>E18236120...</strong></div></div>
            <div class="chat-bubble chat-system"><span class="status status-attention">Atenção</span><strong>O identificador precisa de revisão.</strong><p>Compare com a transação na conta recebedora antes de liberar.</p><small>14:32</small></div>
          </div>
          <div class="floating-signal signal-one"><span class="signal-dot low"></span><div><small>Beneficiário</small><strong>Compatível</strong></div></div>
          <div class="floating-signal signal-two"><span class="signal-dot attention"></span><div><small>Identificador</small><strong>Revisar</strong></div></div>
        </div>
      </div>
    </section>
    <section class="capability-ticker" aria-label="Capacidades do Verifica Pix"><div class="ticker-track">${[...capabilities,...capabilities].map(([verb,noun])=>`<span><strong>${verb}</strong> ${noun}<i></i></span>`).join("")}</div></section>

    <section class="landing-section feature-section" id="como-funciona">
      <div class="feature-grid">
        <div class="feature-copy reveal"><span class="section-tag">WhatsApp como porta de entrada</span><h2>Receba o comprovante e comece pelo que é visível.</h2><p>O Verifica Pix organiza as informações enviadas pelo WhatsApp em uma única análise. A equipe não precisa improvisar uma conferência diferente a cada atendimento.</p><ul class="check-list"><li>Valor, data e horário reunidos</li><li>Beneficiário apresentado com clareza</li><li>Identificador destacado para revisão</li></ul></div>
        <div class="upload-demo reveal"><div class="upload-head"><span>Nova análise</span><span class="status status-neutral">Caixa 02</span></div><div class="upload-drop"><img src="assets/logo/verificapix-symbol.svg" alt=""><strong>Comprovante recebido</strong><span>Imagem pronta para análise</span></div><div class="upload-progress"><span></span></div><div class="upload-meta"><div><small>Origem</small><strong>Atendimento presencial</strong></div><div><small>Responsável</small><strong>Marina</strong></div></div></div>
      </div>
    </section>

    <section class="landing-section feature-section feature-alt" id="analise">
      <div class="feature-grid feature-reverse">
        <div class="evidence-demo reveal"><div class="evidence-demo-head"><div><small>Análise VP-48291</small><strong>Evidências encontradas</strong></div><span class="status status-attention">Atenção</span></div><div class="evidence-check"><span class="signal-dot low"></span><div><strong>Valor</strong><small>Compatível com a venda</small></div><b>R$ 1.249,90</b></div><div class="evidence-check"><span class="signal-dot low"></span><div><strong>Beneficiário</strong><small>Nome esperado</small></div><b>Compatível</b></div><div class="evidence-check"><span class="signal-dot attention"></span><div><strong>Identificador</strong><small>Exige confirmação adicional</small></div><b>Revisar</b></div><div class="decision-footer"><span>Próxima ação</span><strong>Confirmar na conta recebedora</strong></div></div>
        <div class="feature-copy reveal"><span class="section-tag">Mecanismo: Validação de Lastro</span><h2>Compare sinais sem transformar hipótese em certeza.</h2><p>Cada evidência aparece separada da interpretação. Assim, o operador entende o que foi encontrado e por que uma ação adicional pode ser necessária.</p><ul class="check-list"><li>Estados com texto, não apenas cor</li><li>Inconsistências explicadas em linguagem direta</li><li>Limites técnicos sempre visíveis</li></ul></div>
      </div>
    </section>

    <section class="landing-statement"><div class="statement-inner reveal"><span>Decisão operacional</span><h2>Seu caixa sob controle, mesmo quando você não está lá.</h2><p>Um processo comum conecta quem atende, quem revisa e quem assume a decisão final.</p><a class="landing-button landing-button-light" href="#operacao">Ver a operação ${icon("arrow")}</a></div></section>

    <section class="risk-section">
      <div class="risk-inner">
        <div class="risk-heading reveal"><span class="section-tag section-tag-dark">Risco aparente</span><h2>Três estados. Nenhuma promessa absoluta.</h2><p>O resultado orienta a operação a partir das evidências disponíveis. A liquidação final continua sendo confirmada no banco recebedor.</p></div>
        <div class="risk-board reveal">
          <div class="risk-card risk-low"><span class="risk-index">01</span><span class="status status-low">Baixo risco aparente</span><h3>Nenhuma inconsistência relevante encontrada.</h3><p>Confirme o crédito antes de liberar.</p></div>
          <div class="risk-card risk-attention"><span class="risk-index">02</span><span class="status status-attention">Atenção</span><h3>Alguns dados precisam de revisão.</h3><p>Compare as evidências destacadas.</p></div>
          <div class="risk-card risk-high"><span class="risk-index">03</span><span class="status status-high">Alto risco aparente</span><h3>Há inconsistências relevantes.</h3><p>Interrompa a entrega e confirme por outro canal.</p></div>
        </div>
        <div class="audit-demo reveal"><div class="audit-side"><img src="assets/logo/verificapix-symbol-white.svg" alt=""><strong>Linha da análise</strong><small>VP-48291</small></div><ol><li class="done"><span>14:32</span><div><strong>Comprovante recebido</strong><small>Marina · Caixa 02</small></div></li><li class="done"><span>14:32</span><div><strong>Dados organizados</strong><small>Valor e beneficiário compatíveis</small></div></li><li class="attention"><span>14:33</span><div><strong>Revisão solicitada</strong><small>Identificador enviado ao responsável</small></div></li><li><span>Agora</span><div><strong>Aguardando decisão</strong><small>Confirmação na conta recebedora</small></div></li></ol></div>
      </div>
    </section>

    <section class="landing-section team-section" id="operacao">
      <div class="feature-grid">
        <div class="feature-copy reveal"><span class="section-tag">Operação conectada</span><h2>Todos seguem o mesmo processo. Cada pessoa vê o que precisa.</h2><p>O operador registra a análise. O responsável revisa os casos de atenção. O dono acompanha o histórico sem depender de mensagens dispersas.</p><a class="text-link" href="brand-strategy/">Conhecer o cliente ideal ${icon("arrow")}</a></div>
        <div class="team-demo reveal"><div class="team-rings"><span class="avatar avatar-owner">D</span><span class="avatar avatar-cashier">M</span><span class="avatar avatar-ops">O</span><i></i></div><div class="team-row"><span class="avatar avatar-cashier">M</span><div><strong>Marina enviou uma análise</strong><small>Caixa 02 · agora</small></div><span class="status status-attention">Atenção</span></div><div class="team-row"><span class="avatar avatar-owner">D</span><div><strong>Daniel assumiu a revisão</strong><small>Responsável · agora</small></div><span class="status status-neutral">Em análise</span></div><div class="team-row"><span class="avatar avatar-ops">O</span><div><strong>Operação registrou a decisão</strong><small>Histórico atualizado</small></div><span class="status status-low">Concluído</span></div></div>
      </div>
    </section>

    <section class="usecase-section">
      <div class="usecase-inner"><div class="usecase-heading reveal"><span class="section-tag">O seu jeito de operar</span><h2>Não existe uma única conferência. Existe um processo que não deixa sinais importantes para trás.</h2><p>Comece pela necessidade do atendimento e avance até uma decisão rastreável.</p></div><div class="usecase-grid reveal">${useCases.map(([n,t,d])=>`<article><span>${n}</span><h3>${t}</h3><p>${d}</p></article>`).join("")}</div></div>
    </section>

    <section class="workflow-section">
      <div class="workflow-inner">
        <div class="workflow-heading reveal"><span>Fluxo de verificação</span><h2>Do comprovante à decisão, sem perder o contexto no caminho.</h2></div>
        <div class="workflow-grid">
          <div class="workflow-demo reveal"><div class="workflow-column"><small>Recebido</small><article><span class="status status-neutral">Novo</span><strong>VP-48291</strong><p>R$ 1.249,90</p></article></div><div class="workflow-column"><small>Em revisão</small><article><span class="status status-attention">Atenção</span><strong>Identificador</strong><p>Confirmação necessária</p></article></div><div class="workflow-column"><small>Decidido</small><article><span class="status status-low">Registrado</span><strong>Entrega liberada</strong><p>Crédito confirmado</p></article></div></div>
          <div class="workflow-copy reveal"><h3>Uma visão para o momento. Outra para a gestão.</h3><p>No atendimento, a prioridade é saber o que fazer agora. Na gestão, importa entender volume, recorrência e onde o processo precisa melhorar.</p><ul class="check-list check-list-light"><li>Fila de análises pendentes</li><li>Responsável por cada decisão</li><li>Histórico de evidências e ações</li></ul></div>
        </div>
      </div>
    </section>

    <section class="landing-section source-section">
      <div class="source-heading reveal"><span class="section-tag">Fonte única</span><h2>Marca, linguagem e produto na mesma direção.</h2><p>O brandbook digital documenta como o Verifica Pix deve parecer, falar e se comportar em cada ponto da experiência.</p></div>
      <div class="source-links reveal"><a href="guidelines/"><span>01</span><strong>Marca</strong><p>Essência e princípios</p></a><a href="voice/"><span>02</span><strong>Voz</strong><p>Mensagens e limites</p></a><a href="color-tokens/"><span>03</span><strong>Design</strong><p>Tokens e fundamentos</p></a><a href="tables/"><span>04</span><strong>Produto</strong><p>Componentes operacionais</p></a></div>
    </section>

    <section class="access-section"><div class="access-card reveal"><div><span class="section-tag">Conheça o projeto</span><h2>Antes de liberar o produto, verifique o Pix.</h2><p>Explore a estratégia, a interface e os padrões que sustentam o Verifica Pix.</p><div class="access-actions"><a class="landing-button landing-button-green" href="tables/">Ver o produto ${icon("arrow")}</a><a class="landing-button landing-button-outline" href="guidelines/">Abrir o brandbook</a></div></div><div class="access-symbol"><img src="assets/logo/verificapix-symbol.svg" alt="Símbolo Verifica Pix"><span>Você não fica sozinho na decisão.</span></div></div></section>

    <section class="faq-section" id="faq"><div class="faq-inner"><div class="faq-heading reveal"><span>Dúvidas importantes</span><h2>Perguntas frequentes</h2><p>O que a análise faz, o que ela não faz e como comunicar seus resultados.</p></div><div class="faq-list reveal">
      <details><summary>O Verifica Pix confirma que o dinheiro entrou?</summary><p>Não. A análise organiza e compara evidências do comprovante. A confirmação de liquidação deve ser feita na conta bancária recebedora.</p></details>
      <details><summary>Um resultado de baixo risco significa pagamento seguro?</summary><p>Não. Significa apenas que nenhuma inconsistência relevante foi encontrada nas evidências disponíveis. O estado correto é “baixo risco aparente”.</p></details>
      <details><summary>O que acontece quando existe uma inconsistência?</summary><p>O sistema destaca o dado, explica por que ele merece atenção e orienta uma confirmação adicional antes da entrega.</p></details>
      <details><summary>Quem deve usar o Verifica Pix?</summary><p>Comerciantes, caixas e responsáveis operacionais que recebem Pix e precisam de um processo comum antes de liberar produtos.</p></details>
      <details><summary>Como a marca deve falar sobre fraude?</summary><p>Com precisão e sem conclusões absolutas. Use “inconsistência” e “risco aparente”. Evite “fraude confirmada” com base apenas no comprovante.</p></details>
    </div></div></section>
  </main>
  <footer class="landing-footer"><div class="landing-footer-main"><div><img src="assets/logo/verificapix-francy-white.png" alt="Verifica Pix"><p>Uma camada de confiança operacional entre o comprovante e a entrega.</p></div><nav><strong>Produto</strong><a href="#como-funciona">Como funciona</a><a href="#analise">Análise</a><a href="#operacao">Operação</a></nav><nav><strong>Brandbook</strong><a href="guidelines/">Guidelines</a><a href="logo-usage/">Logo</a><a href="voice/">Voz</a></nav><div><strong>Princípio central</strong><p>Confirme sempre a liquidação na conta bancária recebedora.</p></div></div><div class="landing-footer-bottom"><span>© 2026 Verifica Pix</span><span>Brandbook digital e demonstração de produto</span></div></footer>
  <script src="assets/js/main.js"></script>
</body>
</html>`;
}

await writeFile(resolve(project, "index.html"), clean(homePage()));
await Promise.all(pages.flatMap((page) => [
  mkdir(resolve(project, page.slug), { recursive: true })
    .then(() => writeFile(resolve(project, page.slug, "index.html"), clean(docPage(page)))),
  mkdir(resolve(project, "brandbook", page.slug), { recursive: true })
    .then(() => writeFile(resolve(project, "brandbook", page.slug, "index.html"), clean(docPage(page, true)))),
]));
console.log(`Built ${pages.length * 2 + 1} HTML pages.`);
