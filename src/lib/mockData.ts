export interface Dataset {
  id: string;
  name: string;
  description: string;
  modality: 'CT' | 'MR' | 'US' | 'X-Ray';
  patientCount: number;
  studyCount: number;
  seriesCount: number;
  lastUpdated: string;
  status: 'active' | 'processing' | 'archived';
  tags: string[];
  size: string;
  owner: string;
}

export interface Cohort {
  id: string;
  name: string;
  description: string;
  datasets: string[]; // IDs des datasets inclus
  patientCount: number;
  criteria: {
    ageRange?: [number, number];
    gender?: 'M' | 'F' | 'all';
    modalities?: ('CT' | 'MR' | 'US' | 'X-Ray')[];
    pathologies?: string[];
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    lastUpdated: string;
    status: 'active' | 'draft' | 'archived';
    tags: string[];
  };
}

export const mockDatasets: Dataset[] = [
  {
    id: '1',
    name: 'Cohorte Cardiaque 2024',
    description: 'Collection d\'images cardiaques pour l\'analyse des pathologies coronariennes',
    modality: 'CT',
    patientCount: 150,
    studyCount: 450,
    seriesCount: 1800,
    lastUpdated: '2024-03-15',
    status: 'active',
    tags: ['cardiaque', 'coronarien', 'angioscanner'],
    size: '2.5 TB',
    owner: 'Dr. Martin'
  },
  {
    id: '2',
    name: 'Étude Cérébrale Longitudinale',
    description: 'Suivi IRM cérébral de patients atteints de maladies neurodégénératives',
    modality: 'MR',
    patientCount: 75,
    studyCount: 300,
    seriesCount: 1200,
    lastUpdated: '2024-03-10',
    status: 'processing',
    tags: ['neurologie', 'IRM', 'longitudinal'],
    size: '1.8 TB',
    owner: 'Dr. Dubois'
  },
  {
    id: '3',
    name: 'Screening Pulmonaire',
    description: 'Radiographies thoraciques pour le dépistage des pathologies pulmonaires',
    modality: 'X-Ray',
    patientCount: 500,
    studyCount: 500,
    seriesCount: 500,
    lastUpdated: '2024-03-01',
    status: 'active',
    tags: ['pulmonaire', 'dépistage', 'radiographie'],
    size: '500 GB',
    owner: 'Dr. Leroy'
  },
  {
    id: '4',
    name: 'Échographie Obstétricale',
    description: 'Suivi échographique de grossesses à risque',
    modality: 'US',
    patientCount: 100,
    studyCount: 400,
    seriesCount: 800,
    lastUpdated: '2024-02-28',
    status: 'archived',
    tags: ['obstétrique', 'échographie', 'grossesse'],
    size: '800 GB',
    owner: 'Dr. Moreau'
  },
  {
    id: '5',
    name: 'Trauma Crânien Aigu',
    description: 'Scanner cérébral d\'urgence pour patients traumatisés crâniens',
    modality: 'CT',
    patientCount: 200,
    studyCount: 200,
    seriesCount: 400,
    lastUpdated: '2024-03-14',
    status: 'active',
    tags: ['trauma', 'urgence', 'scanner'],
    size: '1.2 TB',
    owner: 'Dr. Bernard'
  }
];

export const mockCohorts: Cohort[] = [
  {
    id: '1',
    name: 'Cohorte Cardiaque Avancée',
    description: 'Patients présentant des pathologies coronariennes complexes',
    datasets: ['1', '5'],
    patientCount: 250,
    criteria: {
      ageRange: [45, 75],
      gender: 'all',
      modalities: ['CT'],
      pathologies: ['coronarien', 'cardiopathie']
    },
    metadata: {
      createdBy: 'Dr. Martin',
      createdAt: '2024-02-15',
      lastUpdated: '2024-03-15',
      status: 'active',
      tags: ['cardiaque', 'coronarien', 'étude']
    }
  },
  {
    id: '2',
    name: 'Étude Neurologique Longitudinale',
    description: 'Suivi de patients atteints de maladies neurodégénératives',
    datasets: ['2'],
    patientCount: 75,
    criteria: {
      ageRange: [60, 85],
      gender: 'all',
      modalities: ['MR'],
      pathologies: ['neurodégénératif', 'démence']
    },
    metadata: {
      createdBy: 'Dr. Dubois',
      createdAt: '2024-01-20',
      lastUpdated: '2024-03-10',
      status: 'active',
      tags: ['neurologie', 'IRM', 'longitudinal']
    }
  },
  {
    id: '3',
    name: 'Dépistage Pulmonaire',
    description: 'Cohorte de dépistage des pathologies pulmonaires',
    datasets: ['3'],
    patientCount: 500,
    criteria: {
      ageRange: [50, 80],
      gender: 'all',
      modalities: ['X-Ray'],
      pathologies: ['pulmonaire', 'cancer']
    },
    metadata: {
      createdBy: 'Dr. Leroy',
      createdAt: '2024-02-01',
      lastUpdated: '2024-03-01',
      status: 'active',
      tags: ['pulmonaire', 'dépistage', 'radiographie']
    }
  }
]; 