// Movement Pillars & Doctrines for "Receita Certa de quem constrói"

export type Pillar = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  tagline: string;
  icon?: string;
};

export type Doctrine = {
  id: string;
  code: string;
  title: string;
  category: string;
  anchor: string;
  description: string;
  framework: string;
  keyPhrase: string;
};

export const MOVEMENT_PILLARS: Pillar[] = [
  {
    id: "education",
    name: "Educação",
    shortName: "Educação",
    description: "Escola que funciona, professor que fica, criança que aprende de verdade.",
    tagline: "Receita Certa de quem constrói Educação",
  },
  {
    id: "security",
    name: "Segurança",
    shortName: "Segurança",
    description: "Rua segura, negócio viável, comunidade que respira.",
    tagline: "Receita Certa de quem constrói Segurança",
  },
  {
    id: "health",
    name: "Saúde",
    shortName: "Saúde",
    description: "Médico de verdade cuida do povo de verdade. Não é ideologia — é cuidado.",
    tagline: "Receita Certa de quem constrói Saúde",
  },
  {
    id: "employment",
    name: "Emprego",
    shortName: "Emprego",
    description: "Quem trabalha sustenta família. Oportunidade vem de quem constrói.",
    tagline: "Receita Certa de quem constrói Emprego",
  },
  {
    id: "development",
    name: "Desenvolvimento",
    shortName: "Desenvolvimento",
    description: "Interior merece o mesmo acesso que capital. Inovação chega onde há liderança.",
    tagline: "Receita Certa de quem constrói Desenvolvimento",
  },
];

export const MOVEMENT_DOCTRINES: Doctrine[] = [
  {
    id: "doc-001",
    code: "DOC-001",
    title: "De uma nova Candeias para uma nova Bahia",
    category: "Identidade Central",
    anchor: "doc-001",
    description: "Frame mestre do movimento — a transformação de Candeias como prova de que é possível.",
    framework: "Hero's Journey + BrandScript",
    keyPhrase: "De uma nova Candeias para uma nova Bahia",
  },
  {
    id: "doc-002",
    code: "DOC-002",
    title: "A Bahia é de quem constrói o interior",
    category: "Grande Ideal",
    anchor: "doc-002",
    description: "Reposicionar o interior como protagonista da Bahia.",
    framework: "Public Narrative + 4 Stories",
    keyPhrase: "A Bahia é de quem constrói o interior",
  },
  {
    id: "doc-003",
    code: "DOC-003",
    title: "A Receita Certa não é promessa — é método",
    category: "Diferenciação",
    anchor: "doc-003",
    description: "Substituir promessa por método comprovado.",
    framework: "Sparkline + Story Grid",
    keyPhrase: "Não é promessa — é método",
  },
  {
    id: "doc-004",
    code: "DOC-004",
    title: "Quem cuidou de uma cidade pode cuidar de um estado",
    category: "Elevação de Causa",
    anchor: "doc-004",
    description: "Transferência de competência comprovada de escala menor para maior.",
    framework: "Hero's Journey (ascensão) + Scale Theory",
    keyPhrase: "Quem cuidou de uma cidade pode cuidar de um estado",
  },
  {
    id: "doc-005",
    code: "DOC-005",
    title: "O interior não pede esmola — pede representação real",
    category: "Convocação",
    anchor: "doc-005",
    description: "Dignidade e capacidade reconhecidas do interior baiano.",
    framework: "Public Narrative + Reposicionamento",
    keyPhrase: "O interior não pede esmola. Pede representação real",
  },
  {
    id: "doc-006",
    code: "DOC-006",
    title: "Resultado é a única ideologia que importa",
    category: "Posicionamento Centro",
    anchor: "doc-006",
    description: "Neutralizar polarização através de foco em resultado verificável.",
    framework: "ABT + Save the Cat",
    keyPhrase: "Resultado é a única ideologia que importa",
  },
  {
    id: "doc-007",
    code: "DOC-007",
    title: "Saúde não é de esquerda nem de direita. É de médico",
    category: "Neutralização Ideológica",
    anchor: "doc-007",
    description: "Despolitizar saúde através de competência técnica.",
    framework: "Personal Story / 5-second moment",
    keyPhrase: "Saúde é de médico, não de partido",
  },
  {
    id: "doc-008",
    code: "DOC-008",
    title: "8 anos. 84%. Candeias mudou. Agora é a vez da Bahia",
    category: "Prova de Resultado",
    anchor: "doc-008",
    description: "Transformar dado em testemunho — resultado é prova de método.",
    framework: "STRONG / Pitch",
    keyPhrase: "8 anos. 84%. Candeias mudou",
  },
  {
    id: "doc-009",
    code: "DOC-009",
    title: "O voto certo é o voto que tem receita por trás",
    category: "Ação Eleitoral",
    anchor: "doc-009",
    description: "Critério de voto fundado em método e comprovação.",
    framework: "STRONG Pitch + Decision Science",
    keyPhrase: "O voto certo é o voto que tem receita por trás",
  },
  {
    id: "doc-010",
    code: "DOC-010",
    title: "Um estado que cuida começa por deputados que já sabem cuidar",
    category: "Pertencimento",
    anchor: "doc-010",
    description: "Sistema integrado de competências — deputados que dominam cuidado.",
    framework: "Hero Returns + System Thinking",
    keyPhrase: "Um estado que cuida começa por deputados que já sabem cuidar",
  },
];

export const MOVEMENT_METHOD = {
  title: "Método Receita Certa",
  steps: [
    {
      id: "listen",
      name: "Escuta Ativa",
      description: "Ouve a população. Saber ouvir é saber entender de verdade.",
    },
    {
      id: "manage",
      name: "Gestão Integrada",
      description: "Eficiência na gestão das pessoas capacitadas para as ações.",
    },
    {
      id: "execute",
      name: "Ações Assertivas",
      description: "Escolha de ações que atacam raiz, não sintoma.",
    },
  ],
};

export const MOVEMENT_PROOF = {
  years: 8,
  percentage: 84,
  description: "8 anos. 84%. Candeias mudou. Agora é a vez da Bahia.",
};

export function getPillarById(id: string): Pillar | undefined {
  return MOVEMENT_PILLARS.find((p) => p.id === id);
}

export function getDoctrinByCode(code: string): Doctrine | undefined {
  return MOVEMENT_DOCTRINES.find((d) => d.code === code);
}

export function getNextPillarId(currentId: string): string {
  const index = MOVEMENT_PILLARS.findIndex((p) => p.id === currentId);
  const nextIndex = (index + 1) % MOVEMENT_PILLARS.length;
  return MOVEMENT_PILLARS[nextIndex].id;
}
