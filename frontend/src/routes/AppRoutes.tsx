import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/homePage';
import { PoliticosPage } from '../pages/politicosPage';
import { PecPage } from '../pages/pecPage';
import { FitPage } from '../pages/fitPage';
import { DeputadoPage } from '../pages/deputadoPage';
import { Dashboard } from '../pages/dashboardPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/politicos" element={<PoliticosPage />} />
      <Route path="/pecs" element={<PecPage />} />
      <Route path="/fit" element={<FitPage />} />
      <Route path="/deputado" element={<DeputadoPage />} />
      <Route
        path="/dashboard"
        element={
          <Dashboard
            deputado={{
              deputado: {
                id: 677,
                nomeUrna: 'Kim Kataguiri',
                fotoUrl:
                  'https://www.camara.leg.br/internet/deputado/bandep/204536.jpg',
                email: 'dep.kimkataguiri@camara.leg.br',
                partido: 'UNIÃO',
                estado: 'SP',
                votos_recentes: [
                  {
                    id: '1',
                    pec: 'Reforma Tributária',
                    voto: 'Não',
                    data: '2023-07-07',
                  },
                  {
                    id: '2',
                    pec: 'Decisões do STF',
                    voto: 'Não',
                    data: '2024-10-09',
                  },
                  {
                    id: '3',
                    pec: 'Anistia aos Partidos',
                    voto: 'Sim',
                    data: '2024-07-11',
                  },
                  {
                    id: '4',
                    pec: 'Reforma Administrativa',
                    voto: 'Não',
                    data: '2021-09-23',
                  },
                  {
                    id: '5',
                    pec: 'Reforma da Previdência',
                    voto: 'Sim',
                    data: '2019-08-07',
                  },
                  {
                    id: '6',
                    pec: 'PEC Emergencial',
                    voto: 'Não',
                    data: '2021-03-11',
                  },
                  {
                    id: '7',
                    pec: 'Novo Fundeb',
                    voto: 'Sim',
                    data: '2020-07-21',
                  },
                  {
                    id: '8',
                    pec: 'Voto Impresso',
                    voto: 'Sim',
                    data: '2021-08-10',
                  },
                  {
                    id: '9',
                    pec: 'Composição do CNMP',
                    voto: 'Sim',
                    data: '2021-10-20',
                  },
                  {
                    id: '10',
                    pec: 'PEC 28/2024',
                    voto: 'Não',
                    data: '2024-10-09',
                  },
                ],
              },
              partido: 'MISSÃO',
              estado: 'SP',
              ideologia: {
                score: 5.55,
                classificacao: 'Centro',
                probabilidades: {
                  extrema_esquerda: 8.82,
                  esquerda: 14.61,
                  centro: 42.44,
                  direita: 22.85,
                  extrema_direita: 11.28,
                },
              },
              categorias: [
                {
                  categoria: 'Bem-estar social',
                  nota: 6.8,
                },
                {
                  categoria: 'Economia e trabalho',
                  nota: 6.7,
                },
                {
                  categoria: 'Política e governança',
                  nota: 6.3,
                },
              ],
              estatisticas: {
                total_votos: 114,
                sim: 75,
                nao: 39,
                abstencao: 0,
              },
            }}
          />
        }
      />
    </Routes>
  );
}
