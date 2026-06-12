import {
  BookOpenText,
  Component,
  LayoutGrid,
  Megaphone,
  MessageSquareText,
  Palette,
  ShieldCheck,
  TableProperties,
  Type,
} from "lucide-react";

export type BrandSection = {
  slug: string;
  group: "Marca" | "Fundamentos" | "Produto";
  title: string;
  shortTitle: string;
  description: string;
  icon: typeof Palette;
  chapters: Array<{
    id: string;
    title: string;
    lead: string;
    points?: Array<{ title: string; text: string }>;
  }>;
};

export const brandSections: BrandSection[] = [
  {
    slug: "estrategia",
    group: "Marca",
    title: "Confiança antes da entrega.",
    shortTitle: "Estratégia",
    description: "Posicionamento, público, problema e promessa responsável.",
    icon: ShieldCheck,
    chapters: [
      {
        id: "tese",
        title: "A tese central",
        lead: "O risco nasce no intervalo entre o comprovante exibido e a decisão de liberar o produto. Verifica Pix organiza evidências para fechar essa janela com mais contexto.",
        points: [
          { title: "Problema", text: "A Ilusão de Comprovante faz uma imagem parecer equivalente à liquidação bancária." },
          { title: "Mecanismo", text: "A Validação de Lastro compara sinais disponíveis e orienta a próxima ação." },
          { title: "Posição", text: "Uma camada de confiança operacional entre o comprovante e a entrega." },
        ],
      },
      {
        id: "publico",
        title: "O dono que precisa enxergar de longe",
        lead: "O público principal recebe Pix todos os dias, delega o caixa e continua responsável pelo risco mesmo quando não está presente.",
        points: [
          { title: "Guardião cansado", text: "Quer proteger o que construiu sem vigiar cada atendimento." },
          { title: "Gestor de rede", text: "Precisa de um processo comum em várias lojas e equipes." },
          { title: "Cuidador do time", text: "Quer proteger caixa e funcionário sem transformar confiança em culpa." },
        ],
      },
      {
        id: "promessa",
        title: "Você não fica sozinho na decisão.",
        lead: "A promessa é clareza operacional. A análise não substitui o extrato, não confirma liquidação e não transforma hipótese em certeza.",
      },
    ],
  },
  {
    slug: "voz",
    group: "Marca",
    title: "Clara quando tudo parece incerto.",
    shortTitle: "Voz & Copy",
    description: "Tom, mensagens, vocabulário e limites de promessa.",
    icon: MessageSquareText,
    chapters: [
      {
        id: "atributos",
        title: "Direta, calma e precisa",
        lead: "A voz reduz carga mental. Mostra primeiro o que fazer, depois explica a evidência e sempre reconhece os limites.",
        points: [
          { title: "Direta", text: "Uma ação por frase, verbos concretos e sem introduções vazias." },
          { title: "Calma", text: "Alertas firmes, sem pânico, culpa ou celebração." },
          { title: "Precisa", text: "Fato, inferência e recomendação aparecem separados." },
        ],
      },
      {
        id: "estados",
        title: "Linguagem de estados",
        lead: "Use baixo risco aparente, atenção, alto risco aparente, inconclusivo, processando e erro. Todo resultado termina com uma ação verificável.",
      },
      {
        id: "limites",
        title: "O que não dizemos",
        lead: "Evite “Pix confirmado”, “fraude detectada com certeza”, “zero golpe” e qualquer frase que substitua a confirmação na conta recebedora.",
      },
    ],
  },
  {
    slug: "cores",
    group: "Fundamentos",
    title: "Três ambientes. Uma só marca.",
    shortTitle: "Cores & Temas",
    description: "Claro, escuro e azul institucional com semântica consistente.",
    icon: Palette,
    chapters: [
      {
        id: "sistema",
        title: "Cor tem função",
        lead: "Verde conduz ação e compatibilidade aparente. Navy estrutura. Vermelho interrompe. Âmbar pede revisão. Nenhuma cor prova liquidação.",
      },
      {
        id: "temas",
        title: "Temas como ambientes de trabalho",
        lead: "Claro funciona no balcão iluminado. Escuro reduz brilho em jornadas longas. Azul cria foco institucional em apresentações e salas de operação.",
      },
    ],
  },
  {
    slug: "tipografia",
    group: "Fundamentos",
    title: "Uma voz visual firme e legível.",
    shortTitle: "Tipografia",
    description: "Francy na assinatura, Sora na expressão e Jakarta na operação.",
    icon: Type,
    chapters: [
      {
        id: "familias",
        title: "Três funções tipográficas",
        lead: "Francy preserva reconhecimento na marca. Sora carrega títulos e mensagens. Plus Jakarta Sans organiza interface, leitura e dados.",
      },
      {
        id: "hierarquia",
        title: "Hierarquia antes de decoração",
        lead: "Escala, peso e espaço definem prioridade. Texto operacional permanece compacto; narrativa de marca ganha amplitude.",
      },
    ],
  },
  {
    slug: "layout",
    group: "Fundamentos",
    title: "Ritmo para decidir rápido.",
    shortTitle: "Layout & Espaço",
    description: "Grid, densidade, responsividade e hierarquia espacial.",
    icon: LayoutGrid,
    chapters: [
      {
        id: "grid",
        title: "Estrutura previsível, ritmo variável",
        lead: "O painel usa navegação estável e conteúdo adaptável. O brandbook alterna leitura ampla, espécimes e diretórios densos.",
      },
      {
        id: "escala",
        title: "Escala baseada em quatro",
        lead: "4, 8, 12, 16, 24, 32, 48 e 64 pixels formam a base. Valores maiores criam pausas narrativas, não apenas espaços vazios.",
      },
    ],
  },
  {
    slug: "componentes",
    group: "Produto",
    title: "Componentes para decidir.",
    shortTitle: "Componentes",
    description: "Ações, evidências, estados, formulários e feedback.",
    icon: Component,
    chapters: [
      {
        id: "contrato",
        title: "Cada componente tem um contrato",
        lead: "Default, hover, foco, ativo, desabilitado, carregando e erro são estados obrigatórios. A forma visual permanece igual em todas as telas.",
      },
      {
        id: "evidencia",
        title: "Evidência, leitura e ação",
        lead: "O dado observado nunca se mistura à interpretação. A recomendação aparece por último e usa um verbo explícito.",
      },
    ],
  },
  {
    slug: "tabelas",
    group: "Produto",
    title: "Dados que continuam legíveis.",
    shortTitle: "Tabelas & Dados",
    description: "Densidade, comparação, filtros e leitura responsiva.",
    icon: TableProperties,
    chapters: [
      {
        id: "estrutura",
        title: "Compare sem perder o contexto",
        lead: "Cabeçalhos persistentes, alinhamento por tipo de dado e status explícitos tornam a tabela uma ferramenta de decisão.",
      },
      {
        id: "mobile",
        title: "No mobile, priorize",
        lead: "Informação crítica permanece visível; dados secundários migram para detalhe progressivo ou rolagem horizontal identificada.",
      },
    ],
  },
  {
    slug: "movimento",
    group: "Marca",
    title: "Caixa Blindado.",
    shortTitle: "Movimento",
    description: "Causa, doutrinas, ritos, símbolos e guardrails do movimento.",
    icon: Megaphone,
    chapters: [
      {
        id: "ideal",
        title: "O Brasil é de quem faz o bem.",
        lead: "Proteger o pequeno comércio é proteger famílias, empregos e bairros. A causa transforma verificação em cuidado ativo, não em desconfiança.",
      },
      {
        id: "tese",
        title: "Blindagem vence lamentação",
        lead: "O movimento combate a normalização do prejuízo. O empresário não precisa sofrer calado nem responsabilizar sozinho quem opera o caixa.",
        points: [
          { title: "Herói", text: "Quem trabalha, produz e sustenta a economia real." },
          { title: "Tensão", text: "Velocidade do Pix contra a pressa usada para explorar a decisão no balcão." },
          { title: "Virada", text: "Verificar não é desconfiar. É cuidar do negócio e do time." },
        ],
      },
      {
        id: "protetores",
        title: "Os Protetores",
        lead: "Empresários e equipes que instalam um processo simples, compartilham aprendizado e ajudam outros comércios a reduzir exposição.",
        points: [
          { title: "Proteção", text: "Quem constrói, protege." },
          { title: "Dignidade", text: "Ser honesto não significa decidir sem evidência." },
          { title: "União", text: "O barulho dos bons transforma experiência em prevenção coletiva." },
          { title: "Clareza", text: "Comprovante é evidência. Liquidação se confirma na conta recebedora." },
        ],
      },
      {
        id: "ritos",
        title: "Ritos que tornam a causa visível",
        lead: "Abrir o Escudo é adotar o processo. Fechar a Janela é verificar antes da entrega. Barulho dos Bons é compartilhar o aprendizado com outro comerciante.",
      },
      {
        id: "simbolos",
        title: "Escudo, balcão e janela",
        lead: "O escudo representa proteção ativa. O balcão é a linha de frente. A janela é o momento entre a imagem apresentada e a confirmação necessária.",
      },
      {
        id: "flywheel",
        title: "Conhecer, confiar, adotar, propagar",
        lead: "Histórias reais apresentam o problema. Demonstrações explicam o processo. A adoção cria rotina. Resultados documentados, com consentimento, alimentam a comunidade.",
      },
      {
        id: "guardrails",
        title: "Força sem irresponsabilidade",
        lead: "Não expor vítimas, ensinar técnicas de golpe, atacar funcionários, usar nacionalidade como insulto ou prometer eliminação absoluta de fraude.",
      },
    ],
  },
  {
    slug: "guidelines",
    group: "Marca",
    title: "Uma marca que protege a decisão.",
    shortTitle: "Guidelines",
    description: "Princípios gerais e critérios de implementação.",
    icon: BookOpenText,
    chapters: [
      {
        id: "essencia",
        title: "Clareza antes de autoridade",
        lead: "Confiança nasce de evidências organizadas, limites explícitos e um próximo passo compreensível.",
      },
      {
        id: "principios",
        title: "Princípios operacionais",
        lead: "Próxima ação visível, proteção sem medo, linguagem honesta, acessibilidade e consistência entre marca e produto.",
      },
    ],
  },
];

export const directoryItems = brandSections.flatMap((section) => [
  {
    id: `page-${section.slug}`,
    name: section.shortTitle,
    category: "Página",
    group: section.group,
    description: section.description,
    href: `/app/marca/${section.slug}`,
  },
  ...section.chapters.map((chapter) => ({
    id: `${section.slug}-${chapter.id}`,
    name: chapter.title,
    category: "Capítulo",
    group: section.group,
    description: chapter.lead,
    href: `/app/marca/${section.slug}#${chapter.id}`,
  })),
]);

export const assetDirectory = [
  { id: "asset-symbol", name: "Símbolo Verifica Pix", category: "Asset", group: "Marca", description: "Marca compacta para avatar, favicon e navegação.", href: "/brand/verificapix-symbol.svg" },
  { id: "asset-logo", name: "Assinatura Francy", category: "Asset", group: "Marca", description: "Assinatura principal em fundos claros.", href: "/brand/verificapix-francy.png" },
  { id: "asset-logo-white", name: "Assinatura reversa", category: "Asset", group: "Marca", description: "Assinatura branca para fundos escuros.", href: "/brand/verificapix-francy-white.png" },
];

export function getBrandSection(slug: string) {
  return brandSections.find((section) => section.slug === slug);
}
