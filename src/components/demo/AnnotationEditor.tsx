'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSave, FiUsers, FiTag, FiImage, FiType, FiCircle, FiSquare, FiArrowRight } from 'react-icons/fi';

interface Annotation {
  id: string;
  title: string;
  type: 'dicom' | 'model' | 'notebook';
  status: 'draft' | 'in_progress' | 'completed';
  collaborators: {
    id: string;
    name: string;
    avatar: string;
    role: 'owner' | 'editor' | 'viewer';
  }[];
  lastModified: string;
  createdBy: {
    id: string;
    name: string;
    avatar: string;
  };
  tags: string[];
}

interface AnnotationEditorProps {
  isOpen: boolean;
  onClose: () => void;
  annotation?: Annotation | null;
  onSave: (annotationData: {
    title: string;
    type: string;
    status: string;
    tags: string[];
    collaborators: string[];
    content: any;
  }) => void;
}

const AnnotationEditor: React.FC<AnnotationEditorProps> = ({
  isOpen,
  onClose,
  annotation,
  onSave
}) => {
  const [title, setTitle] = useState(annotation?.title || '');
  const [type, setType] = useState(annotation?.type || 'dicom');
  const [status, setStatus] = useState(annotation?.status || 'draft');
  const [tags, setTags] = useState<string[]>(annotation?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [selectedTool, setSelectedTool] = useState<'select' | 'rectangle' | 'circle' | 'arrow' | 'text'>('select');
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawings, setDrawings] = useState<any[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeCollaborators, setActiveCollaborators] = useState([
    {
      id: '1',
      name: 'Dr. Sophie',
      avatar: 'https://i.pravatar.cc/150?img=2',
      role: 'owner'
    }
  ]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Simuler le chargement d'une image DICOM
        const img = new Image();
        img.src = 'https://picsum.photos/800/600';
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
        };
      }
    }
  }, []);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    
    switch (selectedTool) {
      case 'rectangle':
        setDrawings([...drawings, { type: 'rectangle', startX: x, startY: y, endX: x, endY: y }]);
        break;
      case 'circle':
        setDrawings([...drawings, { type: 'circle', centerX: x, centerY: y, radius: 0 }]);
        break;
      case 'arrow':
        setDrawings([...drawings, { type: 'arrow', startX: x, startY: y, endX: x, endY: y }]);
        break;
      case 'text':
        const text = prompt('Entrez votre texte :');
        if (text) {
          setDrawings([...drawings, { type: 'text', x, y, text }]);
        }
        break;
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const img = new Image();
      img.src = 'https://picsum.photos/800/600';
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        
        drawings.forEach(drawing => {
          ctx.strokeStyle = '#00BCD4';
          ctx.lineWidth = 2;
          
          switch (drawing.type) {
            case 'rectangle':
              ctx.strokeRect(drawing.startX, drawing.startY, x - drawing.startX, y - drawing.startY);
              break;
            case 'circle':
              const radius = Math.sqrt(Math.pow(x - drawing.centerX, 2) + Math.pow(y - drawing.centerY, 2));
              ctx.beginPath();
              ctx.arc(drawing.centerX, drawing.centerY, radius, 0, 2 * Math.PI);
              ctx.stroke();
              break;
            case 'arrow':
              ctx.beginPath();
              ctx.moveTo(drawing.startX, drawing.startY);
              ctx.lineTo(x, y);
              ctx.stroke();
              break;
            case 'text':
              ctx.font = '16px Arial';
              ctx.fillStyle = '#00BCD4';
              ctx.fillText(drawing.text, drawing.x, drawing.y);
              break;
          }
        });
      };
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      type,
      status,
      tags,
      collaborators: activeCollaborators.map(c => c.id),
      content: drawings
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-slate-900 dark:bg-opacity-75"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="inline-block w-full max-w-6xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-slate-800 shadow-xl rounded-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {annotation ? 'Modifier l\'annotation' : 'Nouvelle annotation'}
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-12 gap-6">
                  {/* Panneau de gauche - Informations */}
                  <div className="col-span-3 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Titre
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Type
                      </label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      >
                        <option value="dicom">DICOM</option>
                        <option value="model">Modèle</option>
                        <option value="notebook">Notebook</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Statut
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      >
                        <option value="draft">Brouillon</option>
                        <option value="in_progress">En cours</option>
                        <option value="completed">Terminé</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tags
                      </label>
                      <div className="mt-1 flex items-center space-x-2">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                          className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                          placeholder="Ajouter un tag..."
                        />
                        <button
                          type="button"
                          onClick={handleAddTag}
                          className="p-2 text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
                        >
                          <FiTag className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Collaborateurs actifs
                      </label>
                      <div className="mt-2 space-y-2">
                        {activeCollaborators.map(collaborator => (
                          <div
                            key={collaborator.id}
                            className="flex items-center space-x-2 px-3 py-2 bg-gray-50 dark:bg-slate-700 rounded-lg"
                          >
                            <img
                              src={collaborator.avatar}
                              alt={collaborator.name}
                              className="w-6 h-6 rounded-full"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {collaborator.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {collaborator.role}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Panneau central - Zone de dessin */}
                  <div className="col-span-6">
                    <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-4">
                      <div className="flex items-center space-x-4 mb-4">
                        <button
                          type="button"
                          onClick={() => setSelectedTool('select')}
                          className={`p-2 rounded-lg ${
                            selectedTool === 'select'
                              ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400'
                              : 'text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400'
                          }`}
                        >
                          <FiImage className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedTool('rectangle')}
                          className={`p-2 rounded-lg ${
                            selectedTool === 'rectangle'
                              ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400'
                              : 'text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400'
                          }`}
                        >
                          <FiSquare className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedTool('circle')}
                          className={`p-2 rounded-lg ${
                            selectedTool === 'circle'
                              ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400'
                              : 'text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400'
                          }`}
                        >
                          <FiCircle className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedTool('arrow')}
                          className={`p-2 rounded-lg ${
                            selectedTool === 'arrow'
                              ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400'
                              : 'text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400'
                          }`}
                        >
                          <FiArrowRight className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedTool('text')}
                          className={`p-2 rounded-lg ${
                            selectedTool === 'text'
                              ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400'
                              : 'text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400'
                          }`}
                        >
                          <FiType className="w-5 h-5" />
                        </button>
                      </div>
                      <canvas
                        ref={canvasRef}
                        onMouseDown={handleCanvasMouseDown}
                        onMouseMove={handleCanvasMouseMove}
                        onMouseUp={handleCanvasMouseUp}
                        className="w-full h-[600px] bg-white dark:bg-slate-800 rounded-lg cursor-crosshair"
                      />
                    </div>
                  </div>

                  {/* Panneau de droite - Historique des modifications */}
                  <div className="col-span-3">
                    <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                        Historique des modifications
                      </h4>
                      <div className="space-y-4">
                        {drawings.map((drawing, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
                          >
                            <span className="w-4 h-4 rounded-full bg-cyan-500" />
                            <span>
                              {drawing.type === 'text'
                                ? `Texte ajouté : "${drawing.text}"`
                                : `${drawing.type} dessiné`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 rounded-md flex items-center space-x-2"
                  >
                    <FiSave className="w-4 h-4" />
                    <span>Sauvegarder</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AnnotationEditor; 