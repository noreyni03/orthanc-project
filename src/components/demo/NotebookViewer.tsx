'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiPlus, FiTrash2, FiCode, FiBarChart2, FiPieChart, FiLineChart } from 'react-icons/fi';

interface Cell {
  id: string;
  type: 'code' | 'markdown' | 'visualization';
  content: string;
  output?: string;
  isRunning?: boolean;
}

interface Notebook {
  id: string;
  title: string;
  description: string;
  type: 'analysis' | 'visualization' | 'report';
  lastModified: string;
  tags: string[];
}

interface NotebookViewerProps {
  notebook: Notebook;
}

const mockCells: Cell[] = [
  {
    id: '1',
    type: 'markdown',
    content: '# Analyse des données démographiques\n\nCe notebook présente une analyse des caractéristiques démographiques de notre cohorte de patients.'
  },
  {
    id: '2',
    type: 'code',
    content: 'import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\n\n# Chargement des données\ndf = pd.read_csv("data/demographics.csv")\ndf.head()',
    output: '   age  gender  height  weight\n0   45       M    175     75\n1   62       F    165     68\n2   38       M    180     82\n3   55       F    170     70\n4   41       M    178     79'
  },
  {
    id: '3',
    type: 'code',
    content: '# Statistiques descriptives\nprint("Statistiques de l\'âge :")\nprint(df["age"].describe())',
    output: 'Statistiques de l\'âge :\ncount    100.000000\nmean      52.300000\nstd       12.456789\nmin       25.000000\n25%       42.000000\n50%       51.000000\n75%       62.000000\nmax       78.000000\nName: age, dtype: float64'
  },
  {
    id: '4',
    type: 'visualization',
    content: 'plt.figure(figsize=(10, 6))\nplt.hist(df["age"], bins=20, color="skyblue")\nplt.title("Distribution de l\'âge")\nplt.xlabel("Âge")\nplt.ylabel("Fréquence")\nplt.show()',
    output: 'data:image/png;base64,...' // Simulation d'une image
  }
];

const NotebookViewer: React.FC<NotebookViewerProps> = ({ notebook }) => {
  const [cells, setCells] = useState<Cell[]>(mockCells);
  const [activeCell, setActiveCell] = useState<string | null>(null);

  const handleAddCell = (type: Cell['type']) => {
    const newCell: Cell = {
      id: Date.now().toString(),
      type,
      content: type === 'markdown' ? '# Nouvelle cellule' : '# Nouvelle cellule de code',
    };
    setCells([...cells, newCell]);
  };

  const handleDeleteCell = (id: string) => {
    setCells(cells.filter(cell => cell.id !== id));
  };

  const handleRunCell = (id: string) => {
    setCells(cells.map(cell => 
      cell.id === id ? { ...cell, isRunning: true } : cell
    ));
    // Simulation de l'exécution
    setTimeout(() => {
      setCells(cells.map(cell => 
        cell.id === id ? { ...cell, isRunning: false, output: 'Résultat simulé...' } : cell
      ));
    }, 1000);
  };

  const renderCell = (cell: Cell) => {
    return (
      <motion.div
        key={cell.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-700/50 p-2 rounded-t-lg">
          <div className="flex items-center space-x-2">
            {cell.type === 'code' && <FiCode className="text-gray-500" />}
            {cell.type === 'markdown' && <FiBarChart2 className="text-gray-500" />}
            {cell.type === 'visualization' && <FiLineChart className="text-gray-500" />}
            <span className="text-sm text-gray-500">
              {cell.type === 'code' ? 'Code' : cell.type === 'markdown' ? 'Markdown' : 'Visualisation'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {cell.type === 'code' && (
              <button
                onClick={() => handleRunCell(cell.id)}
                className={`p-1 rounded ${
                  cell.isRunning
                    ? 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400'
                    : 'text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400'
                }`}
                disabled={cell.isRunning}
              >
                <FiPlay />
              </button>
            )}
            <button
              onClick={() => handleDeleteCell(cell.id)}
              className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-b-lg overflow-hidden">
          <textarea
            value={cell.content}
            onChange={(e) => {
              setCells(cells.map(c => 
                c.id === cell.id ? { ...c, content: e.target.value } : c
              ));
            }}
            className="w-full p-4 font-mono text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white border-0 focus:ring-0"
            rows={cell.content.split('\n').length}
          />
          {cell.output && (
            <div className="p-4 bg-gray-50 dark:bg-slate-700/50 border-t border-gray-200 dark:border-gray-700">
              <pre className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                {cell.output}
              </pre>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleAddCell('code')}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex items-center space-x-2"
          >
            <FiPlus />
            <span>Nouvelle cellule de code</span>
          </button>
          <button
            onClick={() => handleAddCell('markdown')}
            className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center space-x-2"
          >
            <FiPlus />
            <span>Nouvelle cellule Markdown</span>
          </button>
        </div>
        <button
          onClick={() => handleAddCell('visualization')}
          className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center space-x-2"
        >
          <FiPlus />
          <span>Nouvelle visualisation</span>
        </button>
      </div>

      <div className="space-y-4">
        {cells.map(renderCell)}
      </div>
    </div>
  );
};

export default NotebookViewer; 