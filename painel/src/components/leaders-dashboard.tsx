"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  Target,
  Clock,
  ChevronDown,
  MessageSquare,
  Filter,
  Search,
} from "lucide-react";
import { type MembershipWithStats } from "@/lib/leadership-types";
import { getMembershipsWithStats } from "@/lib/leadership-actions";

type SortBy = "activity" | "contacts" | "engagement" | "name";
type FilterStatus = "all" | "active" | "new" | "dormant";

interface LeadersDashboardProps {
  organizationId: string;
  currentUserRole: string;
}

export function LeadersDashboard({ organizationId, currentUserRole }: LeadersDashboardProps) {
  const [leaders, setLeaders] = useState<MembershipWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [sortBy, setSortBy] = useState<SortBy>("activity");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const loadLeaders = async () => {
      try {
        const data = await getMembershipsWithStats(organizationId, {
          status: filterStatus === "all" ? undefined : filterStatus as any,
        });
        setLeaders(data);
      } catch (err) {
        console.error("Error loading leaders:", err);
      } finally {
        setLoading(false);
      }
    };

    loadLeaders();
  }, [organizationId, filterStatus]);

  // Filter by search
  const filteredLeaders = leaders.filter(
    (leader) =>
      leader.phone?.includes(search) ||
      leader.whatsapp?.includes(search) ||
      leader.bio?.toLowerCase().includes(search.toLowerCase())
  );

  // Sort
  const sortedLeaders = [...filteredLeaders].sort((a, b) => {
    switch (sortBy) {
      case "activity":
        return (
          (b.last_action_at ? new Date(b.last_action_at).getTime() : 0) -
          (a.last_action_at ? new Date(a.last_action_at).getTime() : 0)
        );
      case "contacts":
        return (b.contacts_count || 0) - (a.contacts_count || 0);
      case "engagement":
        return (b.engagement_score || 0) - (a.engagement_score || 0);
      case "name":
        return (a.bio || "").localeCompare(b.bio || "");
      default:
        return 0;
    }
  });

  // Calculate stats
  const stats = {
    total: leaders.length,
    active: leaders.filter((l) => l.status === "active").length,
    new: leaders.filter((l) => l.status === "pending_validation").length,
    dormant: leaders.filter((l) => l.days_since_last_action && l.days_since_last_action > 7).length,
    avg_contacts: leaders.reduce((sum, l) => sum + (l.contacts_count || 0), 0) / (leaders.length || 1),
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Total de Líderes"
          value={stats.total.toString()}
          icon={Users}
          color="blue"
        />
        <StatCard
          label="Ativos"
          value={stats.active.toString()}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          label="Novos"
          value={stats.new.toString()}
          icon={Target}
          color="yellow"
        />
        <StatCard
          label="Inativos"
          value={stats.dormant.toString()}
          icon={Clock}
          color="red"
        />
        <StatCard
          label="Contatos/Líder"
          value={Math.round(stats.avg_contacts).toString()}
          icon={Users}
          color="purple"
        />
      </div>

      {/* Filters & Search */}
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por telefone, WhatsApp..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          >
            <option value="all">Todos os Status</option>
            <option value="active">Ativos</option>
            <option value="new">Novos</option>
            <option value="dormant">Inativos</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          >
            <option value="activity">Últimas Atividades</option>
            <option value="contacts">Mais Contatos</option>
            <option value="engagement">Mais Engajados</option>
            <option value="name">Nome A-Z</option>
          </select>
        </div>
      </div>

      {/* Leaders List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedLeaders.length === 0 ? (
            <div className="rounded-lg border border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
              <p className="text-slate-600 dark:text-slate-400">
                Nenhum líder encontrado com esses filtros
              </p>
            </div>
          ) : (
            sortedLeaders.map((leader) => (
              <LeaderCard
                key={leader.id}
                leader={leader}
                isExpanded={expandedId === leader.id}
                onToggle={() =>
                  setExpandedId(expandedId === leader.id ? null : leader.id)
                }
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ============ Stat Card ============
function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: any;
  color: string;
}) {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
    green: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400",
    yellow: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400",
    red: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400",
  };

  return (
    <div className={`rounded-lg p-4 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{label}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
        <Icon className="h-8 w-8 opacity-50" />
      </div>
    </div>
  );
}

// ============ Leader Card ============
function LeaderCard({
  leader,
  isExpanded,
  onToggle,
}: {
  leader: MembershipWithStats;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "pending_validation":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "dormant":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300";
    }
  };

  const getActivityBadge = (daysAgo?: number) => {
    if (!daysAgo) return null;
    if (daysAgo === 0) return <span className="text-xs text-green-600">Hoje</span>;
    if (daysAgo === 1) return <span className="text-xs text-green-600">Ontem</span>;
    if (daysAgo <= 7) return <span className="text-xs text-yellow-600">{daysAgo}d atrás</span>;
    return <span className="text-xs text-red-600">{daysAgo}d inativo</span>;
  };

  return (
    <button
      onClick={onToggle}
      className="w-full text-left rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
    >
      {/* Main Row */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Name & Zone */}
          <div className="flex items-center gap-3">
            {leader.avatar_url ? (
              <img
                src={leader.avatar_url}
                alt={leader.bio || "Líder"}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900">
                <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                  {(leader.bio || "L").charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white">
                {leader.bio || "Sem nome"}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {leader.zone_name} {leader.neighborhood && `• ${leader.neighborhood}`}
              </p>
            </div>
          </div>

          {/* Status & Activity */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                leader.status
              )}`}
            >
              {leader.status === "pending_validation"
                ? "Aguardando aprovação"
                : leader.status === "active"
                  ? "Ativo"
                  : "Inativo"}
            </span>
            {getActivityBadge(leader.days_since_last_action)}
          </div>
        </div>

        {/* Metrics */}
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {leader.contacts_count || 0}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">contatos</p>
        </div>

        {/* Expand Icon */}
        <ChevronDown
          className={`ml-3 h-5 w-5 text-slate-400 transition-transform dark:text-slate-600 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Contact Info */}
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Contato</p>
              <p className="mt-1 text-sm text-slate-900 dark:text-white">{leader.phone}</p>
            </div>

            {/* Confirmed Voters */}
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Votos Confirmados
              </p>
              <p className="mt-1 text-lg font-bold text-green-600 dark:text-green-400">
                {leader.confirmed_voters_count || 0}
              </p>
            </div>

            {/* Engagement */}
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Engajamento
              </p>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: `${((leader.engagement_score || 0) * 100).toFixed(0)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {((leader.engagement_score || 0) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="flex items-center justify-center gap-2 rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
              <MessageSquare className="h-3.5 w-3.5" />
              Enviar Mensagem
            </button>

            <button className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              Ver Perfil Completo
            </button>
          </div>
        </div>
      )}
    </button>
  );
}
