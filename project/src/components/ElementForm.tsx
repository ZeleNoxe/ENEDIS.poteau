import { useState } from 'react';
import { PREDEFINED_ELEMENTS, PoleElement } from '../types';

interface ElementFormProps {
  onSubmit: (element: Omit<PoleElement, 'id'>) => void;
}

export function ElementForm({ onSubmit }: ElementFormProps) {
  const [selectedElement, setSelectedElement] = useState<typeof PREDEFINED_ELEMENTS[number]>(PREDEFINED_ELEMENTS[0]);
  const [quantity, setQuantity] = useState('1');
  const [customElement, setCustomElement] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: isCustom ? customElement : selectedElement,
      quantity: Number(quantity),
      isCustom
    });
    setQuantity('1');
    setCustomElement('');
    setIsCustom(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Ajouter un élément</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={isCustom}
            onChange={(e) => setIsCustom(e.target.checked)}
            className="mr-2"
          />
          Élément personnalisé
        </label>
      </div>
      {isCustom ? (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nom de l'élément
            <input
              type="text"
              value={customElement}
              onChange={(e) => setCustomElement(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Élément
            <select
              value={selectedElement}
              onChange={(e) => setSelectedElement(e.target.value as typeof PREDEFINED_ELEMENTS[number])}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {PREDEFINED_ELEMENTS.map((element) => (
                <option key={element} value={element}>
                  {element}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Quantité
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </label>
      </div>
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Ajouter l'élément
      </button>
    </form>
  );
}