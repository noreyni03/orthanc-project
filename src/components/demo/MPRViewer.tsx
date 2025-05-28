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
  FiPlus,
  FiMinus,
  FiRotateCw,
  FiX
} from 'react-icons/fi';

type Plane = 'axial' | 'sagittal' | 'coronal';
type Tool = 'pan' | 'zoom' | 'measure' | 'window';

interface Measurement {
  id: string;
  type: 'distance' | 'angle' | 'area';
  points: { x: number; y: number }[];
  value: number;
  unit: string;
  plane: Plane;
}

interface CrosshairPosition {
  x: number;
  y: number;
  z: number;
}

const MPRViewer: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool>('pan');
  const [activePlane, setActivePlane] = useState<Plane>('axial');
  const [windowLevel, setWindowLevel] = useState(40);
  const [windowWidth, setWindowWidth] = useState(400);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [crosshairPosition, setCrosshairPosition] = useState<CrosshairPosition>({ x: 0, y: 0, z: 0 });
  const [isDrawing, setIsDrawing] = useState(false);

  const axialCanvasRef = useRef<HTMLCanvasElement>(null);
  const sagittalCanvasRef = useRef<HTMLCanvasElement>(null);
  const coronalCanvasRef = useRef<HTMLCanvasElement>(null);

  // Simulation de données d'image
  useEffect(() => {
    const drawMockImage = (canvas: HTMLCanvasElement | null) => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

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

      // Dessiner les repères de position
      const { x, y, z } = crosshairPosition;
      ctx.strokeStyle = '#4a9eff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 10, y);
      ctx.lineTo(x + 10, y);
      ctx.moveTo(x, y - 10);
      ctx.lineTo(x, y + 10);
      ctx.stroke();
    };

    drawMockImage(axialCanvasRef.current);
    drawMockImage(sagittalCanvasRef.current);
    drawMockImage(coronalCanvasRef.current);
  }, [crosshairPosition]);

  const handleToolChange = (tool: Tool) => {
    setActiveTool(tool);
  };

  const handlePlaneChange = (plane: Plane) => {
    setActivePlane(plane);
  };

  const handleWindowLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWindowLevel(Number(e.target.value));
  };

  const handleWindowWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWindowWidth(Number(e.target.value));
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>, plane: Plane) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCrosshairPosition(prev => ({
      ...prev,
      ...(plane === 'axial' ? { x, y } :
          plane === 'sagittal' ? { y, z: x } :
          { x, z: y })
    }));
  };

  const handleAddMeasurement = () => {
    const newMeasurement: Measurement = {
      id: Date.now().toString(),
      type: 'distance',
      points: [],
      value: 0,
      unit: 'mm',
      plane: activePlane
    };
    setMeasurements([...measurements, newMeasurement]);
  };

  const handleRemoveMeasurement = (id: string) => {
    setMeasurements(measurements.filter(m => m.id !== id));
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
        {/* Grille des vues */}
        <div className="grid grid-cols-2 gap-4 p-4 flex-1">
          <div className="relative">
            <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
              Axial
            </div>
            <canvas
              ref={axialCanvasRef}
              className="w-full h-full bg-black"
              width={400}
              height={400}
              onClick={(e) => handleCanvasClick(e, 'axial')}
            />
          </div>
          <div className="relative">
            <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
              Sagittal
            </div>
            <canvas
              ref={sagittalCanvasRef}
              className="w-full h-full bg-black"
              width={400}
              height={400}
              onClick={(e) => handleCanvasClick(e, 'sagittal')}
            />
          </div>
          <div className="relative">
            <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
              Coronal
            </div>
            <canvas
              ref={coronalCanvasRef}
              className="w-full h-full bg-black"
              width={400}
              height={400}
              onClick={(e) => handleCanvasClick(e, 'coronal')}
            />
          </div>
          <div className="relative">
            <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
              3D
            </div>
            <div className="w-full h-full bg-black flex items-center justify-center text-gray-500">
              Vue 3D (à implémenter)
            </div>
          </div>
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

      {/* Panneau latéral des mesures */}
      <div className="w-64 bg-white dark:bg-slate-800 border-l border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Mesures
          </h3>
          <button
            onClick={handleAddMeasurement}
            className="p-1 text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400"
          >
            <FiPlus />
          </button>
        </div>
        <div className="space-y-2">
          {measurements.map(measurement => (
            <div
              key={measurement.id}
              className="p-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {measurement.type} ({measurement.plane})
                </span>
                <button
                  onClick={() => handleRemoveMeasurement(measurement.id)}
                  className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <FiX />
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {measurement.value} {measurement.unit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MPRViewer; 