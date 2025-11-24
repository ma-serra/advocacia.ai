// frontend/src/components/AdvogadoPanel/index.tsx
// Componentes React para Painel do Advogado

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock, TrendingUp, MessageSquare, FileText, Plus, Search, Filter } from 'lucide-react';

// ============================================================================
// 1. COMPONENTE: LOGIN DO ADVOGADO
// ============================================================================

export function AdvogadoLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [, navigate] = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Email ou senha inválidos');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user_id', data.user_id);
      
      navigate('/advogado/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Advocacia.AI</h1>
        <p className="text-center text-gray-600 mb-8">Portal do Advogado</p>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Senha</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Não tem conta? <a href="/advogado/registro" className="text-blue-600 hover:underline">Registre-se</a>
        </p>
      </Card>
    </div>
  );
}


// ============================================================================
// 2. COMPONENTE: REGISTRO DO ADVOGADO
// ============================================================================

export function AdvogadoRegistro() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
    nome: '',
    tipo: 'individual',
    cpf_cnpj: '',
    oab_numero: '',
    oab_estado: 'SP',
    areas: [],
    cidades: [],
    estados: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [, navigate] = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register/advogado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Erro ao registrar');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user_id', data.user_id);
      
      navigate('/advogado/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <h1 className="text-3xl font-bold mb-8">Registre-se como Advogado</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Informações Pessoais</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nome Completo</label>
                <Input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="João Silva"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Senha</label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button
                type="button"
                onClick={() => setStep(2)}
                className="w-full"
              >
                Próximo
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Informações Profissionais</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">Nome Profissional</label>
                <Input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="João Silva Advogados"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">OAB Número</label>
                  <Input
                    type="text"
                    name="oab_numero"
                    value={formData.oab_numero}
                    onChange={handleChange}
                    placeholder="123456"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">OAB Estado</label>
                  <select
                    name="oab_estado"
                    value={formData.oab_estado}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="SP">SP</option>
                    <option value="RJ">RJ</option>
                    <option value="MG">MG</option>
                    <option value="BA">BA</option>
                    {/* Adicionar outros estados */}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">CPF/CNPJ</label>
                <Input
                  type="text"
                  name="cpf_cnpj"
                  value={formData.cpf_cnpj}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Registrando...' : 'Registrar'}
                </Button>
              </div>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}


// ============================================================================
// 3. COMPONENTE: DASHBOARD DO ADVOGADO
// ============================================================================

export function AdvogadoDashboard() {
  const [stats, setStats] = useState({
    total_leads: 0,
    leads_novos: 0,
    leads_em_andamento: 0,
    leads_fechados: 0,
    taxa_conversao: 0
  });
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Buscar estatísticas
      const statsRes = await fetch('/api/auth/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      setStats(statsData);

      // Buscar leads
      const leadsRes = await fetch('/api/auth/leads', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const leadsData = await leadsRes.json();
      setLeads(leadsData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={() => navigate('/advogado/novo-lead')}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Lead
          </Button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total de Leads"
            value={stats.total_leads}
            icon={<TrendingUp className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Novos"
            value={stats.leads_novos}
            icon={<AlertCircle className="w-6 h-6" />}
            color="yellow"
          />
          <StatCard
            title="Em Andamento"
            value={stats.leads_em_andamento}
            icon={<Clock className="w-6 h-6" />}
            color="orange"
          />
          <StatCard
            title="Fechados"
            value={stats.leads_fechados}
            icon={<CheckCircle className="w-6 h-6" />}
            color="green"
          />
        </div>

        {/* Tabela de Leads */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Leads Recentes</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 px-4">Cliente</th>
                  <th className="text-left py-2 px-4">Área</th>
                  <th className="text-left py-2 px-4">Status</th>
                  <th className="text-left py-2 px-4">Urgência</th>
                  <th className="text-left py-2 px-4">Ação</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead: any) => (
                  <tr key={lead.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{lead.nome_cliente}</td>
                    <td className="py-3 px-4">{lead.area_direito}</td>
                    <td className="py-3 px-4">
                      <Badge variant={lead.status === 'novo' ? 'default' : 'secondary'}>
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={lead.urgencia === 'alta' ? 'destructive' : 'default'}>
                        {lead.urgencia}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/advogado/leads/${lead.id}`)}
                      >
                        Ver Detalhes
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}


// ============================================================================
// 4. COMPONENTE: DETALHES DO LEAD (CRM)
// ============================================================================

export function LeadDetail({ leadId }: { leadId: string }) {
  const [lead, setLead] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLead();
    fetchMessages();
  }, [leadId]);

  const fetchLead = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/auth/leads/${leadId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setLead(data);
    } catch (error) {
      console.error('Erro ao buscar lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/auth/leads/${leadId}/mensagens`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setMessages(data.mensagens || []);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/auth/leads/${leadId}/mensagens`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mensagem: newMessage,
          tipo: 'advogado'
        })
      });

      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  if (loading) return <div className="p-8">Carregando...</div>;
  if (!lead) return <div className="p-8">Lead não encontrado</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Informações do Lead */}
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">{lead.nome_cliente}</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-semibold">{lead.email_cliente}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Telefone</p>
            <p className="font-semibold">{lead.telefone_cliente}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Área</p>
            <p className="font-semibold">{lead.area_direito}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <Badge>{lead.status}</Badge>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-2">Descrição do Caso</p>
          <p className="text-gray-800">{lead.descricao_caso}</p>
        </div>
      </Card>

      {/* Chat */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          Conversa
        </h2>

        <div className="bg-gray-50 rounded p-4 h-96 overflow-y-auto mb-4 space-y-3">
          {messages.map((msg: any, idx: number) => (
            <div
              key={idx}
              className={`flex ${msg.tipo === 'advogado' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.tipo === 'advogado'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {msg.texto}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1"
          />
          <Button type="submit">Enviar</Button>
        </form>
      </Card>
    </div>
  );
}


// ============================================================================
// 5. COMPONENTE AUXILIAR: STAT CARD
// ============================================================================

function StatCard({
  title,
  value,
  icon,
  color
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600'
  };

  return (
    <Card className={`p-6 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="opacity-50">{icon}</div>
      </div>
    </Card>
  );
}
