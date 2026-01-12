import React from 'react';

interface IOSInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IOSInstructionsModal({ isOpen, onClose }: IOSInstructionsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-md w-full shadow-xl animate-in slide-in-from-bottom-4 duration-300">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">i</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">Como Colocar App no iPhone</h3>
                <p className="text-sm text-gray-600">Acesso rápido na tela inicial</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <p className="text-sm text-gray-700">
              Para uma melhor experiência, adicione o FutebolSort à sua tela inicial:
            </p>

            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    Toque no botão <span className="font-semibold">Compartilhar</span>
                  </p>
                  <p className="mt-2 text-xs text-gray-600">(parte inferior da tela)</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    Role para baixo e toque em <span className="font-semibold">"Adicionar à Tela de Início"</span>
                  </p>
                  <p className="mt-2 text-xs text-gray-600">Adicionar à Tela de Início</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    Toque em <span className="font-semibold">"Adicionar"</span> no canto superior direito
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}
