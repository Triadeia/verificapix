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
    title: "A Receita Certa para a Bahia.",
    shortTitle: "Movimento",
    description: "Dr. Pitágoras. Narrativa, método, doutrinas e testemunhos do movimento.",
    icon: Megaphone,
    chapters: [
      {
        id: "headline",
        title: "Dr. Pitágoras. A Receita Certa para a Bahia.",
        lead: "A Bahia é de quem constrói o interior. Quem cuidou de Candeias, vai cuidar da Bahia. Não é promessa — é método que já provou resultado.",
      },
      {
        id: "pilares",
        title: "Receita Certa de quem constrói",
        lead: "Cinco pilares estruturam a ação: Educação, Segurança, Saúde, Emprego e Desenvolvimento. Cada um é um compromisso testado em Candeias, pronto para expandir.",
        points: [
          { title: "Educação", text: "Escola que funciona, professor que fica, criança que aprende de verdade." },
          { title: "Segurança", text: "Rua segura, negócio viável, comunidade que respira." },
          { title: "Saúde", text: "Médico de verdade cuida do povo de verdade. Não é ideologia — é cuidado." },
          { title: "Emprego", text: "Quem trabalha sustenta família. Oportunidade vem de quem constrói." },
          { title: "Desenvolvimento", text: "Interior merece o mesmo acesso que capital. Inovação chega onde há liderança." },
        ],
      },
      {
        id: "metodo",
        title: "O Método Receita Certa",
        lead: "Não é palavra de campanha. É sistema que funciona: Escuta Ativa (ouve a população) → Gestão Integrada (eficiência nas pessoas certas) → Ações Assertivas (ataca raiz, não sintoma).",
        points: [
          { title: "Escuta Ativa", text: "Saber ouvir é saber entender de verdade. Sem escuta, não há receita." },
          { title: "Gestão Integrada", text: "Colocar gente capaz nos lugares certos. Eficiência começa com as pessoas." },
          { title: "Ações Assertivas", text: "Cada ação resolve necessidade identificada. Sem desperdício, sem promessas vazias." },
        ],
      },
      {
        id: "prova",
        title: "8 anos. 84%. Candeias mudou.",
        lead: "Não é estatística de campanha. São 8 anos de gestão real, 84% de aprovação (Datafolha 2024), e uma cidade que virou símbolo de que é possível quando tem método.",
      },
      {
        id: "ideal",
        title: "De uma nova Candeias para uma nova Bahia",
        lead: "O interior não pede esmola. Pede representação real. Deputado que já sabe cuidar, que já entrega resultado, que já provou método.",
      },
      {
        id: "ritos",
        title: "Ritos que tornam a causa visível",
        lead: "Conhecer o povo é o primeiro rito. Trazer solução testada é o segundo. Documentar resultado é o terceiro — porque quem constrói deixa receita.",
      },
      {
        id: "simbolos",
        title: "Candeias como símbolo",
        lead: "Não é homenagem — é prova. UTI que não existia agora existe. Escola que caía agora funciona. Segurança que parecia impossível agora é realidade.",
      },
      {
        id: "flywheel",
        title: "Conhecer, confiar, adotar, propagar",
        lead: "Histórias reais de Candeias apresentam a prova. Método explicado de forma clara para todos entenderem. Adoção em novos territórios gera novo resultado. Documentação alimenta confiança coletiva.",
      },
      {
        id: "guardrails",
        title: "Força sem irresponsabilidade",
        lead: "Sem ataque pessoal. Sem mentira sobre números. Sem promessas impossíveis. Crítica é ao método errado, nunca à pessoa. Transparência radical: tudo que foi feito, pode ser auditado.",
      },
      {
        id: "documentos",
        title: "Documentos do Movimento",
        lead: "As 10 Doutrinas Centrais estruturam toda narrativa: da identidade ao voto. Cada uma é um andar do edifício. Cada um clicável, cada um com história, cada um comprovável.",
        points: [
          {
            title: "DOC-001 a DOC-010",
            text: "Narrativa profunda que fundamenta copy, vídeos e conversas. Doutrinas vivas — que crescem com evidência, não que morrem com eleição.",
          },
          {
            title: "Território",
            text: "Toda ação aponta o bairro, a escola, o hospital. Contexto evita generalização e prova rastreabilidade.",
          },
          {
            title: "Compartilhamento",
            text: "Publicar é o rito. Quem constrói deixa a receita. Quem chegar depois continua de onde parou.",
          },
        ],
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

export const MOVEMENT_DOCUMENTS_ANCHOR = "documentos";

export function getBrandSection(slug: string) {
  return brandSections.find((section) => section.slug === slug);
}
