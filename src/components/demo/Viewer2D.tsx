'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiMove,
  FiZoomIn,
  FiRuler,
  FiEdit,
  FiImage,
  FiLayers,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiMinus,
  FiRotateCw,
  FiType,
  FiX
} from 'react-icons/fi';

type Tool = 'pan' | 'zoom' | 'measure' | 'annotate' | 'window';

interface Annotation {
  id: string;
  type: 'text' | 'arrow' | 'circle' | 'rectangle';
  x: number;
  y: number;
  text?: string;
  color: string;
}

const Viewer2D: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool>('pan');
  const [windowLevel, setWindowLevel] = useState(40);
  const [windowWidth, setWindowWidth] = useState(400);
  const [currentSeries, setCurrentSeries] = useState(0);
  const [totalSeries, setTotalSeries] = useState(100);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulation de données d'image
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simuler une image médicale
    const drawMockImage = () => {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dessiner une grille
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Dessiner un cercle au centre
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, Math.PI * 2);
      ctx.strokeStyle = '#4a9eff';
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    drawMockImage();
  }, []);

  const handleToolChange = (tool: Tool) => {
    setActiveTool(tool);
  };

  const handleWindowLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWindowLevel(Number(e.target.value));
  };

  const handleWindowWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWindowWidth(Number(e.target.value));
  };

  const handleSeriesChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentSeries > 0) {
      setCurrentSeries(prev => prev - 1);
    } else if (direction === 'next' && currentSeries < totalSeries - 1) {
      setCurrentSeries(prev => prev + 1);
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    // Simulation du zoom
    console.log(`Zoom ${direction}`);
  };

  const handleRotate = () => {
    // Simulation de la rotation
    console.log('Rotation');
  };

  return (
    <div className="flex h-[calc(100vh-16rem)]">
      {/* Barre d'outils latérale */}
      <div className="w-16 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4 space-y-4">
        <button
          onClick={() => handleToolChange('pan')}
          className={`p-2 rounded-lg ${
            activeTool === 'pan'
              ? 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400'
              : 'text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400'
          }`}
          title="Déplacement"
        >
          <FiMove />
        </button>
        <button
          onClick={() => handleToolChange('zoom')}
          className={`p-2 rounded-lg ${
            activeTool === 'zoom'
              ? 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400'
              : 'text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400'
          }`}
          title="Zoom"
        >
          <FiZoomIn />
        </button>
        <button
          onClick={() => handleToolChange('measure')}
          className={`p-2 rounded-lg ${
            activeTool === 'measure'
              ? 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400'
              : 'text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400'
          }`}
          title="Mesure"
        >
          <FiRuler />
        </button>
        <button
          onClick={() => handleToolChange('annotate')}
          className={`p-2 rounded-lg ${
            activeTool === 'annotate'
              ? 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400'
              : 'text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400'
          }`}
          title="Annotation"
        >
          <FiEdit />
        </button>
        <button
          onClick={() => handleToolChange('window')}
          className={`p-2 rounded-lg ${
            activeTool === 'window'
              ? 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400'
              : 'text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400'
          }`}
          title="Fenêtre"
        >
          <FiImage />
        </button>
      </div>

      {/* Zone de visualisation principale */}
      <div className="flex-1 flex flex-col">
        {/* Barre d'outils supérieure */}
        <div className="h-12 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleSeriesChange('prev')}
              disabled={currentSeries === 0}
              className="p-2 text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400 disabled:opacity-50"
            >
              <FiChevronLeft />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {currentSeries + 1} / {totalSeries}
            </span>
            <button
              onClick={() => handleSeriesChange('next')}
              disabled={currentSeries === totalSeries - 1}
              className="p-2 text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400 disabled:opacity-50"
            >
              <FiChevronRight />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleZoom('in')}
              className="p-2 text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400"
            >
              <FiPlus />
            </button>
            <button
              onClick={() => handleZoom('out')}
              className="p-2 text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400"
            >
              <FiMinus />
            </button>
            <button
              onClick={handleRotate}
              className="p-2 text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400"
            >
              <FiRotateCw />
            </button>
          </div>
        </div>

        {/* Canvas de visualisation */}
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            width={800}
            height={600}
          />
        </div>

        {/* Barre d'outils inférieure */}
        <div className="h-16 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Niveau de fenêtre
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={windowLevel}
                onChange={handleWindowLevelChange}
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Largeur de fenêtre
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                value={windowWidth}
                onChange={handleWindowWidthChange}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Panneau latéral des annotations */}
      <div className="w-64 bg-white dark:bg-slate-800 border-l border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Annotations
          </h3>
          <button
            onClick={() => setAnnotations([])}
            className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
          >
            <FiX />
          </button>
        </div>
        <div className="space-y-2">
          {annotations.map(annotation => (
            <div
              key={annotation.id}
              className="p-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {annotation.type}
                </span>
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: annotation.color }}
                />
              </div>
              {annotation.text && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {annotation.text}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Viewer2D; 