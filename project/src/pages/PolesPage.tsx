import { useState, useEffect } from 'react';
import { PoleForm } from '../components/PoleForm';
import { PoleList } from '../components/PoleList';
import { Pole, Session } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PrinterIcon } from '@heroicons/react/24/outline';

export function PolesPage() {
  const navigate = useNavigate();
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  useEffect(() => {
    const sessionId = localStorage.getItem('currentSession');
    if (!sessionId) {
      navigate('/');
      return;
    }

    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    const session = sessions.find((s: Session) => s.id === sessionId);
    if (!session) {
      navigate('/');
      return;
    }

    setCurrentSession(session);
  }, [navigate]);

  const updateSession = (updatedSession: Session) => {
    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    const updatedSessions = sessions.map((s: Session) => 
      s.id === updatedSession.id ? updatedSession : s
    );
    localStorage.setItem('sessions', JSON.stringify(updatedSessions));
    setCurrentSession(updatedSession);
  };

  const handleAddPole = (poleData: Omit<Pole, 'id' | 'elements'>) => {
    if (!currentSession) return;

    const newPole: Pole = {
      ...poleData,
      id: crypto.randomUUID(),
      elements: []
    };

    const updatedSession = {
      ...currentSession,
      poles: [...currentSession.poles, newPole]
    };
    updateSession(updatedSession);
  };

  const handleAddElement = (poleId: string, elementData: Omit<PoleElement, 'id'>) => {
    if (!currentSession) return;

    const updatedSession = {
      ...currentSession,
      poles: currentSession.poles.map((pole) => {
        if (pole.id === poleId) {
          return {
            ...pole,
            elements: [
              ...pole.elements,
              {
                ...elementData,
                id: crypto.randomUUID()
              }
            ]
          };
        }
        return pole;
      })
    };
    updateSession(updatedSession);
  };

  const handleDeletePole = (id: string) => {
    if (!currentSession) return;

    const updatedSession = {
      ...currentSession,
      poles: currentSession.poles.filter((pole) => pole.id !== id)
    };
    updateSession(updatedSession);
  };

  const handleDeleteElement = (poleId: string, elementId: string) => {
    if (!currentSession) return;

    const updatedSession = {
      ...currentSession,
      poles: currentSession.poles.map((pole) => {
        if (pole.id === poleId) {
          return {
            ...pole,
            elements: pole.elements.filter((element) => element.id !== elementId)
          };
        }
        return pole;
      })
    };
    updateSession(updatedSession);
  };

  const handlePrintPreview = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow || !currentSession) return;

    const html = `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>Aperçu - ${currentSession.name}</title>
          <style>
            @page {
              size: A4;
              margin: 1cm;
            }
            body {
              font-family: system-ui, -apple-system, sans-serif;
              line-height: 1.4;
              margin: 0;
              padding: 0;
              font-size: 10pt;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 1px solid #000;
            }
            .header h1 {
              margin: 0;
              font-size: 16pt;
            }
            .header p {
              margin: 5px 0 0;
              font-size: 10pt;
            }
            .poles-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
            }
            .pole {
              break-inside: avoid;
              page-break-inside: avoid;
              border: 1px solid #e5e7eb;
              border-radius: 4px;
            }
            .pole-header {
              background: #f3f4f6;
              padding: 8px;
              border-bottom: 1px solid #e5e7eb;
            }
            .pole-info {
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 10pt;
            }
            .pole-info h3 {
              margin: 0;
              font-size: 12pt;
            }
            .elements-container {
              padding: 8px;
            }
            .elements-section {
              margin-bottom: 8px;
            }
            .elements-section h4 {
              margin: 0 0 4px 0;
              font-size: 10pt;
              padding-bottom: 2px;
              border-bottom: 1px solid #e5e7eb;
            }
            .element {
              margin: 2px 0;
              font-size: 9pt;
            }
            .depose { color: #dc2626; }
            .conserve { color: #2563eb; }
            .pose { color: #16a34a; }
            @media print {
              .pole-header {
                background-color: #f9fafb !important;
                -webkit-print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${currentSession.name}</h1>
            <p>Créé le ${new Date(currentSession.createdAt).toLocaleDateString()}</p>
          </div>
          <div class="poles-grid">
            ${currentSession.poles.map((pole) => {
              const deposeElements = pole.elements.filter(e => e.name.startsWith('Dépose'));
              const conserveElements = pole.elements.filter(e => e.name.startsWith('Conserve'));
              const poseElements = pole.elements.filter(e => e.name.startsWith('Pose'));
              
              return `
                <div class="pole">
                  <div class="pole-header">
                    <div class="pole-info">
                      <h3>${pole.name}</h3>
                      <div>${Math.floor(pole.height)}${pole.class}</div>
                    </div>
                    ${pole.remarks ? `<div style="color: #666; font-size: 9pt; margin-top: 4px;">${pole.remarks}</div>` : ''}
                  </div>
                  <div class="elements-container">
                    <div class="elements-section">
                      <h4 class="depose">À déposer</h4>
                      ${deposeElements.map(e => 
                        `<div class="element">${e.quantity} ${e.name.replace('Dépose ', '')}</div>`
                      ).join('') || '<div class="element">Aucun élément</div>'}
                    </div>
                    <div class="elements-section">
                      <h4 class="conserve">À conserver</h4>
                      ${conserveElements.map(e => 
                        `<div class="element">${e.quantity} ${e.name.replace('Conserve ', '')}</div>`
                      ).join('') || '<div class="element">Aucun élément</div>'}
                    </div>
                    <div class="elements-section">
                      <h4 class="pose">À poser</h4>
                      ${poseElements.map(e => 
                        `<div class="element">${e.quantity} ${e.name.replace('Pose ', '')}</div>`
                      ).join('') || '<div class="element">Aucun élément</div>'}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  if (!currentSession) return null;

  return (
    <div className="min-h-screen bg-poles-pattern py-4 sm:py-8 px-2 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center mb-4 sm:mb-0">
            <Link
              to="/"
              className="mr-4 inline-flex items-center px-2 sm:px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1 sm:mr-2" />
              Retour
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{currentSession.name}</h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Créé le {new Date(currentSession.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={handlePrintPreview}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PrinterIcon className="h-5 w-5 mr-2" />
            Aperçu
          </button>
        </div>
        <div className="space-y-6 sm:space-y-8">
          <PoleForm onSubmit={handleAddPole} />
          <PoleList
            poles={currentSession.poles}
            onDeletePole={handleDeletePole}
            onDeleteElement={handleDeleteElement}
            onAddElement={handleAddElement}
          />
        </div>
      </div>
    </div>
  );
}