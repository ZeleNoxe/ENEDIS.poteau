import { useState } from 'react';
import { Pole } from '../types';

interface PoleFormProps {
  onSubmit: (pole: Omit<Pole, 'id' | 'elements'>) => void;
}

export function PoleForm({ onSubmit }: PoleFormProps) {
  const [name, setName] = useState('');
  const [height, setHeight] = useState('');
  const [poleClass, setPoleClass] = useState('');
  const [remarks, setRemarks] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      height: Number(height),
      class: poleClass,
      value: 0,
      remarks
    });
    setName('');
    setHeight('');
    setPoleClass('');
    setRemarks('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 sm:p-6 rounded-lg shadow">
      <h2 className="text-lg sm:text-xl font-bold mb-4">Ajouter un poteau</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nom du poteau
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
            />
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Hauteur (m)
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
              min="0"
              step="0.1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
            />
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Classe du support
            <input
              type="text"
              value={poleClass}
              onChange={(e) => setPoleClass(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
            />
          </label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Remarques
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Ajoutez vos remarques ici..."
          />
        </label>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base"
      >
        Ajouter PBA
      </button>
    </form>
  );
}