import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  Monitor,
  Download,
  X,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  Laptop,
  Flame,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { FoodPlanetLogo } from './FoodPlanetLogo';

interface WindowsInstallerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WindowsInstallerModal: React.FC<WindowsInstallerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'edge' | 'chrome' | 'shortcut'>('edge');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  // Generates and triggers download of a Windows Desktop Shortcut file
  const handleDownloadWindowsShortcut = () => {
    const currentUrl = window.location.origin;
    // Create Windows .url internet shortcut file
    const shortcutContent = `[InternetShortcut]\r\nURL=${currentUrl}\r\nIconIndex=0\r\nIconFile=${currentUrl}/pwa-512x512.png\r\nHotKey=0\r\n[{000214A0-0000-0000-C000-000000000046}]\r\nProp3=19,0\r\n`;

    const blob = new Blob([shortcutContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FoodPlanet-Restaurante.url';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  // Generates a Windows Batch Script (.bat) that launches Edge or Chrome in app mode
  const handleDownloadWindowsAppLauncher = () => {
    const currentUrl = window.location.origin;
    const batContent = `@echo off\r\n` +
      `:: Food Planet Windows Standalone Launcher\r\n` +
      `title Food Planet POS\r\n` +
      `echo Iniciando Food Planet en modo aplicacion de escritorio...\r\n` +
      `start msedge.exe --app="${currentUrl}" || start chrome.exe --app="${currentUrl}" || start "" "${currentUrl}"\r\n` +
      `exit\r\n`;

    const blob = new Blob([batContent], { type: 'application/bat' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Lanzador-FoodPlanet-Windows.bat';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 pb-4 border-b border-stone-800">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
            <Monitor className="w-7 h-7" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                Instalación para PC con Windows (10 / 11)
              </span>
              <span className="text-[10px] bg-red-600/30 text-red-300 font-bold px-2 py-0.5 rounded-full border border-red-500/30">
                PWA Desktop
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Instalar Food Planet en tu Computadora
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Convierte el sistema en un programa nativo de Windows: funciona en su propia ventana sin barras del navegador, con ícono en el escritorio y soporte fuera de línea.
            </p>
          </div>
        </div>

        {/* Quick 1-Click Action if browser supports beforeinstallprompt */}
        {isInstallable && !isInstalled && (
          <div className="bg-linear-to-r from-red-950/60 via-amber-950/40 to-stone-900 p-4 sm:p-5 rounded-2xl border border-amber-500/40 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold text-amber-300 flex items-center justify-center sm:justify-start gap-1.5">
                <Flame className="w-4 h-4 text-red-500" />
                Instalación Directa Detectada
              </span>
              <p className="text-sm font-bold text-white">
                Tu navegador permite instalar Food Planet en Windows en 1 clic
              </p>
              <p className="text-xs text-stone-300">
                Crea el ícono en el Menú Inicio y en la Barra de Tareas de Windows.
              </p>
            </div>

            <button
              onClick={install}
              className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 cursor-pointer active:scale-95 transition-all whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              Instalar Ahora en Windows
            </button>
          </div>
        )}

        {isInstalled && (
          <div className="bg-emerald-950/30 border border-emerald-500/40 p-4 rounded-2xl flex items-center gap-3 text-emerald-300 text-xs font-medium">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              ¡Food Planet ya está instalado como aplicación de escritorio en este equipo! Puedes abrirlo desde tu menú inicio o barra de tareas.
            </span>
          </div>
        )}

        {/* Step-by-step guides by browser */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Instrucciones Paso a Paso para Windows
            </h3>

            {/* Browser Selector Tabs */}
            <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('edge')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'edge'
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Microsoft Edge
              </button>
              <button
                onClick={() => setActiveTab('chrome')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'chrome'
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Google Chrome
              </button>
              <button
                onClick={() => setActiveTab('shortcut')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'shortcut'
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Acceso Directo (.bat)
              </button>
            </div>
          </div>

          {/* TAB: EDGE */}
          {activeTab === 'edge' && (
            <div className="bg-stone-950 border border-stone-800 p-4 sm:p-5 rounded-2xl space-y-3 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <span>🌐 En Microsoft Edge (Recomendado para Windows 10 y 11):</span>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-stone-300 leading-relaxed pl-1">
                <li>
                  Abre la aplicación en <strong>Microsoft Edge</strong>.
                </li>
                <li>
                  Haz clic en el botón de menú con los <strong>tres puntos (...)</strong> en la esquina superior derecha del navegador.
                </li>
                <li>
                  Pasa el ratón sobre <strong>«Aplicaciones»</strong> y selecciona <strong>«Instalar este sitio como una aplicación»</strong> (o <em>«Instalar Food Planet»</em>).
                </li>
                <li>
                  En la ventana emergente, haz clic en <strong>«Instalar»</strong>.
                </li>
                <li>
                  Marca las opciones <strong>«Anclar a la barra de tareas»</strong> y <strong>«Crear acceso directo en el escritorio»</strong>.
                </li>
              </ol>
            </div>
          )}

          {/* TAB: CHROME */}
          {activeTab === 'chrome' && (
            <div className="bg-stone-950 border border-stone-800 p-4 sm:p-5 rounded-2xl space-y-3 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <span>🌐 En Google Chrome para Windows:</span>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-stone-300 leading-relaxed pl-1">
                <li>
                  Abre la aplicación en <strong>Google Chrome</strong>.
                </li>
                <li>
                  Busca el ícono de instalación <span className="inline-block px-1.5 py-0.5 bg-stone-800 rounded font-mono text-[10px]">💻</span> en la parte derecha de la barra de direcciones URL (junto a la estrella de marcadores).
                </li>
                <li>
                  O bien haz clic en el menú <strong>(...)</strong> $\rightarrow$ <strong>«Guardar y compartir»</strong> $\rightarrow$ <strong>«Instalar Food Planet»</strong>.
                </li>
                <li>
                  Haz clic en <strong>«Instalar»</strong>. La aplicación se abrirá en su propia ventana independiente con el logo de Food Planet.
                </li>
              </ol>
            </div>
          )}

          {/* TAB: DESKTOP SHORTCUT & BATCH LAUNCHER */}
          {activeTab === 'shortcut' && (
            <div className="bg-stone-950 border border-stone-800 p-4 sm:p-5 rounded-2xl space-y-3 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <span>📁 Descarga el Lanzador de Windows (.bat / .url):</span>
              </div>
              <p className="text-stone-300">
                Puedes descargar un archivo de inicio rápido para colocarlo en tu Escritorio de Windows y abrir Food Planet directamente con un doble clic:
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={handleDownloadWindowsShortcut}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-colors border border-stone-700"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  Descargar Acceso Directo (.url)
                </button>

                <button
                  onClick={handleDownloadWindowsAppLauncher}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-colors shadow-md"
                >
                  <Laptop className="w-3.5 h-3.5" />
                  Descargar Lanzador Modo App (.bat)
                </button>
              </div>

              {downloadSuccess && (
                <div className="text-emerald-400 font-bold flex items-center gap-1.5 pt-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  ¡Archivo descargado! Muévelo a tu Escritorio de Windows para iniciar con doble clic.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Benefits of Windows Installed Version */}
        <div className="pt-2 border-t border-stone-800">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
            Ventajas de la versión para Windows:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800/80">
              <strong className="text-white block font-bold mb-0.5">🖥️ Ventana Completa</strong>
              <span className="text-[11px] text-stone-400">
                Sin barras de navegación ni distracciones para cajeros o meseros.
              </span>
            </div>
            <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800/80">
              <strong className="text-white block font-bold mb-0.5">⚡ Acceso Rápido</strong>
              <span className="text-[11px] text-stone-400">
                Ícono en el escritorio y barra de tareas como cualquier programa .exe.
              </span>
            </div>
            <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800/80">
              <strong className="text-white block font-bold mb-0.5">🖨️ Impresión Directa</strong>
              <span className="text-[11px] text-stone-400">
                Envía tickets térmicos a impresoras térmicas conectadas por USB en Windows.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-stone-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-xl text-xs cursor-pointer transition-colors"
          >
            Entendido / Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
