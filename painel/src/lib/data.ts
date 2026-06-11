export type Role = "owner" | "admin" | "manager" | "member" | "viewer";
export type TaskStatus =
  | "Backlog"
  | "A Fazer"
  | "Em andamento"
  | "Em revisão"
  | "Bloqueada"
  | "Concluída"
  | "Cancelada";

export const employees = [
  { id: "nilton", name: "Nilton", email: "nilton@verificapix.local", role: "owner" as Role, area: "Direção", active: true },
  { id: "luigi", name: "Luigi", email: "luigi@verificapix.local", role: "admin" as Role, area: "Operação", active: true },
  { id: "joao", name: "João", email: "joao@verificapix.local", role: "manager" as Role, area: "Tecnologia", active: true },
  { id: "gustavo", name: "Gustavo", email: "gustavo@verificapix.local", role: "member" as Role, area: "Marketing", active: true },
  { id: "quezia", name: "Quezia", email: "quezia@verificapix.local", role: "member" as Role, area: "Branding", active: true },
  { id: "daniel", name: "Daniel", email: "daniel@verificapix.local", role: "member" as Role, area: "Produto", active: true },
];

export const meetings = [
  {
    id: "estrategia-mvp",
    title: "Estratégia e escopo do MVP",
    date: "10 jun 2026",
    time: "14:00",
    participants: ["Nilton", "Luigi", "João", "Daniel"],
    status: "Processada",
    tags: ["MVP", "Produto", "Tecnologia"],
    summary: "O time alinhou a primeira versão do Verifica Pix, priorizando validação operacional, WhatsApp e segurança na comunicação.",
    strategic: "A vantagem inicial está em reduzir a Brecha do Caixa Cego sem prometer confirmação bancária. A validação presencial deve acompanhar o desenvolvimento.",
    decisions: ["Priorizar o fluxo de análise via WhatsApp", "Usar linguagem de risco aparente", "Conduzir validação presencial com comerciantes"],
    risks: ["Escopo maior que a capacidade atual", "Dependência futura de integrações externas"],
    opportunities: ["Parcerias com associações comerciais", "Conteúdo educativo sobre comprovantes falsos"],
  },
  {
    id: "brandbook",
    title: "Rebranding e design system",
    date: "9 jun 2026",
    time: "10:30",
    participants: ["Nilton", "Quezia", "Gustavo"],
    status: "Processada",
    tags: ["Branding", "Design"],
    summary: "A identidade foi consolidada em verde, navy e off-white, com foco em clareza operacional e confiança.",
    strategic: "O produto deve parecer moderno e próximo, sem adotar códigos visuais de banco tradicional ou alegações absolutas.",
    decisions: ["Manter Sora e Plus Jakarta Sans", "Reservar vermelho para risco", "Usar o produto como imagem principal"],
    risks: ["Excesso de efeitos reduz legibilidade"],
    opportunities: ["Transformar o brandbook em biblioteca de produto"],
  },
  {
    id: "operacao-validacao",
    title: "Plano de validação presencial",
    date: "7 jun 2026",
    time: "16:00",
    participants: ["Nilton", "Luigi", "Gustavo"],
    status: "Revisar",
    tags: ["Operação", "ICP"],
    summary: "Definição do roteiro de entrevistas com donos e funcionários de pequenos comércios.",
    strategic: "A pesquisa precisa medir comportamento real no caixa, não apenas intenção declarada.",
    decisions: ["Entrevistar dono e atendente separadamente", "Registrar objeções e tempo de conferência"],
    risks: ["Amostra pequena ou enviesada"],
    opportunities: ["Encontrar linguagem comercial usada pelo próprio público"],
  },
];

export const tasks = [
  ["Desenvolver MVP do verificador de comprovante Pix", "Em andamento", "Urgente", "João", "Tecnologia", "MVP Verifica Pix"],
  ["Finalizar painel empresarial", "Em andamento", "Urgente", "João", "Tecnologia", "Painel Empresarial"],
  ["Configurar Google OAuth", "Backlog", "Alta", "Luigi", "Tecnologia", "Integração Google"],
  ["Configurar ClickUp API", "Backlog", "Média", "Luigi", "Operação", "Integração ClickUp"],
  ["Criar fluxo de transcrição", "Em revisão", "Alta", "Daniel", "Inteligência", "Painel Empresarial"],
  ["Criar prompt de resumo estratégico", "A Fazer", "Alta", "Daniel", "Inteligência", "Painel Empresarial"],
  ["Criar brandbook final", "Concluída", "Alta", "Quezia", "Branding", "Brandbook e Design System"],
  ["Planejar validação presencial", "A Fazer", "Alta", "Gustavo", "Produto", "Validação Presencial"],
  ["Definir ICP", "Concluída", "Alta", "Nilton", "Marketing", "MVP Verifica Pix"],
  ["Revisar LGPD", "A Fazer", "Alta", "Luigi", "Jurídico", "Jurídico e LGPD"],
  ["Criar plaquinha com QR Code", "Backlog", "Média", "Quezia", "Branding", "Plaquinhas e Materiais"],
  ["Criar campanha de conteúdo orgânico", "Backlog", "Média", "Gustavo", "Marketing", "Marketing Orgânico"],
  ["Validar linguagem de risco aparente", "Em revisão", "Alta", "Daniel", "Produto", "MVP Verifica Pix"],
  ["Mapear jornada do caixa", "A Fazer", "Média", "Gustavo", "Produto", "Validação Presencial"],
  ["Definir eventos de auditoria", "Bloqueada", "Alta", "João", "Tecnologia", "Painel Empresarial"],
  ["Preparar política de retenção", "Backlog", "Média", "Luigi", "Jurídico", "Jurídico e LGPD"],
  ["Revisar acessibilidade do painel", "A Fazer", "Média", "Quezia", "Branding", "Painel Empresarial"],
  ["Criar relatório semanal", "Concluída", "Baixa", "Luigi", "Operação", "Painel Empresarial"],
  ["Definir métricas do piloto", "Backlog", "Alta", "Nilton", "Produto", "MVP Verifica Pix"],
  ["Organizar documentos estratégicos", "Em andamento", "Média", "Daniel", "Inteligência", "Painel Empresarial"],
].map(([title, status, priority, assignee, area, project], index) => ({
  id: `task-${index + 1}`,
  title,
  status: status as TaskStatus,
  priority,
  assignee,
  area,
  project,
  due: index % 4 === 0 ? "14 jun" : index % 3 === 0 ? "18 jun" : "25 jun",
  score: 92 - index,
}));

export const projects = [
  ["MVP Verifica Pix", "Nilton", 58, "Em andamento"],
  ["Brandbook e Design System", "Quezia", 92, "Em revisão"],
  ["Painel Empresarial", "João", 64, "Em andamento"],
  ["WhatsApp Verificação", "Daniel", 35, "Planejamento"],
  ["Marketing Orgânico", "Gustavo", 28, "Planejamento"],
  ["Validação Presencial", "Gustavo", 42, "Em andamento"],
  ["Integração ClickUp", "Luigi", 10, "Backlog"],
  ["Integração Google", "Luigi", 10, "Backlog"],
  ["Jurídico e LGPD", "Luigi", 30, "Em andamento"],
  ["Plaquinhas e Materiais", "Quezia", 15, "Backlog"],
].map(([name, owner, progress, status], index) => ({ id: index + 1, name, owner, progress, status }));

export const documents = [
  { title: "Transcrição completa da reunião Verifica Pix", type: "Transcrição", tags: ["Reunião", "Estratégia"] },
  { title: "Relatório estratégico da reunião", type: "Relatório", tags: ["Decisões", "Roadmap"] },
  { title: "Mecanismo único do problema", type: "Estratégia", tags: ["Ilusão de Comprovante"] },
  { title: "Mecanismo único da solução", type: "Estratégia", tags: ["Validação de Lastro"] },
  { title: "Bússola do cliente ideal", type: "ICP", tags: ["Comerciantes", "Pesquisa"] },
];
