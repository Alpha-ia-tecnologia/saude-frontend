import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import Card from '@/components/ui/Card';
import {
    Users, UserPlus, Search, Filter, Edit, Trash2, Shield, ShieldCheck,
    ShieldAlert, X, Eye, EyeOff, Key, Check, Minus, Settings,
    ChevronDown, Mail, CreditCard, Clock
} from 'lucide-react';

// --- In-memory data ---

const modules = [
    'Dashboard', 'Pacientes', 'Agendamento', 'Atendimento', 'Farmacia',
    'Financeiro', 'Estoque', 'Relatorios', 'NPS', 'Administracao',
    'Comunicacao', 'Enfermagem', 'Analise de Dados', 'Gestao Clinica'
];

const initialRoles = [
    {
        id: 1, nome: 'Administrador', descricao: 'Acesso completo a todos os modulos', cor: '#dc2626',
        permissions: modules.reduce((a, m) => ({ ...a, [m]: { read: true, write: true } }), {})
    },
    {
        id: 2, nome: 'Medico', descricao: 'Acesso a modulos clinicos e atendimento', cor: '#2563eb',
        permissions: {
            'Dashboard': { read: true, write: false }, 'Pacientes': { read: true, write: true },
            'Agendamento': { read: true, write: true }, 'Atendimento': { read: true, write: true },
            'Farmacia': { read: true, write: true }, 'Financeiro': { read: false, write: false },
            'Estoque': { read: true, write: false }, 'Relatorios': { read: true, write: false },
            'NPS': { read: true, write: false }, 'Administracao': { read: false, write: false },
            'Comunicacao': { read: true, write: true }, 'Enfermagem': { read: true, write: false },
            'Analise de Dados': { read: true, write: false }, 'Gestao Clinica': { read: true, write: true }
        }
    },
    {
        id: 3, nome: 'Enfermeiro', descricao: 'Acesso a enfermagem, triagem e pacientes', cor: '#059669',
        permissions: {
            'Dashboard': { read: true, write: false }, 'Pacientes': { read: true, write: true },
            'Agendamento': { read: true, write: false }, 'Atendimento': { read: true, write: true },
            'Farmacia': { read: true, write: false }, 'Financeiro': { read: false, write: false },
            'Estoque': { read: true, write: false }, 'Relatorios': { read: true, write: false },
            'NPS': { read: true, write: false }, 'Administracao': { read: false, write: false },
            'Comunicacao': { read: true, write: true }, 'Enfermagem': { read: true, write: true },
            'Analise de Dados': { read: false, write: false }, 'Gestao Clinica': { read: true, write: false }
        }
    },
    {
        id: 4, nome: 'Tecnico de Enfermagem', descricao: 'Acesso basico a enfermagem e triagem', cor: '#0891b2',
        permissions: {
            'Dashboard': { read: true, write: false }, 'Pacientes': { read: true, write: false },
            'Agendamento': { read: true, write: false }, 'Atendimento': { read: true, write: false },
            'Farmacia': { read: true, write: false }, 'Financeiro': { read: false, write: false },
            'Estoque': { read: true, write: false }, 'Relatorios': { read: false, write: false },
            'NPS': { read: false, write: false }, 'Administracao': { read: false, write: false },
            'Comunicacao': { read: true, write: false }, 'Enfermagem': { read: true, write: true },
            'Analise de Dados': { read: false, write: false }, 'Gestao Clinica': { read: false, write: false }
        }
    },
    {
        id: 5, nome: 'Recepcionista', descricao: 'Acesso a agendamento e recepcao', cor: '#7c3aed',
        permissions: {
            'Dashboard': { read: true, write: false }, 'Pacientes': { read: true, write: true },
            'Agendamento': { read: true, write: true }, 'Atendimento': { read: true, write: false },
            'Farmacia': { read: false, write: false }, 'Financeiro': { read: false, write: false },
            'Estoque': { read: false, write: false }, 'Relatorios': { read: false, write: false },
            'NPS': { read: false, write: false }, 'Administracao': { read: false, write: false },
            'Comunicacao': { read: true, write: true }, 'Enfermagem': { read: false, write: false },
            'Analise de Dados': { read: false, write: false }, 'Gestao Clinica': { read: false, write: false }
        }
    },
    {
        id: 6, nome: 'Farmaceutico', descricao: 'Acesso a farmacia, estoque e dispensacao', cor: '#d97706',
        permissions: {
            'Dashboard': { read: true, write: false }, 'Pacientes': { read: true, write: false },
            'Agendamento': { read: false, write: false }, 'Atendimento': { read: true, write: false },
            'Farmacia': { read: true, write: true }, 'Financeiro': { read: false, write: false },
            'Estoque': { read: true, write: true }, 'Relatorios': { read: true, write: false },
            'NPS': { read: false, write: false }, 'Administracao': { read: false, write: false },
            'Comunicacao': { read: true, write: false }, 'Enfermagem': { read: false, write: false },
            'Analise de Dados': { read: false, write: false }, 'Gestao Clinica': { read: false, write: false }
        }
    },
    {
        id: 7, nome: 'Gestor', descricao: 'Acesso gerencial a relatorios e indicadores', cor: '#be185d',
        permissions: {
            'Dashboard': { read: true, write: true }, 'Pacientes': { read: true, write: false },
            'Agendamento': { read: true, write: false }, 'Atendimento': { read: true, write: false },
            'Farmacia': { read: true, write: false }, 'Financeiro': { read: true, write: true },
            'Estoque': { read: true, write: true }, 'Relatorios': { read: true, write: true },
            'NPS': { read: true, write: true }, 'Administracao': { read: true, write: false },
            'Comunicacao': { read: true, write: true }, 'Enfermagem': { read: true, write: false },
            'Analise de Dados': { read: true, write: true }, 'Gestao Clinica': { read: true, write: true }
        }
    },
    {
        id: 8, nome: 'ACS', descricao: 'Agente Comunitario de Saude', cor: '#16a34a',
        permissions: {
            'Dashboard': { read: true, write: false }, 'Pacientes': { read: true, write: true },
            'Agendamento': { read: true, write: true }, 'Atendimento': { read: true, write: false },
            'Farmacia': { read: false, write: false }, 'Financeiro': { read: false, write: false },
            'Estoque': { read: false, write: false }, 'Relatorios': { read: true, write: false },
            'NPS': { read: false, write: false }, 'Administracao': { read: false, write: false },
            'Comunicacao': { read: true, write: true }, 'Enfermagem': { read: false, write: false },
            'Analise de Dados': { read: false, write: false }, 'Gestao Clinica': { read: false, write: false }
        }
    }
];

const initialUsers = [
    { id: 1, nome: 'Carlos Administrador', email: 'carlos.admin@saude.gov.br', cpf: '111.222.333-44', roleId: 1, status: 'ativo', ultimoLogin: '2026-03-14T08:30:00' },
    { id: 2, nome: 'Dr. Joao Silva', email: 'joao.silva@saude.gov.br', cpf: '222.333.444-55', roleId: 2, status: 'ativo', ultimoLogin: '2026-03-14T07:45:00' },
    { id: 3, nome: 'Dra. Ana Oliveira', email: 'ana.oliveira@saude.gov.br', cpf: '333.444.555-66', roleId: 2, status: 'ativo', ultimoLogin: '2026-03-13T16:20:00' },
    { id: 4, nome: 'Maria Santos', email: 'maria.santos@saude.gov.br', cpf: '444.555.666-77', roleId: 3, status: 'ativo', ultimoLogin: '2026-03-14T06:50:00' },
    { id: 5, nome: 'Pedro Ferreira', email: 'pedro.ferreira@saude.gov.br', cpf: '555.666.777-88', roleId: 4, status: 'ativo', ultimoLogin: '2026-03-13T14:30:00' },
    { id: 6, nome: 'Juliana Lima', email: 'juliana.lima@saude.gov.br', cpf: '666.777.888-99', roleId: 5, status: 'ativo', ultimoLogin: '2026-03-14T08:00:00' },
    { id: 7, nome: 'Dr. Rafael Costa', email: 'rafael.costa@saude.gov.br', cpf: '777.888.999-00', roleId: 6, status: 'inativo', ultimoLogin: '2026-02-28T11:00:00' },
    { id: 8, nome: 'Fernanda Almeida', email: 'fernanda.almeida@saude.gov.br', cpf: '888.999.000-11', roleId: 7, status: 'ativo', ultimoLogin: '2026-03-14T09:15:00' },
    { id: 9, nome: 'Lucas Rodrigues', email: 'lucas.rodrigues@saude.gov.br', cpf: '999.000.111-22', roleId: 8, status: 'ativo', ultimoLogin: '2026-03-13T17:00:00' },
    { id: 10, nome: 'Beatriz Martins', email: 'beatriz.martins@saude.gov.br', cpf: '000.111.222-33', roleId: 3, status: 'inativo', ultimoLogin: '2026-01-20T10:45:00' },
];

function formatDateTime(isoStr) {
    if (!isoStr) return 'Nunca';
    const d = new Date(isoStr);
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export default function Usuarios() {
    const [users, setUsers] = useState(initialUsers);
    const [roles, setRoles] = useState(initialRoles);
    const [activeTab, setActiveTab] = useState('users');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    // Add user form
    const [formName, setFormName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formCpf, setFormCpf] = useState('');
    const [formRoleId, setFormRoleId] = useState(2);
    const [formPassword, setFormPassword] = useState('');

    const filteredUsers = useMemo(() => {
        let result = users.map(u => ({
            ...u,
            role: roles.find(r => r.id === u.roleId)
        }));
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(u => u.nome.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
        }
        if (filterRole) {
            result = result.filter(u => u.roleId === parseInt(filterRole));
        }
        if (filterStatus) {
            result = result.filter(u => u.status === filterStatus);
        }
        return result;
    }, [users, roles, searchTerm, filterRole, filterStatus]);

    const handleAddUser = () => {
        if (!formName || !formEmail || !formRoleId) return;
        const newUser = {
            id: Math.max(...users.map(u => u.id)) + 1,
            nome: formName,
            email: formEmail,
            cpf: formCpf,
            roleId: parseInt(formRoleId),
            status: 'ativo',
            ultimoLogin: null,
        };
        setUsers([...users, newUser]);
        setFormName('');
        setFormEmail('');
        setFormCpf('');
        setFormRoleId(2);
        setFormPassword('');
        setShowAddModal(false);
    };

    const handleEditUser = () => {
        if (!editingUser) return;
        setUsers(users.map(u =>
            u.id === editingUser.id
                ? { ...u, nome: editingUser.nome, email: editingUser.email, roleId: editingUser.roleId, status: editingUser.status }
                : u
        ));
        setShowEditModal(false);
        setEditingUser(null);
    };

    const handleDeactivate = (userId) => {
        setUsers(users.map(u => u.id === userId ? { ...u, status: 'inativo' } : u));
    };

    const openEditModal = (user) => {
        setEditingUser({ ...user });
        setShowEditModal(true);
    };

    const handlePermissionChange = (roleId, moduleName, permType) => {
        setRoles(roles.map(r => {
            if (r.id !== roleId) return r;
            const current = r.permissions[moduleName]?.[permType] || false;
            return {
                ...r,
                permissions: {
                    ...r.permissions,
                    [moduleName]: {
                        ...r.permissions[moduleName],
                        [permType]: !current,
                        ...(permType === 'write' && !current ? { read: true } : {}),
                        ...(permType === 'read' && current ? { write: false } : {})
                    }
                }
            };
        }));
    };

    const activeCount = users.filter(u => u.status === 'ativo').length;
    const inactiveCount = users.filter(u => u.status === 'inativo').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        <Shield className="mr-2 inline-block h-6 w-6 text-primary" />
                        Gestao de Usuarios
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">Gerenciamento de usuarios e permissoes (RF24)</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
                >
                    <UserPlus className="h-4 w-4" /> Novo Usuario
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Usuarios</p>
                            <h2 className="my-1 text-3xl font-bold text-foreground">{users.length}</h2>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Ativos</p>
                            <h2 className="my-1 text-3xl font-bold text-emerald-600">{activeCount}</h2>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                            <ShieldCheck className="h-5 w-5 text-emerald-600" />
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Inativos</p>
                            <h2 className="my-1 text-3xl font-bold text-red-600">{inactiveCount}</h2>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                            <ShieldAlert className="h-5 w-5 text-red-600" />
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Perfis</p>
                            <h2 className="my-1 text-3xl font-bold text-foreground">{roles.length}</h2>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100">
                            <Settings className="h-5 w-5 text-violet-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 rounded-lg border border-border bg-muted p-1">
                <button
                    onClick={() => setActiveTab('users')}
                    className={cn(
                        'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                        activeTab === 'users' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    )}
                >
                    <Users className="mr-1.5 inline-block h-4 w-4" /> Usuarios
                </button>
                <button
                    onClick={() => setActiveTab('permissions')}
                    className={cn(
                        'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                        activeTab === 'permissions' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    )}
                >
                    <Shield className="mr-1.5 inline-block h-4 w-4" /> Matriz de Permissoes
                </button>
            </div>

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="rounded-xl border border-border bg-card shadow-sm">
                    {/* Search and Filter Bar */}
                    <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Buscar por nome ou email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-10 w-full rounded-lg border border-input bg-white pl-9 pr-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="h-10 w-auto rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="">Todos os perfis</option>
                            {roles.map(r => (
                                <option key={r.id} value={r.id}>{r.nome}</option>
                            ))}
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="h-10 w-auto rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="">Todos os status</option>
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                        </select>
                    </div>

                    {/* Users Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b border-border bg-muted/50">
                                <tr>
                                    <th className="px-5 py-3 text-left font-medium">Nome</th>
                                    <th className="px-5 py-3 text-left font-medium">Email</th>
                                    <th className="px-5 py-3 text-left font-medium">Perfil</th>
                                    <th className="px-5 py-3 text-left font-medium">Status</th>
                                    <th className="px-5 py-3 text-left font-medium">Ultimo Login</th>
                                    <th className="px-5 py-3 text-center font-medium">Acoes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-muted/30">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                    {user.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                                </div>
                                                <strong>{user.nome}</strong>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-muted-foreground">{user.email}</td>
                                        <td className="px-5 py-3">
                                            <span
                                                className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium text-white"
                                                style={{ backgroundColor: user.role?.cor || '#6b7280' }}
                                            >
                                                {user.role?.nome || 'Sem perfil'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={cn(
                                                'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium',
                                                user.status === 'ativo'
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'bg-red-50 text-red-700'
                                            )}>
                                                {user.status === 'ativo' ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="h-3.5 w-3.5" />
                                                {formatDateTime(user.ultimoLogin)}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                                    title="Editar"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                {user.status === 'ativo' && (
                                                    <button
                                                        onClick={() => handleDeactivate(user.id)}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-600"
                                                        title="Desativar"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
                                            Nenhum usuario encontrado com os filtros selecionados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Permissions Matrix Tab */}
            {activeTab === 'permissions' && (
                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <div className="border-b border-border bg-muted px-5 py-3 text-sm font-semibold">
                        <Shield className="mr-1.5 inline-block h-4 w-4" /> Matriz de Permissoes por Perfil
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b border-border bg-muted/50">
                                <tr>
                                    <th className="sticky left-0 z-10 min-w-[160px] bg-muted/50 px-4 py-3 text-left font-medium">Modulo</th>
                                    {roles.map(role => (
                                        <th key={role.id} className="min-w-[100px] px-2 py-3 text-center" colSpan={1}>
                                            <span
                                                className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium text-white"
                                                style={{ backgroundColor: role.cor }}
                                            >
                                                {role.nome}
                                            </span>
                                        </th>
                                    ))}
                                </tr>
                                <tr className="border-b border-border">
                                    <th className="sticky left-0 z-10 bg-muted/50 px-4 py-1" />
                                    {roles.map(role => (
                                        <th key={role.id} className="px-2 py-1">
                                            <div className="flex justify-center gap-2 text-xs text-muted-foreground">
                                                <span title="Leitura">L</span>
                                                <span title="Escrita">E</span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {modules.map((mod) => (
                                    <tr key={mod} className="hover:bg-muted/30">
                                        <td className="sticky left-0 z-10 bg-card px-4 py-2.5 font-medium">{mod}</td>
                                        {roles.map(role => {
                                            const perm = role.permissions[mod] || { read: false, write: false };
                                            return (
                                                <td key={role.id} className="px-2 py-2.5">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handlePermissionChange(role.id, mod, 'read')}
                                                            className={cn(
                                                                'flex h-6 w-6 items-center justify-center rounded border transition-colors',
                                                                perm.read
                                                                    ? 'border-emerald-400 bg-emerald-50 text-emerald-600'
                                                                    : 'border-border bg-white text-muted-foreground hover:border-gray-400'
                                                            )}
                                                            title={`Leitura - ${mod}`}
                                                        >
                                                            {perm.read ? <Check className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                                                        </button>
                                                        <button
                                                            onClick={() => handlePermissionChange(role.id, mod, 'write')}
                                                            className={cn(
                                                                'flex h-6 w-6 items-center justify-center rounded border transition-colors',
                                                                perm.write
                                                                    ? 'border-blue-400 bg-blue-50 text-blue-600'
                                                                    : 'border-border bg-white text-muted-foreground hover:border-gray-400'
                                                            )}
                                                            title={`Escrita - ${mod}`}
                                                        >
                                                            {perm.write ? <Check className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                                                        </button>
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex items-center gap-4 border-t border-border px-5 py-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-emerald-400 bg-emerald-50">
                                <Check className="h-3 w-3 text-emerald-600" />
                            </span>
                            L = Leitura
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-blue-400 bg-blue-50">
                                <Check className="h-3 w-3 text-blue-600" />
                            </span>
                            E = Escrita
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-border bg-white">
                                <Minus className="h-3 w-3 text-muted-foreground" />
                            </span>
                            Sem acesso
                        </div>
                    </div>
                </div>
            )}

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-lg rounded-xl border border-border bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-border px-6 py-4">
                            <h2 className="text-lg font-semibold text-foreground">
                                <UserPlus className="mr-2 inline-block h-5 w-5 text-primary" />
                                Novo Usuario
                            </h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="space-y-4 p-6">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-foreground">Nome Completo</label>
                                <input
                                    type="text"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder="Nome do usuario"
                                    className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                                <input
                                    type="email"
                                    value={formEmail}
                                    onChange={(e) => setFormEmail(e.target.value)}
                                    placeholder="email@saude.gov.br"
                                    className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-foreground">CPF</label>
                                <input
                                    type="text"
                                    value={formCpf}
                                    onChange={(e) => setFormCpf(e.target.value)}
                                    placeholder="000.000.000-00"
                                    className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-foreground">Perfil</label>
                                <select
                                    value={formRoleId}
                                    onChange={(e) => setFormRoleId(e.target.value)}
                                    className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    {roles.map(r => (
                                        <option key={r.id} value={r.id}>{r.nome}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-foreground">Senha Temporaria</label>
                                <input
                                    type="text"
                                    value={formPassword}
                                    onChange={(e) => setFormPassword(e.target.value)}
                                    placeholder="Senha inicial do usuario"
                                    className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAddUser}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                            >
                                <UserPlus className="h-4 w-4" /> Criar Usuario
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-lg rounded-xl border border-border bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-border px-6 py-4">
                            <h2 className="text-lg font-semibold text-foreground">
                                <Edit className="mr-2 inline-block h-5 w-5 text-primary" />
                                Editar Usuario
                            </h2>
                            <button
                                onClick={() => { setShowEditModal(false); setEditingUser(null); }}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="space-y-4 p-6">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-foreground">Nome</label>
                                <input
                                    type="text"
                                    value={editingUser.nome}
                                    onChange={(e) => setEditingUser({ ...editingUser, nome: e.target.value })}
                                    className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-foreground">Perfil</label>
                                <select
                                    value={editingUser.roleId}
                                    onChange={(e) => setEditingUser({ ...editingUser, roleId: parseInt(e.target.value) })}
                                    className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    {roles.map(r => (
                                        <option key={r.id} value={r.id}>{r.nome}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-foreground">Status</label>
                                <select
                                    value={editingUser.status}
                                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                                    className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="ativo">Ativo</option>
                                    <option value="inativo">Inativo</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-foreground">Redefinir Senha</label>
                                <input
                                    type="text"
                                    placeholder="Nova senha temporaria (opcional)"
                                    className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
                            <button
                                onClick={() => { setShowEditModal(false); setEditingUser(null); }}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleEditUser}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                            >
                                <Check className="h-4 w-4" /> Salvar Alteracoes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
