import { useState, useRef, useEffect } from 'react';
import { Pole, PREDEFINED_ELEMENTS, PoleElement } from '../types';
import { TrashIcon, PlusIcon, XMarkIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface PoleListProps {
  poles: Pole[];
  onDeletePole: (id: string) => void;
  onDeleteElement: (poleId: string, elementId: string) => void;
  onAddElement: (poleId: string, elementData: Omit<PoleElement, 'id'>) => void;
}

export function PoleList({ poles, onDeletePole, onDeleteElement, onAddElement }: PoleListProps) {
  const [selectedPoleId, setSelectedPoleId] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<typeof PREDEFINED_ELEMENTS[number]>(PREDEFINED_ELEMENTS[0]);
  const [quantity, setQuantity] = useState(1);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customElement, setCustomElement] = useState('');
  const [actionType, setActionType] = useState<'pose' | 'depose' | 'conserve'>('pose');
  const [expandedPoles, setExpandedPoles] = useState<Set<string>>(new Set());
  
  const selectedPoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedPoleId && selectedPoleRef.current) {
      const rect = selectedPoleRef.current.getBoundingClientRect();
      const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      
      if (!isVisible) {
        selectedPoleRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedPoleId]);

  const handleAddElement = (poleId: string, type: 'pose' | 'depose' | 'conserve') => {
    setSelectedPoleId(poleId);
    setActionType(type);
    setExpandedPoles(new Set([poleId]));
  };

  const handleSubmit = (poleId: string) => {
    const elementName = showCustomInput ? customElement : selectedElement;
    const prefix = {
      pose: 'Pose',
      depose: 'Dépose',
      conserve: 'Conserve'
    }[actionType];
    
    onAddElement(poleId, {
      name: `${prefix} ${elementName}`,
      quantity,
      isCustom: showCustomInput,
      status: actionType
    });

    setSelectedElement(PREDEFINED_ELEMENTS[0]);
    setQuantity(1);
    setShowCustomInput(false);
    setCustomElement('');
  };

  const togglePoleExpansion = (poleId: string) => {
    const newExpandedPoles = new Set(expandedPoles);
    if (newExpandedPoles.has(poleId)) {
      newExpandedPoles.delete(poleId);
    } else {
      newExpandedPoles.add(poleId);
    }
    setExpandedPoles(newExpandedPoles);
  };

  const groupElementsByStatus = (elements: PoleElement[]) => {
    return {
      depose: elements.filter(e => e.name.startsWith('Dépose')),
      conserve: elements.filter(e => e.name.startsWith('Conserve')),
      pose: elements.filter(e => e.name.startsWith('Pose'))
    };
  };

  return (
    <div className="space-y-6 pb-[200px]">
      {poles.map((pole) => {
        const groupedElements = groupElementsByStatus(pole.elements);
        const isExpanded = expandedPoles.has(pole.id);
        
        return (
          <div 
            key={pole.id} 
            className="bg-white rounded-lg shadow overflow-hidden"
            ref={pole.id === selectedPoleId ? selectedPoleRef : null}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <button 
                    onClick={() => togglePoleExpansion(pole.id)}
                    className="flex items-center w-full text-left"
                  >
                    <h3 className="text-xl font-semibold mb-1 flex-1">
                      {pole.name}
                    </h3>
                    {isExpanded ? (
                      <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {pole.remarks && (
                    <p className="text-gray-600 mt-2">
                      <span className="font-medium">Remarques:</span> {pole.remarks}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => onDeletePole(pole.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 space-y-6">
                  {/* Liste des éléments à déposer */}
                  <div>
                    <h4 className="font-medium mb-2 text-red-600">Éléments à déposer</h4>
                    <div className="space-y-2">
                      {groupedElements.depose.map((element) => (
                        <div
                          key={element.id}
                          className="flex justify-between items-center p-2 bg-red-50 rounded"
                        >
                          <div className="flex items-center">
                            <span className="text-gray-900">{element.quantity} {element.name.replace('Dépose ', '')}</span>
                          </div>
                          <button
                            onClick={() => onDeleteElement(pole.id, element.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Liste des éléments à conserver */}
                  <div>
                    <h4 className="font-medium mb-2 text-blue-600">Éléments à conserver</h4>
                    <div className="space-y-2">
                      {groupedElements.conserve.map((element) => (
                        <div
                          key={element.id}
                          className="flex justify-between items-center p-2 bg-blue-50 rounded"
                        >
                          <div className="flex items-center">
                            <span className="text-gray-900">{element.quantity} {element.name.replace('Conserve ', '')}</span>
                          </div>
                          <button
                            onClick={() => onDeleteElement(pole.id, element.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Liste des éléments à poser */}
                  <div>
                    <h4 className="font-medium mb-2 text-green-600">Éléments à poser</h4>
                    <div className="space-y-2">
                      {groupedElements.pose.map((element) => (
                        <div
                          key={element.id}
                          className="flex justify-between items-center p-2 bg-green-50 rounded"
                        >
                          <div className="flex items-center">
                            <span className="text-gray-900">{element.quantity} {element.name.replace('Pose ', '')}</span>
                          </div>
                          <button
                            onClick={() => onDeleteElement(pole.id, element.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleAddElement(pole.id, 'depose')}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-600 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Élément à déposer
                    </button>
                    <button
                      onClick={() => handleAddElement(pole.id, 'conserve')}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Élément à conserver
                    </button>
                    <button
                      onClick={() => handleAddElement(pole.id, 'pose')}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-green-600 text-sm font-medium rounded-md text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Élément à poser
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Formulaire d'ajout d'élément en position fixe */}
      {selectedPoleId && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h5 className="font-medium">
                {actionType === 'pose' ? 'Élément à poser' : 
                 actionType === 'depose' ? 'Élément à déposer' : 
                 'Élément à conserver'}
              </h5>
              <button
                onClick={() => setSelectedPoleId(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <select
                  value={showCustomInput ? "custom" : selectedElement}
                  onChange={(e) => {
                    if (e.target.value === "custom") {
                      setShowCustomInput(true);
                    } else {
                      setShowCustomInput(false);
                      setSelectedElement(e.target.value as typeof PREDEFINED_ELEMENTS[number]);
                    }
                  }}
                  className="w-full p-2 border rounded"
                >
                  {PREDEFINED_ELEMENTS.map((element) => (
                    <option key={element} value={element}>
                      {element}
                    </option>
                  ))}
                  <option value="custom">Autre élément...</option>
                </select>
                {showCustomInput && (
                  <input
                    type="text"
                    value={customElement}
                    onChange={(e) => setCustomElement(e.target.value)}
                    placeholder="Nom de l'élément personnalisé"
                    className="w-full p-2 border rounded mt-2"
                  />
                )}
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantité
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <button
                  onClick={() => handleSubmit(selectedPoleId)}
                  className={`self-end w-32 text-white py-2 px-4 rounded hover:bg-opacity-90 ${
                    actionType === 'pose' ? 'bg-green-600' :
                    actionType === 'depose' ? 'bg-red-600' :
                    'bg-blue-600'
                  }`}
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}