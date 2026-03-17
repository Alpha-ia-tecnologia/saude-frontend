import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin, Users, Home, AlertTriangle, Plus, Search, X,
  HeartPulse, Baby, Brain, Activity, Eye, ChevronRight,
  Shield, UserCheck, Building2, TrendingUp, TrendingDown,
  Star, Award, Calendar, ClipboardList, BarChart3, Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

// ── Fix Leaflet default marker icon ──────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ── Custom colored marker ────────────────────────────────────────
function createColorIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="background:${color};width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function createUbsIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="background:${color};width:36px;height:36px;border-radius:8px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9h1"/><path d="M9 13h1"/><path d="M9 17h1"/></svg>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

// ── UBS (Unidades Básicas de Saúde) - São Luís, Maranhão ─────────
// Coordenadas baseadas na localização real de cada bairro na ilha
const ubsData = [
  // ── Zona Central / Histórica ──
  { id: 1, nome: 'UBS Centro Histórico', bairro: 'Centro', cor: '#0054A6', lat: -2.5297, lng: -44.3028, raio: 400, responsavel: 'Dra. Helena Martins', telefone: '(98) 3232-1001', microareas: 3, agentes: 3, familias: 220, populacao: 880 },
  { id: 2, nome: 'UBS Praia Grande', bairro: 'Praia Grande', cor: '#1D4ED8', lat: -2.5270, lng: -44.3090, raio: 350, responsavel: 'Dr. Antônio Reis', telefone: '(98) 3232-1002', microareas: 2, agentes: 2, familias: 160, populacao: 640 },
  { id: 3, nome: 'UBS Desterro', bairro: 'Desterro', cor: '#0891B2', lat: -2.5230, lng: -44.2970, raio: 350, responsavel: 'Dra. Lúcia Campos', telefone: '(98) 3232-1003', microareas: 2, agentes: 2, familias: 140, populacao: 560 },
  // ── Zona Leste / Praias ──
  { id: 4, nome: 'UBS Turu', bairro: 'Turu', cor: '#8B5CF6', lat: -2.5264, lng: -44.2203, raio: 550, responsavel: 'Dra. Fernanda Reis', telefone: '(98) 3232-1004', microareas: 4, agentes: 4, familias: 380, populacao: 1520 },
  { id: 5, nome: 'UBS Cohama', bairro: 'Cohama', cor: '#7C3AED', lat: -2.5138, lng: -44.2497, raio: 500, responsavel: 'Dr. Ricardo Alves', telefone: '(98) 3232-1005', microareas: 3, agentes: 3, familias: 290, populacao: 1160 },
  { id: 6, nome: 'UBS Renascença', bairro: 'Renascença', cor: '#6366F1', lat: -2.5030, lng: -44.2720, raio: 500, responsavel: 'Dra. Marina Costa', telefone: '(98) 3232-1006', microareas: 3, agentes: 3, familias: 250, populacao: 1000 },
  { id: 7, nome: 'UBS Calhau', bairro: 'Calhau', cor: '#2563EB', lat: -2.4910, lng: -44.2130, raio: 550, responsavel: 'Dr. Bruno Soares', telefone: '(98) 3232-1007', microareas: 3, agentes: 3, familias: 270, populacao: 1080 },
  { id: 8, nome: 'UBS Olho d\'Água', bairro: 'Olho d\'Água', cor: '#0EA5E9', lat: -2.5050, lng: -44.1950, raio: 600, responsavel: 'Dra. Patrícia Mendes', telefone: '(98) 3232-1008', microareas: 4, agentes: 4, familias: 340, populacao: 1360 },
  // ── Zona Norte / Anil ──
  { id: 9, nome: 'UBS Cohab Anil', bairro: 'Cohab Anil', cor: '#06B6D4', lat: -2.4880, lng: -44.2700, raio: 500, responsavel: 'Dr. Marcos Oliveira', telefone: '(98) 3232-1009', microareas: 3, agentes: 3, familias: 260, populacao: 1040 },
  { id: 10, nome: 'UBS Anil', bairro: 'Anil', cor: '#14B8A6', lat: -2.4950, lng: -44.2560, raio: 450, responsavel: 'Dra. Carla Souza', telefone: '(98) 3232-1010', microareas: 3, agentes: 3, familias: 240, populacao: 960 },
  // ── Zona Sul ──
  { id: 11, nome: 'UBS Angelim', bairro: 'Angelim', cor: '#10B981', lat: -2.5450, lng: -44.2460, raio: 550, responsavel: 'Dr. Pedro Nascimento', telefone: '(98) 3232-1011', microareas: 3, agentes: 3, familias: 310, populacao: 1240 },
  { id: 12, nome: 'UBS Aurora', bairro: 'Aurora', cor: '#00A651', lat: -2.5360, lng: -44.2640, raio: 500, responsavel: 'Dra. Sandra Lima', telefone: '(98) 3232-1012', microareas: 3, agentes: 3, familias: 280, populacao: 1120 },
  // ── Zona Oeste ──
  { id: 13, nome: 'UBS Vila Palmeira', bairro: 'Vila Palmeira', cor: '#F59E0B', lat: -2.5400, lng: -44.2920, raio: 450, responsavel: 'Dr. Paulo Henrique', telefone: '(98) 3232-1013', microareas: 3, agentes: 3, familias: 300, populacao: 1200 },
  { id: 14, nome: 'UBS Liberdade', bairro: 'Liberdade', cor: '#EAB308', lat: -2.5340, lng: -44.2830, raio: 400, responsavel: 'Dra. Juliana Cardoso', telefone: '(98) 3232-1014', microareas: 3, agentes: 3, familias: 250, populacao: 1000 },
  { id: 15, nome: 'UBS Fátima', bairro: 'Fátima', cor: '#D97706', lat: -2.5480, lng: -44.2810, raio: 400, responsavel: 'Dr. Gustavo Rocha', telefone: '(98) 3232-1015', microareas: 2, agentes: 2, familias: 190, populacao: 760 },
  // ── Zona Periférica ──
  { id: 16, nome: 'UBS Cidade Operária', bairro: 'Cidade Operária', cor: '#E63946', lat: -2.5580, lng: -44.2180, raio: 700, responsavel: 'Dra. Amanda Barbosa', telefone: '(98) 3232-1016', microareas: 5, agentes: 5, familias: 420, populacao: 1680 },
  { id: 17, nome: 'UBS Coroadinho', bairro: 'Coroadinho', cor: '#DC2626', lat: -2.5631, lng: -44.2621, raio: 600, responsavel: 'Dr. Rafael Teixeira', telefone: '(98) 3232-1017', microareas: 4, agentes: 4, familias: 380, populacao: 1520 },
  { id: 18, nome: 'UBS Vila Maranhão', bairro: 'Vila Maranhão', cor: '#B91C1C', lat: -2.5850, lng: -44.3150, raio: 650, responsavel: 'Dra. Isabela Lima', telefone: '(98) 3232-1018', microareas: 4, agentes: 3, familias: 350, populacao: 1400 },
  { id: 19, nome: 'UBS São Cristóvão', bairro: 'São Cristóvão', cor: '#BE185D', lat: -2.4800, lng: -44.2380, raio: 550, responsavel: 'Dr. Thiago Ferreira', telefone: '(98) 3232-1019', microareas: 3, agentes: 3, familias: 280, populacao: 1120 },
  { id: 20, nome: 'UBS Maiobão', bairro: 'Maiobão', cor: '#9333EA', lat: -2.5780, lng: -44.2350, raio: 700, responsavel: 'Dra. Camila Duarte', telefone: '(98) 3232-1020', microareas: 5, agentes: 4, familias: 450, populacao: 1800 },
];

// ── Agentes de Saúde ─────────────────────────────────────────────
const agentesData = [
  // UBS 1 - Centro Histórico
  { id: 1, nome: 'Ana Paula Souza', cpf: '123.456.789-01', ubsId: 1, microarea: 'MA-001', lat: -2.5120, lng: -44.2800, familias: 75, visitas: 42, cobertura: 95, metaVisitas: 45, pendencias: 2, avaliacao: 4.8, status: 'Ativo', admissao: '2020-03-15' },
  { id: 2, nome: 'Carlos Eduardo Lima', cpf: '234.567.890-12', ubsId: 1, microarea: 'MA-002', lat: -2.5160, lng: -44.2840, familias: 72, visitas: 38, cobertura: 88, metaVisitas: 45, pendencias: 5, avaliacao: 4.2, status: 'Ativo', admissao: '2019-08-01' },
  { id: 3, nome: 'Maria Fernanda Oliveira', cpf: '345.678.901-23', ubsId: 1, microarea: 'MA-003', lat: -2.5150, lng: -44.2790, familias: 73, visitas: 44, cobertura: 97, metaVisitas: 45, pendencias: 1, avaliacao: 4.9, status: 'Ativo', admissao: '2018-02-10' },
  // UBS 2 - Praia Grande
  { id: 4, nome: 'José Roberto Santos', cpf: '456.789.012-34', ubsId: 2, microarea: 'MA-004', lat: -2.5170, lng: -44.2860, familias: 80, visitas: 30, cobertura: 78, metaVisitas: 45, pendencias: 8, avaliacao: 3.5, status: 'Ativo', admissao: '2021-06-20' },
  { id: 5, nome: 'Patrícia Mendes', cpf: '567.890.123-45', ubsId: 2, microarea: 'MA-005', lat: -2.5210, lng: -44.2900, familias: 80, visitas: 40, cobertura: 92, metaVisitas: 45, pendencias: 3, avaliacao: 4.5, status: 'Ativo', admissao: '2020-01-10' },
  // UBS 3 - Desterro
  { id: 6, nome: 'Roberto Alves', cpf: '678.901.234-56', ubsId: 3, microarea: 'MA-006', lat: -2.5060, lng: -44.2760, familias: 70, visitas: 35, cobertura: 85, metaVisitas: 45, pendencias: 6, avaliacao: 4.0, status: 'Ativo', admissao: '2019-11-05' },
  { id: 7, nome: 'Luciana Ferreira', cpf: '789.012.345-67', ubsId: 3, microarea: 'MA-007', lat: -2.5100, lng: -44.2800, familias: 70, visitas: 43, cobertura: 96, metaVisitas: 45, pendencias: 1, avaliacao: 4.7, status: 'Ativo', admissao: '2017-04-22' },
  // UBS 4 - Turu
  { id: 8, nome: 'Fernando Costa', cpf: '890.123.456-78', ubsId: 4, microarea: 'MA-008', lat: -2.5120, lng: -44.2320, familias: 95, visitas: 41, cobertura: 90, metaVisitas: 45, pendencias: 4, avaliacao: 4.3, status: 'Ativo', admissao: '2018-09-14' },
  { id: 9, nome: 'Daniela Nascimento', cpf: '901.234.567-89', ubsId: 4, microarea: 'MA-009', lat: -2.5170, lng: -44.2380, familias: 95, visitas: 45, cobertura: 100, metaVisitas: 45, pendencias: 0, avaliacao: 5.0, status: 'Ativo', admissao: '2020-07-30' },
  { id: 10, nome: 'Marcos Araújo', cpf: '012.345.678-90', ubsId: 4, microarea: 'MA-010', lat: -2.5140, lng: -44.2300, familias: 95, visitas: 26, cobertura: 72, metaVisitas: 45, pendencias: 12, avaliacao: 3.2, status: 'Afastado', admissao: '2021-01-18' },
  { id: 11, nome: 'Vinícius Martins', cpf: '666.777.888-99', ubsId: 4, microarea: 'MA-011', lat: -2.5160, lng: -44.2340, familias: 95, visitas: 32, cobertura: 80, metaVisitas: 45, pendencias: 7, avaliacao: 3.8, status: 'Ativo', admissao: '2021-09-01' },
  // UBS 5 - Cohama
  { id: 12, nome: 'Juliana Cardoso', cpf: '111.222.333-44', ubsId: 5, microarea: 'MA-012', lat: -2.5030, lng: -44.2220, familias: 97, visitas: 44, cobertura: 98, metaVisitas: 45, pendencias: 0, avaliacao: 5.0, status: 'Ativo', admissao: '2016-03-01' },
  { id: 13, nome: 'Rafael Teixeira', cpf: '222.333.444-55', ubsId: 5, microarea: 'MA-013', lat: -2.5070, lng: -44.2280, familias: 97, visitas: 37, cobertura: 84, metaVisitas: 45, pendencias: 4, avaliacao: 4.1, status: 'Ativo', admissao: '2019-05-10' },
  { id: 14, nome: 'Amanda Barbosa', cpf: '333.444.555-66', ubsId: 5, microarea: 'MA-014', lat: -2.5040, lng: -44.2260, familias: 96, visitas: 43, cobertura: 94, metaVisitas: 45, pendencias: 2, avaliacao: 4.6, status: 'Ativo', admissao: '2018-11-20' },
  // UBS 6 - Renascença
  { id: 15, nome: 'Thiago Rocha', cpf: '444.555.666-77', ubsId: 6, microarea: 'MA-015', lat: -2.4960, lng: -44.2570, familias: 83, visitas: 40, cobertura: 91, metaVisitas: 45, pendencias: 3, avaliacao: 4.4, status: 'Ativo', admissao: '2020-02-14' },
  { id: 16, nome: 'Camila Duarte', cpf: '555.666.777-88', ubsId: 6, microarea: 'MA-016', lat: -2.4990, lng: -44.2630, familias: 84, visitas: 42, cobertura: 93, metaVisitas: 45, pendencias: 1, avaliacao: 4.7, status: 'Ativo', admissao: '2017-07-05' },
  { id: 17, nome: 'Renata Farias', cpf: '100.200.300-40', ubsId: 6, microarea: 'MA-017', lat: -2.5000, lng: -44.2590, familias: 83, visitas: 39, cobertura: 89, metaVisitas: 45, pendencias: 4, avaliacao: 4.3, status: 'Ativo', admissao: '2019-01-15' },
  // UBS 7 - Calhau
  { id: 18, nome: 'Isabela Lima', cpf: '777.888.999-00', ubsId: 7, microarea: 'MA-018', lat: -2.4850, lng: -44.2250, familias: 90, visitas: 42, cobertura: 93, metaVisitas: 45, pendencias: 2, avaliacao: 4.7, status: 'Ativo', admissao: '2019-04-12' },
  { id: 19, nome: 'Gustavo Pereira', cpf: '888.999.000-11', ubsId: 7, microarea: 'MA-019', lat: -2.4890, lng: -44.2310, familias: 90, visitas: 36, cobertura: 86, metaVisitas: 45, pendencias: 5, avaliacao: 4.0, status: 'Ativo', admissao: '2020-10-08' },
  { id: 20, nome: 'Larissa Santos', cpf: '999.000.111-22', ubsId: 7, microarea: 'MA-020', lat: -2.4870, lng: -44.2270, familias: 90, visitas: 44, cobertura: 97, metaVisitas: 45, pendencias: 1, avaliacao: 4.8, status: 'Ativo', admissao: '2018-06-15' },
  // UBS 8 - Olho d'Água
  { id: 21, nome: 'Diego Monteiro', cpf: '101.202.303-04', ubsId: 8, microarea: 'MA-021', lat: -2.4930, lng: -44.2070, familias: 85, visitas: 41, cobertura: 92, metaVisitas: 45, pendencias: 3, avaliacao: 4.5, status: 'Ativo', admissao: '2019-03-20' },
  { id: 22, nome: 'Tatiane Ribeiro', cpf: '202.303.404-05', ubsId: 8, microarea: 'MA-022', lat: -2.4970, lng: -44.2130, familias: 85, visitas: 38, cobertura: 87, metaVisitas: 45, pendencias: 5, avaliacao: 4.1, status: 'Ativo', admissao: '2020-06-10' },
  { id: 23, nome: 'Fábio Correia', cpf: '303.404.505-06', ubsId: 8, microarea: 'MA-023', lat: -2.4950, lng: -44.2080, familias: 85, visitas: 44, cobertura: 96, metaVisitas: 45, pendencias: 1, avaliacao: 4.8, status: 'Ativo', admissao: '2017-11-01' },
  { id: 24, nome: 'Aline Moura', cpf: '404.505.606-07', ubsId: 8, microarea: 'MA-024', lat: -2.4960, lng: -44.2110, familias: 85, visitas: 33, cobertura: 81, metaVisitas: 45, pendencias: 6, avaliacao: 3.9, status: 'Ativo', admissao: '2021-04-15' },
  // UBS 9 - Cohab Anil
  { id: 25, nome: 'Sérgio Matos', cpf: '505.606.707-08', ubsId: 9, microarea: 'MA-025', lat: -2.4930, lng: -44.2620, familias: 87, visitas: 40, cobertura: 90, metaVisitas: 45, pendencias: 3, avaliacao: 4.4, status: 'Ativo', admissao: '2018-08-20' },
  { id: 26, nome: 'Cláudia Bezerra', cpf: '606.707.808-09', ubsId: 9, microarea: 'MA-026', lat: -2.4970, lng: -44.2680, familias: 87, visitas: 43, cobertura: 95, metaVisitas: 45, pendencias: 1, avaliacao: 4.7, status: 'Ativo', admissao: '2019-02-05' },
  { id: 27, nome: 'Edmilson Sousa', cpf: '707.808.909-10', ubsId: 9, microarea: 'MA-027', lat: -2.4950, lng: -44.2650, familias: 86, visitas: 36, cobertura: 84, metaVisitas: 45, pendencias: 5, avaliacao: 4.0, status: 'Ativo', admissao: '2020-09-01' },
  // UBS 10 - Anil
  { id: 28, nome: 'Priscila Gomes', cpf: '808.909.010-11', ubsId: 10, microarea: 'MA-028', lat: -2.4830, lng: -44.2520, familias: 80, visitas: 41, cobertura: 91, metaVisitas: 45, pendencias: 3, avaliacao: 4.5, status: 'Ativo', admissao: '2018-05-10' },
  { id: 29, nome: 'Anderson Pinto', cpf: '909.010.111-12', ubsId: 10, microarea: 'MA-029', lat: -2.4870, lng: -44.2580, familias: 80, visitas: 38, cobertura: 88, metaVisitas: 45, pendencias: 4, avaliacao: 4.2, status: 'Ativo', admissao: '2019-07-22' },
  { id: 30, nome: 'Vanessa Cruz', cpf: '010.111.222-13', ubsId: 10, microarea: 'MA-030', lat: -2.4850, lng: -44.2550, familias: 80, visitas: 44, cobertura: 97, metaVisitas: 45, pendencias: 0, avaliacao: 4.9, status: 'Ativo', admissao: '2017-02-15' },
  // UBS 11 - Angelim
  { id: 31, nome: 'Leandro Silva', cpf: '111.212.313-14', ubsId: 11, microarea: 'MA-031', lat: -2.5330, lng: -44.2420, familias: 103, visitas: 39, cobertura: 86, metaVisitas: 45, pendencias: 6, avaliacao: 4.0, status: 'Ativo', admissao: '2020-01-20' },
  { id: 32, nome: 'Rosana Carvalho', cpf: '212.313.414-15', ubsId: 11, microarea: 'MA-032', lat: -2.5370, lng: -44.2480, familias: 104, visitas: 43, cobertura: 94, metaVisitas: 45, pendencias: 2, avaliacao: 4.6, status: 'Ativo', admissao: '2018-10-05' },
  { id: 33, nome: 'Wellington Barros', cpf: '313.414.515-16', ubsId: 11, microarea: 'MA-033', lat: -2.5350, lng: -44.2450, familias: 103, visitas: 35, cobertura: 82, metaVisitas: 45, pendencias: 7, avaliacao: 3.7, status: 'Ativo', admissao: '2021-03-10' },
  // UBS 12 - Aurora
  { id: 34, nome: 'Miriam Lopes', cpf: '414.515.616-17', ubsId: 12, microarea: 'MA-034', lat: -2.5230, lng: -44.2570, familias: 93, visitas: 42, cobertura: 93, metaVisitas: 45, pendencias: 2, avaliacao: 4.6, status: 'Ativo', admissao: '2019-06-15' },
  { id: 35, nome: 'Paulo César Nunes', cpf: '515.616.717-18', ubsId: 12, microarea: 'MA-035', lat: -2.5270, lng: -44.2630, familias: 94, visitas: 40, cobertura: 90, metaVisitas: 45, pendencias: 3, avaliacao: 4.3, status: 'Ativo', admissao: '2020-04-08' },
  { id: 36, nome: 'Beatriz Fonseca', cpf: '616.717.818-19', ubsId: 12, microarea: 'MA-036', lat: -2.5250, lng: -44.2600, familias: 93, visitas: 44, cobertura: 96, metaVisitas: 45, pendencias: 1, avaliacao: 4.8, status: 'Ativo', admissao: '2017-09-20' },
  // UBS 13 - Vila Palmeira
  { id: 37, nome: 'Adriano Machado', cpf: '717.818.919-20', ubsId: 13, microarea: 'MA-037', lat: -2.5180, lng: -44.3020, familias: 100, visitas: 41, cobertura: 91, metaVisitas: 45, pendencias: 3, avaliacao: 4.4, status: 'Ativo', admissao: '2018-12-01' },
  { id: 38, nome: 'Eliane Cunha', cpf: '818.919.020-21', ubsId: 13, microarea: 'MA-038', lat: -2.5220, lng: -44.3080, familias: 100, visitas: 37, cobertura: 85, metaVisitas: 45, pendencias: 5, avaliacao: 4.1, status: 'Ativo', admissao: '2019-10-15' },
  { id: 39, nome: 'Rogério Dias', cpf: '919.020.121-22', ubsId: 13, microarea: 'MA-039', lat: -2.5200, lng: -44.3050, familias: 100, visitas: 44, cobertura: 97, metaVisitas: 45, pendencias: 1, avaliacao: 4.8, status: 'Ativo', admissao: '2017-06-10' },
  // UBS 14 - Liberdade
  { id: 40, nome: 'Sandra Moreira', cpf: '020.121.222-23', ubsId: 14, microarea: 'MA-040', lat: -2.5100, lng: -44.2950, familias: 83, visitas: 40, cobertura: 90, metaVisitas: 45, pendencias: 3, avaliacao: 4.4, status: 'Ativo', admissao: '2019-05-20' },
  { id: 41, nome: 'Marcelo Freitas', cpf: '121.222.323-24', ubsId: 14, microarea: 'MA-041', lat: -2.5140, lng: -44.3010, familias: 84, visitas: 43, cobertura: 95, metaVisitas: 45, pendencias: 1, avaliacao: 4.7, status: 'Ativo', admissao: '2018-03-12' },
  { id: 42, nome: 'Francisca Araújo', cpf: '222.323.424-25', ubsId: 14, microarea: 'MA-042', lat: -2.5120, lng: -44.2980, familias: 83, visitas: 34, cobertura: 82, metaVisitas: 45, pendencias: 6, avaliacao: 3.9, status: 'Ativo', admissao: '2021-01-05' },
  // UBS 15 - Fátima
  { id: 43, nome: 'Henrique Vasconcelos', cpf: '323.424.525-26', ubsId: 15, microarea: 'MA-043', lat: -2.5060, lng: -44.3070, familias: 95, visitas: 42, cobertura: 93, metaVisitas: 45, pendencias: 2, avaliacao: 4.6, status: 'Ativo', admissao: '2019-08-20' },
  { id: 44, nome: 'Lúcia Pimentel', cpf: '424.525.626-27', ubsId: 15, microarea: 'MA-044', lat: -2.5100, lng: -44.3130, familias: 95, visitas: 39, cobertura: 88, metaVisitas: 45, pendencias: 4, avaliacao: 4.2, status: 'Ativo', admissao: '2020-05-15' },
  // UBS 16 - Cidade Operária
  { id: 45, nome: 'Jorge Nascimento', cpf: '525.626.727-28', ubsId: 16, microarea: 'MA-045', lat: -2.5420, lng: -44.2170, familias: 84, visitas: 40, cobertura: 88, metaVisitas: 45, pendencias: 5, avaliacao: 4.1, status: 'Ativo', admissao: '2019-04-10' },
  { id: 46, nome: 'Simone Ramos', cpf: '626.727.828-29', ubsId: 16, microarea: 'MA-046', lat: -2.5470, lng: -44.2230, familias: 84, visitas: 43, cobertura: 94, metaVisitas: 45, pendencias: 2, avaliacao: 4.6, status: 'Ativo', admissao: '2018-07-22' },
  { id: 47, nome: 'Antônio Brito', cpf: '727.828.929-30', ubsId: 16, microarea: 'MA-047', lat: -2.5440, lng: -44.2190, familias: 84, visitas: 35, cobertura: 80, metaVisitas: 45, pendencias: 8, avaliacao: 3.6, status: 'Ativo', admissao: '2021-02-01' },
  { id: 48, nome: 'Conceição Vieira', cpf: '828.929.030-31', ubsId: 16, microarea: 'MA-048', lat: -2.5480, lng: -44.2210, familias: 84, visitas: 44, cobertura: 96, metaVisitas: 45, pendencias: 1, avaliacao: 4.8, status: 'Ativo', admissao: '2017-10-15' },
  { id: 49, nome: 'Reginaldo Costa', cpf: '929.030.131-32', ubsId: 16, microarea: 'MA-049', lat: -2.5460, lng: -44.2200, familias: 84, visitas: 28, cobertura: 70, metaVisitas: 45, pendencias: 10, avaliacao: 3.3, status: 'Afastado', admissao: '2022-01-10' },
  // UBS 17 - Coroadinho
  { id: 50, nome: 'Edna Marques', cpf: '030.131.232-33', ubsId: 17, microarea: 'MA-050', lat: -2.5280, lng: -44.2820, familias: 95, visitas: 41, cobertura: 90, metaVisitas: 45, pendencias: 4, avaliacao: 4.3, status: 'Ativo', admissao: '2018-06-01' },
  { id: 51, nome: 'Valdeci Aguiar', cpf: '131.232.333-34', ubsId: 17, microarea: 'MA-051', lat: -2.5320, lng: -44.2880, familias: 95, visitas: 38, cobertura: 86, metaVisitas: 45, pendencias: 6, avaliacao: 4.0, status: 'Ativo', admissao: '2019-12-10' },
  { id: 52, nome: 'Joana Pereira', cpf: '232.333.434-35', ubsId: 17, microarea: 'MA-052', lat: -2.5300, lng: -44.2850, familias: 95, visitas: 44, cobertura: 96, metaVisitas: 45, pendencias: 1, avaliacao: 4.8, status: 'Ativo', admissao: '2017-03-20' },
  { id: 53, nome: 'Domingos Lima', cpf: '333.434.535-36', ubsId: 17, microarea: 'MA-053', lat: -2.5310, lng: -44.2870, familias: 95, visitas: 30, cobertura: 76, metaVisitas: 45, pendencias: 9, avaliacao: 3.4, status: 'Ativo', admissao: '2021-07-15' },
  // UBS 18 - Vila Maranhão
  { id: 54, nome: 'Raimunda Figueiredo', cpf: '434.535.636-37', ubsId: 18, microarea: 'MA-054', lat: -2.5530, lng: -44.3170, familias: 117, visitas: 40, cobertura: 88, metaVisitas: 45, pendencias: 5, avaliacao: 4.1, status: 'Ativo', admissao: '2019-09-05' },
  { id: 55, nome: 'Manoel Oliveira', cpf: '535.636.737-38', ubsId: 18, microarea: 'MA-055', lat: -2.5570, lng: -44.3230, familias: 117, visitas: 43, cobertura: 94, metaVisitas: 45, pendencias: 2, avaliacao: 4.6, status: 'Ativo', admissao: '2018-04-20' },
  { id: 56, nome: 'Socorro Barros', cpf: '636.737.838-39', ubsId: 18, microarea: 'MA-056', lat: -2.5550, lng: -44.3200, familias: 116, visitas: 35, cobertura: 80, metaVisitas: 45, pendencias: 7, avaliacao: 3.8, status: 'Ativo', admissao: '2020-11-10' },
  // UBS 19 - São Cristóvão
  { id: 57, nome: 'Lucas Tavares', cpf: '737.838.939-40', ubsId: 19, microarea: 'MA-057', lat: -2.4830, lng: -44.2420, familias: 93, visitas: 42, cobertura: 93, metaVisitas: 45, pendencias: 2, avaliacao: 4.5, status: 'Ativo', admissao: '2019-01-25' },
  { id: 58, nome: 'Mariana Queiroz', cpf: '838.939.040-41', ubsId: 19, microarea: 'MA-058', lat: -2.4870, lng: -44.2480, familias: 94, visitas: 39, cobertura: 88, metaVisitas: 45, pendencias: 4, avaliacao: 4.2, status: 'Ativo', admissao: '2020-03-15' },
  { id: 59, nome: 'Alexandre Borges', cpf: '939.040.141-42', ubsId: 19, microarea: 'MA-059', lat: -2.4850, lng: -44.2450, familias: 93, visitas: 44, cobertura: 97, metaVisitas: 45, pendencias: 0, avaliacao: 4.9, status: 'Ativo', admissao: '2017-08-01' },
  // UBS 20 - Maiobão
  { id: 60, nome: 'Francisca Diniz', cpf: '040.141.242-43', ubsId: 20, microarea: 'MA-060', lat: -2.5580, lng: -44.2470, familias: 113, visitas: 38, cobertura: 84, metaVisitas: 45, pendencias: 6, avaliacao: 4.0, status: 'Ativo', admissao: '2019-07-10' },
  { id: 61, nome: 'Raimundo Soares', cpf: '141.242.343-44', ubsId: 20, microarea: 'MA-061', lat: -2.5620, lng: -44.2530, familias: 113, visitas: 42, cobertura: 92, metaVisitas: 45, pendencias: 3, avaliacao: 4.5, status: 'Ativo', admissao: '2018-11-20' },
  { id: 62, nome: 'Maria do Socorro', cpf: '242.343.444-45', ubsId: 20, microarea: 'MA-062', lat: -2.5600, lng: -44.2500, familias: 112, visitas: 44, cobertura: 97, metaVisitas: 45, pendencias: 1, avaliacao: 4.8, status: 'Ativo', admissao: '2017-05-15' },
  { id: 63, nome: 'José Carlos Mendes', cpf: '343.444.545-46', ubsId: 20, microarea: 'MA-063', lat: -2.5610, lng: -44.2510, familias: 112, visitas: 30, cobertura: 74, metaVisitas: 45, pendencias: 10, avaliacao: 3.3, status: 'Afastado', admissao: '2022-02-01' },
];

// ── Zoom-aware layer component ───────────────────────────────────
function ZoomAwareMarkers({ agentes, ubsLookup, selectedUbs }) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  map.on('zoomend', () => setZoom(map.getZoom()));

  const filtered = selectedUbs
    ? agentes.filter(a => a.ubsId === selectedUbs)
    : agentes;

  if (zoom < 13) return null;

  return filtered.map(agent => {
    const ubs = ubsLookup[agent.ubsId];
    return (
      <Marker key={agent.id} position={[agent.lat, agent.lng]} icon={createColorIcon(ubs?.cor || '#666')}>
        <Tooltip direction="top" offset={[0, -16]} permanent={zoom >= 15}>
          <span className="text-xs font-semibold">{agent.nome}</span>
        </Tooltip>
        <Popup>
          <div className="min-w-[200px]">
            <p className="font-bold text-sm">{agent.nome}</p>
            <p className="text-xs text-gray-500">{agent.microarea} | {ubs?.nome}</p>
            <hr className="my-1.5" />
            <div className="grid grid-cols-2 gap-1 text-xs">
              <span>Famílias:</span><span className="font-semibold">{agent.familias}</span>
              <span>Visitas/mês:</span><span className="font-semibold">{agent.visitas}/{agent.metaVisitas}</span>
              <span>Cobertura:</span><span className="font-semibold">{agent.cobertura}%</span>
              <span>Avaliação:</span><span className="font-semibold">{agent.avaliacao}/5.0</span>
            </div>
          </div>
        </Popup>
      </Marker>
    );
  });
}

// ── Risk helpers ─────────────────────────────────────────────────
const riskLabels = {
  cardiovascular: { label: 'Cardiovascular', icon: HeartPulse },
  gestacional: { label: 'Gestacional', icon: Baby },
  crianca: { label: 'Criança', icon: Baby },
  diabetes: { label: 'Diabetes', icon: Activity },
  saudeMental: { label: 'Saúde Mental', icon: Brain },
};

const riskColor = (level) => {
  if (level === 'Alto') return 'bg-red-100 text-red-700 border-red-200';
  if (level === 'Médio') return 'bg-amber-100 text-amber-700 border-amber-200';
  if (level === 'Baixo') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  return 'bg-gray-100 text-gray-400 border-gray-200';
};

const vulnBadge = (level) => {
  if (level === 'Alta') return 'bg-red-100 text-red-700';
  if (level === 'Média') return 'bg-amber-100 text-amber-700';
  return 'bg-emerald-100 text-emerald-700';
};

const inputClass = 'h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

// ── Families + individuals data ──────────────────────────────────
const familiesData = [
  { id: 1, microareaId: 1, sobrenome: 'Silva', responsavel: 'Maria da Silva', endereco: 'Rua das Acácias, 150', membros: 5, renda: '1-2 SM', moradia: 'Alvenaria', agua: 'Rede pública', esgoto: 'Rede pública', vulnerabilidade: 'Alta', fatoresRisco: ['Gestante', 'Criança < 2 anos'], observacoes: 'Gestante de alto risco, 7 meses.' },
  { id: 2, microareaId: 1, sobrenome: 'Oliveira', responsavel: 'José Oliveira', endereco: 'Rua das Acácias, 220', membros: 3, renda: '2-3 SM', moradia: 'Alvenaria', agua: 'Rede pública', esgoto: 'Rede pública', vulnerabilidade: 'Baixa', fatoresRisco: [], observacoes: '' },
  { id: 3, microareaId: 1, sobrenome: 'Santos', responsavel: 'Ana Santos', endereco: 'Rua dos Ipês, 45', membros: 6, renda: '< 1 SM', moradia: 'Madeira', agua: 'Poço', esgoto: 'Fossa', vulnerabilidade: 'Alta', fatoresRisco: ['Hipertenso', 'Diabético', 'Idoso acamado'], observacoes: 'Idoso acamado necessita visita semanal.' },
  { id: 4, microareaId: 1, sobrenome: 'Pereira', responsavel: 'Lúcia Pereira', endereco: 'Rua dos Ipês, 112', membros: 4, renda: '1-2 SM', moradia: 'Alvenaria', agua: 'Rede pública', esgoto: 'Rede pública', vulnerabilidade: 'Média', fatoresRisco: ['Hipertenso'], observacoes: '' },
  { id: 5, microareaId: 2, sobrenome: 'Costa', responsavel: 'Roberto Costa', endereco: 'Av. Brasil, 500', membros: 4, renda: '2-3 SM', moradia: 'Alvenaria', agua: 'Rede pública', esgoto: 'Rede pública', vulnerabilidade: 'Média', fatoresRisco: ['Diabético'], observacoes: '' },
  { id: 6, microareaId: 2, sobrenome: 'Almeida', responsavel: 'Fernanda Almeida', endereco: 'Av. Brasil, 780', membros: 7, renda: '< 1 SM', moradia: 'Mista', agua: 'Rede pública', esgoto: 'Fossa', vulnerabilidade: 'Alta', fatoresRisco: ['Gestante', 'Criança < 2 anos', 'Tuberculose'], observacoes: 'Gestante + criança com vacina atrasada.' },
  { id: 7, microareaId: 3, sobrenome: 'Nascimento', responsavel: 'Clara Nascimento', endereco: 'Rua Industrial, 200', membros: 5, renda: '1-2 SM', moradia: 'Alvenaria', agua: 'Rede pública', esgoto: 'Rede pública', vulnerabilidade: 'Alta', fatoresRisco: ['Gestante alto risco', 'Diabético'], observacoes: 'Gestante diabética.' },
  { id: 8, microareaId: 4, sobrenome: 'Teixeira', responsavel: 'Amanda Teixeira', endereco: 'Rua da Paz, 55', membros: 5, renda: '< 1 SM', moradia: 'Mista', agua: 'Rede pública', esgoto: 'Fossa', vulnerabilidade: 'Alta', fatoresRisco: ['Gestante', 'Saúde Mental'], observacoes: 'Puérpera com depressão pós-parto.' },
];

const individualsData = [
  { id: 1, familiaId: 1, nome: 'Maria da Silva', idade: 28, sexo: 'F', riscos: { cardiovascular: 'Baixo', gestacional: 'Alto', crianca: null, diabetes: 'Baixo', saudeMental: 'Baixo' } },
  { id: 2, familiaId: 3, nome: 'José Santos', idade: 78, sexo: 'M', riscos: { cardiovascular: 'Alto', gestacional: null, crianca: null, diabetes: 'Alto', saudeMental: 'Médio' } },
  { id: 3, familiaId: 4, nome: 'Lúcia Pereira', idade: 55, sexo: 'F', riscos: { cardiovascular: 'Médio', gestacional: null, crianca: null, diabetes: 'Baixo', saudeMental: 'Baixo' } },
  { id: 4, familiaId: 5, nome: 'Roberto Costa', idade: 60, sexo: 'M', riscos: { cardiovascular: 'Médio', gestacional: null, crianca: null, diabetes: 'Alto', saudeMental: 'Baixo' } },
  { id: 5, familiaId: 6, nome: 'Fernanda Almeida', idade: 25, sexo: 'F', riscos: { cardiovascular: 'Baixo', gestacional: 'Alto', crianca: null, diabetes: 'Baixo', saudeMental: 'Baixo' } },
  { id: 6, familiaId: 7, nome: 'Clara Nascimento', idade: 30, sexo: 'F', riscos: { cardiovascular: 'Baixo', gestacional: 'Alto', crianca: null, diabetes: 'Alto', saudeMental: 'Baixo' } },
  { id: 7, familiaId: 8, nome: 'Amanda Teixeira', idade: 22, sexo: 'F', riscos: { cardiovascular: 'Baixo', gestacional: 'Baixo', crianca: null, diabetes: 'Baixo', saudeMental: 'Alto' } },
];

// ── Main component ───────────────────────────────────────────────
export default function Territorio() {
  const [activeSection, setActiveSection] = useState('mapa');
  const [selectedUbs, setSelectedUbs] = useState(null);
  const [searchAgent, setSearchAgent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [localFamilies, setLocalFamilies] = useState(familiesData);
  const [formData, setFormData] = useState({
    responsavel: '', sobrenome: '', endereco: '', membros: '', renda: '',
    moradia: '', agua: '', esgoto: '', vulnerabilidade: 'Média', observacoes: ''
  });

  const ubsLookup = useMemo(() => Object.fromEntries(ubsData.map(u => [u.id, u])), []);

  const sections = [
    { id: 'mapa', label: 'Mapa de Cobertura', icon: MapPin },
    { id: 'agentes', label: 'Cadastro e Desempenho', icon: ClipboardList },
    { id: 'familias', label: 'Famílias', icon: Home },
    { id: 'estratificacao', label: 'Estratificação de Risco', icon: Shield },
  ];

  const filteredAgentes = agentesData.filter(a => {
    const matchesUbs = selectedUbs ? a.ubsId === selectedUbs : true;
    const matchesSearch = searchAgent
      ? a.nome.toLowerCase().includes(searchAgent.toLowerCase()) ||
        a.microarea.toLowerCase().includes(searchAgent.toLowerCase())
      : true;
    return matchesUbs && matchesSearch;
  });

  const totalStats = useMemo(() => ({
    agentes: agentesData.length,
    familias: agentesData.reduce((s, a) => s + a.familias, 0),
    coberturaMedia: Math.round(agentesData.reduce((s, a) => s + a.cobertura, 0) / agentesData.length),
    visitasMes: agentesData.reduce((s, a) => s + a.visitas, 0),
  }), []);

  function getMaxRisk(riscos) {
    const vals = Object.values(riscos).filter(v => v !== null);
    if (vals.includes('Alto')) return 'Alto';
    if (vals.includes('Médio')) return 'Médio';
    if (vals.includes('Baixo')) return 'Baixo';
    return null;
  }

  const riskSummary = { alto: 0, medio: 0, baixo: 0 };
  individualsData.forEach(ind => {
    const maxR = getMaxRisk(ind.riscos);
    if (maxR === 'Alto') riskSummary.alto++;
    else if (maxR === 'Médio') riskSummary.medio++;
    else if (maxR === 'Baixo') riskSummary.baixo++;
  });

  const handleRegisterFamily = () => {
    if (!formData.responsavel || !formData.sobrenome || !formData.endereco) return;
    setLocalFamilies(prev => [...prev, {
      id: prev.length + 100, microareaId: 1, sobrenome: formData.sobrenome,
      responsavel: formData.responsavel, endereco: formData.endereco,
      membros: Number(formData.membros) || 1, renda: formData.renda || 'N/I',
      moradia: formData.moradia || 'N/I', agua: formData.agua || 'N/I',
      esgoto: formData.esgoto || 'N/I', vulnerabilidade: formData.vulnerabilidade,
      fatoresRisco: [], observacoes: formData.observacoes
    }]);
    setShowModal(false);
    setFormData({ responsavel: '', sobrenome: '', endereco: '', membros: '', renda: '', moradia: '', agua: '', esgoto: '', vulnerabilidade: 'Média', observacoes: '' });
  };

  const getDesempenhoColor = (val) => {
    if (val >= 90) return 'text-emerald-600';
    if (val >= 75) return 'text-amber-600';
    return 'text-red-600';
  };

  const getStarColor = (val) => {
    if (val >= 4.5) return 'text-emerald-500';
    if (val >= 3.5) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <MapPin className="size-6 text-primary" />
          Territorialização e Microáreas
        </h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Building2 className="size-4" /> {ubsData.length} UBS</span>
          <span className="flex items-center gap-1"><UserCheck className="size-4" /> {totalStats.agentes} agentes</span>
          <span className="flex items-center gap-1"><Users className="size-4" /> {totalStats.familias} famílias</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-1 overflow-x-auto">
          {sections.map(sec => (
            <button key={sec.id} onClick={() => setActiveSection(sec.id)}
              className={cn(
                'inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
                activeSection === sec.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              )}>
              <sec.icon className="size-4" /> {sec.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ═══ MAPA DE COBERTURA ═══════════════════════════════════ */}
      {activeSection === 'mapa' && (
        <div className="space-y-4">
          {/* UBS Legend */}
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-foreground mr-2">Unidades:</span>
              <button
                onClick={() => setSelectedUbs(null)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium border transition-colors',
                  !selectedUbs ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-muted-foreground border-border hover:bg-muted'
                )}
              >
                Todas
              </button>
              {ubsData.map(ubs => (
                <button key={ubs.id} onClick={() => setSelectedUbs(selectedUbs === ubs.id ? null : ubs.id)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition-all',
                    selectedUbs === ubs.id
                      ? 'text-white shadow-md scale-105'
                      : 'bg-white hover:shadow-sm'
                  )}
                  style={selectedUbs === ubs.id
                    ? { backgroundColor: ubs.cor, borderColor: ubs.cor }
                    : { borderColor: ubs.cor, color: ubs.cor }
                  }
                >
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: ubs.cor }} />
                  {ubs.nome.replace('UBS ', '')}
                </button>
              ))}
            </div>
          </Card>

          {/* Map */}
          <Card className="overflow-hidden p-0">
            <div className="h-[520px] w-full">
              <MapContainer
                center={[-2.505, -44.270]}
                zoom={12}
                className="h-full w-full z-0"
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Coverage areas (circles) */}
                {ubsData.map(ubs => (
                  (!selectedUbs || selectedUbs === ubs.id) && (
                    <Circle
                      key={ubs.id}
                      center={[ubs.lat, ubs.lng]}
                      radius={ubs.raio}
                      pathOptions={{
                        color: ubs.cor,
                        fillColor: ubs.cor,
                        fillOpacity: selectedUbs === ubs.id ? 0.25 : 0.15,
                        weight: selectedUbs === ubs.id ? 3 : 2,
                      }}
                      eventHandlers={{
                        click: () => setSelectedUbs(selectedUbs === ubs.id ? null : ubs.id),
                      }}
                    >
                      <Tooltip direction="center" permanent className="!bg-transparent !border-0 !shadow-none">
                        <span className="rounded-md px-2 py-1 text-xs font-bold text-white" style={{ backgroundColor: ubs.cor }}>
                          {ubs.nome.replace('UBS ', '')}
                        </span>
                      </Tooltip>
                    </Circle>
                  )
                ))}

                {/* UBS markers */}
                {ubsData.map(ubs => (
                  (!selectedUbs || selectedUbs === ubs.id) && (
                    <Marker key={`ubs-${ubs.id}`} position={[ubs.lat, ubs.lng]} icon={createUbsIcon(ubs.cor)}>
                      <Popup>
                        <div className="min-w-[220px]">
                          <p className="font-bold text-sm" style={{ color: ubs.cor }}>{ubs.nome}</p>
                          <p className="text-xs text-gray-500">{ubs.bairro}</p>
                          <hr className="my-1.5" />
                          <p className="text-xs"><b>Responsável:</b> {ubs.responsavel}</p>
                          <p className="text-xs"><b>Telefone:</b> {ubs.telefone}</p>
                          <div className="mt-1.5 grid grid-cols-2 gap-1 text-xs">
                            <span>Microáreas:</span><span className="font-semibold">{ubs.microareas}</span>
                            <span>Agentes:</span><span className="font-semibold">{ubs.agentes}</span>
                            <span>Famílias:</span><span className="font-semibold">{ubs.familias}</span>
                            <span>População:</span><span className="font-semibold">{ubs.populacao}</span>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  )
                ))}

                {/* ACS markers (visible on zoom >= 13) */}
                <ZoomAwareMarkers agentes={agentesData} ubsLookup={ubsLookup} selectedUbs={selectedUbs} />
              </MapContainer>
            </div>
          </Card>

          {/* Info text */}
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Eye className="size-4" />
            Aproxime o mapa (zoom) para visualizar os agentes comunitários responsáveis por cada região. Clique em uma área para selecionar a UBS.
          </p>

          {/* Selected UBS details */}
          {selectedUbs && (
            <Card className="p-5">
              {(() => {
                const ubs = ubsLookup[selectedUbs];
                const ubsAgentes = agentesData.filter(a => a.ubsId === selectedUbs);
                return (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg text-white" style={{ backgroundColor: ubs.cor }}>
                          <Building2 className="size-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">{ubs.nome}</h3>
                          <p className="text-xs text-muted-foreground">{ubs.responsavel} | {ubs.telefone}</p>
                        </div>
                      </div>
                      <button onClick={() => setSelectedUbs(null)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"><X className="size-4" /></button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      <div className="rounded-lg bg-muted p-3 text-center">
                        <p className="text-xl font-bold text-foreground">{ubs.microareas}</p>
                        <p className="text-xs text-muted-foreground">Microáreas</p>
                      </div>
                      <div className="rounded-lg bg-muted p-3 text-center">
                        <p className="text-xl font-bold text-foreground">{ubsAgentes.length}</p>
                        <p className="text-xs text-muted-foreground">Agentes</p>
                      </div>
                      <div className="rounded-lg bg-muted p-3 text-center">
                        <p className="text-xl font-bold text-foreground">{ubs.familias}</p>
                        <p className="text-xs text-muted-foreground">Famílias</p>
                      </div>
                      <div className="rounded-lg bg-muted p-3 text-center">
                        <p className="text-xl font-bold text-foreground">{ubs.populacao}</p>
                        <p className="text-xs text-muted-foreground">População</p>
                      </div>
                    </div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Agentes desta UBS</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ubsAgentes.map(ag => (
                        <div key={ag.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                          <div className="flex size-9 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: ubs.cor }}>
                            {ag.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{ag.nome}</p>
                            <p className="text-xs text-muted-foreground">{ag.microarea} | {ag.familias} famílias | {ag.cobertura}% cobertura</p>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <Star className={cn('size-3.5', getStarColor(ag.avaliacao))} />
                            <span className={cn('text-xs font-semibold', getStarColor(ag.avaliacao))}>{ag.avaliacao}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </Card>
          )}
        </div>
      )}

      {/* ═══ CADASTRO E DESEMPENHO ═══════════════════════════════ */}
      {activeSection === 'agentes' && (
        <div className="space-y-4">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <UserCheck className="mx-auto size-6 text-primary mb-1" />
              <p className="text-2xl font-bold text-foreground">{totalStats.agentes}</p>
              <p className="text-xs text-muted-foreground">Total de Agentes</p>
            </Card>
            <Card className="p-4 text-center">
              <Users className="mx-auto size-6 text-secondary mb-1" />
              <p className="text-2xl font-bold text-foreground">{totalStats.familias}</p>
              <p className="text-xs text-muted-foreground">Famílias Cadastradas</p>
            </Card>
            <Card className="p-4 text-center">
              <BarChart3 className="mx-auto size-6 text-amber-500 mb-1" />
              <p className={cn('text-2xl font-bold', getDesempenhoColor(totalStats.coberturaMedia))}>{totalStats.coberturaMedia}%</p>
              <p className="text-xs text-muted-foreground">Cobertura Média</p>
            </Card>
            <Card className="p-4 text-center">
              <Calendar className="mx-auto size-6 text-violet-500 mb-1" />
              <p className="text-2xl font-bold text-foreground">{totalStats.visitasMes}</p>
              <p className="text-xs text-muted-foreground">Visitas no Mês</p>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Buscar agente..." className={cn(inputClass, 'pl-9')}
                value={searchAgent} onChange={(e) => setSearchAgent(e.target.value)} />
            </div>
            <select className={cn(inputClass, 'w-auto')} value={selectedUbs || ''} onChange={(e) => setSelectedUbs(e.target.value ? Number(e.target.value) : null)}>
              <option value="">Todas as UBS</option>
              {ubsData.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
            </select>
          </div>

          {/* Agents Table */}
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Agente</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">UBS</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Microárea</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Famílias</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Visitas</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cobertura</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pendências</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avaliação</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredAgentes.map(ag => {
                    const ubs = ubsLookup[ag.ubsId];
                    const visitaPct = Math.round((ag.visitas / ag.metaVisitas) * 100);
                    return (
                      <tr key={ag.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex size-8 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: ubs?.cor }}>
                              {ag.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{ag.nome}</p>
                              <p className="text-xs text-muted-foreground">{ag.cpf}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: ubs?.cor }}>
                            {ubs?.nome.replace('UBS ', '')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center font-mono text-xs">{ag.microarea}</td>
                        <td className="px-4 py-3 text-center font-semibold">{ag.familias}</td>
                        <td className="px-4 py-3">
                          <div className="mx-auto w-20">
                            <div className="flex items-baseline justify-between mb-0.5">
                              <span className="text-xs font-semibold">{ag.visitas}</span>
                              <span className="text-[10px] text-muted-foreground">/{ag.metaVisitas}</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                              <div className={cn('h-full rounded-full', visitaPct >= 90 ? 'bg-emerald-500' : visitaPct >= 70 ? 'bg-amber-500' : 'bg-red-500')}
                                style={{ width: `${Math.min(100, visitaPct)}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={cn('text-sm font-bold', getDesempenhoColor(ag.cobertura))}>
                            {ag.cobertura}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {ag.pendencias === 0 ? (
                            <span className="text-emerald-500 text-xs font-medium">Nenhuma</span>
                          ) : (
                            <span className={cn(
                              'inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold',
                              ag.pendencias >= 8 ? 'bg-red-100 text-red-700' : ag.pendencias >= 4 ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                            )}>
                              {ag.pendencias}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-0.5">
                            <Star className={cn('size-3.5 fill-current', getStarColor(ag.avaliacao))} />
                            <span className={cn('text-sm font-bold', getStarColor(ag.avaliacao))}>{ag.avaliacao}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
                            ag.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                          )}>
                            <span className={cn('size-1.5 rounded-full', ag.status === 'Ativo' ? 'bg-emerald-500' : 'bg-gray-400')} />
                            {ag.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="border-t border-border px-5 py-3 text-sm text-muted-foreground">
              Exibindo {filteredAgentes.length} de {agentesData.length} agentes
            </div>
          </Card>
        </div>
      )}

      {/* ═══ FAMÍLIAS ════════════════════════════════════════════ */}
      {activeSection === 'familias' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Buscar família..." className={cn(inputClass, 'pl-9 w-56')}
                value={searchAgent} onChange={(e) => setSearchAgent(e.target.value)} />
            </div>
            <button onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90">
              <Plus className="size-4" /> Cadastrar Família
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {localFamilies.filter(f => !searchAgent || f.sobrenome.toLowerCase().includes(searchAgent.toLowerCase()) || f.responsavel.toLowerCase().includes(searchAgent.toLowerCase())).map(fam => (
              <div key={fam.id} className="rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">Família {fam.sobrenome}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{fam.responsavel}</p>
                  </div>
                  <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', vulnBadge(fam.vulnerabilidade))}>{fam.vulnerabilidade}</span>
                </div>
                <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5"><MapPin className="size-3.5" /> {fam.endereco}</p>
                  <p className="flex items-center gap-1.5"><Users className="size-3.5" /> {fam.membros} membros | {fam.moradia} | {fam.renda}</p>
                </div>
                {fam.fatoresRisco.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {fam.fatoresRisco.map((fr, i) => (
                      <span key={i} className="rounded-md bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-600 border border-red-100">{fr}</span>
                    ))}
                  </div>
                )}
                {fam.observacoes && (
                  <p className="mt-2 rounded-lg bg-amber-50 p-2 text-[11px] text-amber-700">
                    <AlertTriangle className="mr-1 inline size-3" />{fam.observacoes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ ESTRATIFICAÇÃO DE RISCO ═════════════════════════════ */}
      {activeSection === 'estratificacao' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
              <p className="text-3xl font-bold text-red-600">{riskSummary.alto}</p>
              <p className="mt-1 text-sm font-medium text-red-600">Risco Alto</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
              <p className="text-3xl font-bold text-amber-600">{riskSummary.medio}</p>
              <p className="mt-1 text-sm font-medium text-amber-600">Risco Médio</p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
              <p className="text-3xl font-bold text-emerald-600">{riskSummary.baixo}</p>
              <p className="mt-1 text-sm font-medium text-emerald-600">Risco Baixo</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {individualsData.map(ind => {
              const family = localFamilies.find(f => f.id === ind.familiaId);
              return (
                <div key={ind.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{ind.nome}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {ind.idade} {ind.idade === 1 ? 'ano' : 'anos'} | {ind.sexo === 'F' ? 'Feminino' : 'Masculino'}
                        {family && <> | Família {family.sobrenome}</>}
                      </p>
                    </div>
                    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold border', riskColor(getMaxRisk(ind.riscos)))}>
                      {getMaxRisk(ind.riscos) || 'N/A'}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {Object.entries(ind.riscos).map(([key, val]) => {
                      if (!val) return null;
                      const cfg = riskLabels[key];
                      const Icon = cfg.icon;
                      return (
                        <span key={key} className={cn('inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium', riskColor(val))}>
                          <Icon className="size-3" /> {cfg.label}: {val}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ MODAL: Cadastrar Família ════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Plus className="size-5 text-primary" /> Cadastrar Família
              </h2>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"><X className="size-5" /></button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Responsável *</label>
                  <input className={inputClass} value={formData.responsavel} onChange={(e) => setFormData(p => ({ ...p, responsavel: e.target.value }))} placeholder="Nome completo" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Sobrenome *</label>
                  <input className={inputClass} value={formData.sobrenome} onChange={(e) => setFormData(p => ({ ...p, sobrenome: e.target.value }))} placeholder="Ex: Silva" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Endereço *</label>
                <input className={inputClass} value={formData.endereco} onChange={(e) => setFormData(p => ({ ...p, endereco: e.target.value }))} placeholder="Rua, número" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Membros</label>
                  <input type="number" className={inputClass} value={formData.membros} onChange={(e) => setFormData(p => ({ ...p, membros: e.target.value }))} min="1" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Renda</label>
                  <select className={inputClass} value={formData.renda} onChange={(e) => setFormData(p => ({ ...p, renda: e.target.value }))}>
                    <option value="">Selecione</option>
                    <option value="< 1 SM">{'< 1 SM'}</option>
                    <option value="1-2 SM">1-2 SM</option>
                    <option value="2-3 SM">2-3 SM</option>
                    <option value="3-5 SM">3-5 SM</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Moradia</label>
                  <select className={inputClass} value={formData.moradia} onChange={(e) => setFormData(p => ({ ...p, moradia: e.target.value }))}>
                    <option value="">Selecione</option>
                    <option value="Alvenaria">Alvenaria</option>
                    <option value="Madeira">Madeira</option>
                    <option value="Mista">Mista</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Observações</label>
                <textarea className={cn(inputClass, 'h-20 py-2')} value={formData.observacoes} onChange={(e) => setFormData(p => ({ ...p, observacoes: e.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-border px-5 py-4">
              <button onClick={() => setShowModal(false)} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">Cancelar</button>
              <button onClick={handleRegisterFamily} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90">Cadastrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
