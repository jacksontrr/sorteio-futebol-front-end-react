import { useState, useEffect } from 'react';
import { X, Share, Plus, Square } from 'lucide-react';

interface IOSInstallPromptProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function IOSInstallPrompt({ isOpen: controlledIsOpen, onClose: controlledOnClose }: IOSInstallPromptProps = {}) {
  const [showPrompt, setShowPrompt] = useState(false);

  // Se for controlado via props, usa aquelas; senão usa o state interno
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : showPrompt;
  const handleClose = controlledOnClose || (() => setShowPrompt(false));

  useEffect(() => {
    // Se for controlado, não fazer detecção automática
    if (controlledIsOpen !== undefined) return;

    // Detectar iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;
    
    // Mostrar apenas se for iOS, não estiver em modo standalone, e não foi fechado antes
    const wasDismissed = localStorage.getItem('ios-install-dismissed');
    
    if (isIOS && !isInStandaloneMode && !wasDismissed) {
      // Aguardar um pouco para não aparecer imediatamente
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [controlledIsOpen]);

  const handleDismiss = () => {
    handleClose();
    localStorage.setItem('ios-install-dismissed', 'true');
  };

  const handleRemindLater = () => {
    handleClose();
    // Não salva no localStorage, então vai aparecer na próxima vez
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-md w-full shadow-xl animate-in slide-in-from-bottom-4 duration-300">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <Square className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">Instalar FutebolSort</h3>
                <p className="text-sm text-gray-600">Acesso rápido na tela inicial</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
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
                  <div className="mt-2 flex items-center gap-2 text-blue-600">
                    <Share className="w-5 h-5" />
                    <span className="text-xs">(parte inferior da tela)</span>
                  </div>
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
                  <div className="mt-2 flex items-center gap-2 text-gray-600">
                    <Plus className="w-5 h-5" />
                    <span className="text-xs">Adicionar à Tela de Início</span>
                  </div>
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

          <div className="flex gap-3">
            <button
              onClick={handleRemindLater}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Lembrar depois
            </button>
            <button
              onClick={handleDismiss}
              className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Entendi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
