import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowRightIcon, DocumentPlusIcon, DocumentArrowUpIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Session } from '../types';

export function WelcomePage() {
  const navigate = useNavigate();
  const [showNewSessionDialog, setShowNewSessionDialog] = useState(false);
  const [showSessionList, setShowSessionList] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [sessions, setSessions] = useState<Session[]>(() => {
    const savedSessions = localStorage.getItem('sessions');
    return savedSessions ? JSON.parse(savedSessions) : [];
  });

  const handleNewSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionName.trim()) return;

    const newSession: Session = {
      id: crypto.randomUUID(),
      name: newSessionName.trim(),
      createdAt: new Date().toISOString(),
      poles: []
    };

    const updatedSessions = [...sessions, newSession];
    localStorage.setItem('sessions', JSON.stringify(updatedSessions));
    localStorage.setItem('currentSession', newSession.id);
    setSessions(updatedSessions);
    navigate('/poles');
  };

  const handleSelectSession = (sessionId: string) => {
    localStorage.setItem('currentSession', sessionId);
    navigate('/poles');
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedSessions = sessions.filter(session => session.id !== sessionId);
    localStorage.setItem('sessions', JSON.stringify(updatedSessions));
    if (localStorage.getItem('currentSession') === sessionId) {
      localStorage.removeItem('currentSession');
    }
    setSessions(updatedSessions);
  };

  return (
    <div className="min-h-screen bg-poles-pattern flex items-center justify-center">
      <div className="max-w-md w-full px-6 py-12 bg-white/90 backdrop-blur-sm shadow-lg rounded-lg text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Gestion des Poteaux
        </h1>
        <div className="space-y-4">
          <button
            onClick={() => setShowNewSessionDialog(true)}
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <DocumentPlusIcon className="h-5 w-5 mr-2" />
            Nouvelle saisie
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </button>
          
          {sessions.length > 0 && (
            <button
              onClick={() => setShowSessionList(true)}
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
              Reprendre une saisie
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </button>
          )}
        </div>

        {/* Dialog for new session */}
        {showNewSessionDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Nouvelle saisie</h2>
                <button
                  onClick={() => setShowNewSessionDialog(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleNewSession}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la saisie
                  </label>
                  <input
                    type="text"
                    value={newSessionName}
                    onChange={(e) => setNewSessionName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Chantier rue des Lilas"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Commencer
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Dialog for session list */}
        {showSessionList && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Saisies en cours</h2>
                <button
                  onClick={() => setShowSessionList(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-2">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => handleSelectSession(session.id)}
                    className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 group relative cursor-pointer"
                  >
                    <div className="font-medium">{session.name}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </div>
                    <button
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Supprimer la saisie"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}