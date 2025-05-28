'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
  FiMove,
  FiZoomIn,
  FiRotateCw,
  FiLayers,
  FiScissors,
  FiDownload,
  FiPlus,
  FiMinus,
  FiX
} from 'react-icons/fi';

type Tool = 'rotate' | 'pan' | 'zoom' | 'slice' | 'export';

interface SlicePlane {
  id: string;
  normal: THREE.Vector3;
  position: THREE.Vector3;
  visible: boolean;
}

const Viewer3D: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool>('rotate');
  const [slicePlanes, setSlicePlanes] = useState<SlicePlane[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Initialisation de la scène Three.js
  useEffect(() => {
    if (!containerRef.current) return;

    // Création de la scène
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#1a1a1a');
    sceneRef.current = scene;

    // Création de la caméra
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Création du renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Contrôles de la caméra
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Création d'un cube de test
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshPhongMaterial({
      color: 0x4a9eff,
      transparent: true,
      opacity: 0.8,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Ajout de lumières
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Gestion du redimensionnement
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      scene.clear();
    };
  }, []);

  const handleToolChange = (tool: Tool) => {
    setActiveTool(tool);
    if (controlsRef.current) {
      controlsRef.current.enabled = tool === 'rotate' || tool === 'pan' || tool === 'zoom';
    }
  };

  const handleAddSlicePlane = () => {
    const newPlane: SlicePlane = {
      id: Date.now().toString(),
      normal: new THREE.Vector3(1, 0, 0),
      position: new THREE.Vector3(0, 0, 0),
      visible: true
    };
    setSlicePlanes([...slicePlanes, newPlane]);
  };

  const handleRemoveSlicePlane = (id: string) => {
    setSlicePlanes(slicePlanes.filter(plane => plane.id !== id));
  };

  const handleExport = () => {
    // Simulation d'export
    console.log('Export de la vue 3D');
  };

  return (
    <div className="flex h-[calc(100vh-16rem)]">
      {/* Barre d'outils latérale */}
      <div className="w-16 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4 space-y-4">
        <button
          onClick={() => handleToolChange('rotate')}
          className={`p-2 rounded-lg ${
            activeTool === 'rotate'
              ? 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400'
              : 'text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400'
          }`}
          title="Rotation"
        >
          <FiRotateCw />
        </button>
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
          onClick={() => handleToolChange('slice')}
          className={`p-2 rounded-lg ${
            activeTool === 'slice'
              ? 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400'
              : 'text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400'
          }`}
          title="Sections planes"
        >
          <FiScissors />
        </button>
        <button
          onClick={() => handleToolChange('export')}
          className={`p-2 rounded-lg ${
            activeTool === 'export'
              ? 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400'
              : 'text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400'
          }`}
          title="Export"
        >
          <FiDownload />
        </button>
      </div>

      {/* Zone de visualisation principale */}
      <div className="flex-1 flex flex-col">
        <div ref={containerRef} className="flex-1" />
      </div>

      {/* Panneau latéral des sections planes */}
      <div className="w-64 bg-white dark:bg-slate-800 border-l border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Sections planes
          </h3>
          <button
            onClick={handleAddSlicePlane}
            className="p-1 text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400"
          >
            <FiPlus />
          </button>
        </div>
        <div className="space-y-2">
          {slicePlanes.map(plane => (
            <div
              key={plane.id}
              className="p-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Plan {plane.id.slice(-4)}
                </span>
                <button
                  onClick={() => handleRemoveSlicePlane(plane.id)}
                  className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <FiX />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Viewer3D; 