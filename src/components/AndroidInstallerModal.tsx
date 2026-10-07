import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  Smartphone,
  Download,
  X,
  CheckCircle,
  ExternalLink,
  Flame,
  ShieldCheck,
  FileCode,
  Layers,
  Sparkles,
  QrCode,
} from 'lucide-react';
import { FoodPlanetLogo } from './FoodPlanetLogo';

interface AndroidInstallerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidInstallerModal: React.FC<AndroidInstallerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'direct' | 'apk_generator' | 'qr'>('direct');
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 3000);
  };

  const handleDownloadTwaManifest = () => {
    const twaContent = JSON.stringify(
      {
        packageId: 'com.foodplanet.pos',
        host: window.location.host,
        name: 'Food Planet - Sistema de Restaurante',
        launcherName: 'Food Planet',
        themeColor: '#E11D48',
        navigationColor: '#0C0A09',
        backgroundColor: '#0C0A09',
        enableNotifications: true,
        startUrl: '/',
        iconUrl: `${window.location.origin}/pwa-512x512.png`,
        maskableIconUrl: `${window.location.origin}/pwa-512x512.png`,
        appVersionCode: 1,
        appVersionName: '1.0.0',
        webManifestUrl: `${window.location.origin}/manifest.json`,
      },
      null,
      2
    );

    const blob = new Blob([twaContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'twa-manifest.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
            <Smartphone className="w-7 h-7" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                Versión para Sistema Operativo Android
              </span>
              <span className="text-[10px] bg-emerald-600/30 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                APK / WebAPK
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Instalar Food Planet en Teléfonos y Tablets Android
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Instala la aplicación en dispositivos móviles para tomar pedidos en mesa, gestionar comandas de cocina o caja rápida.
            </p>
          </div>
        </div>

        {/* 1-Click Action if browser supports beforeinstallprompt */}
        {isInstallable && !isInstalled && (
          <div className="bg-linear-to-r from-emerald-950/60 via-stone-900 to-amber-950/40 p-4 sm:p-5 rounded-2xl border border-emerald-500/40 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold text-emerald-400 flex items-center justify-center sm:justify-start gap-1.5">
                <Flame className="w-4 h-4 text-emerald-400" />
                Instalación Directa Detectada
              </span>
              <p className="text-sm font-bold text-white">
                Tu dispositivo Android puede generar e instalar el APK en 1 toque
              </p>
              <p className="text-xs text-stone-300">
                Android creará el paquete con el icono oficial en tu cajón de aplicaciones.
              </p>
            </div>

            <button
              onClick={install}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer active:scale-95 transition-all whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              Instalar APK Ahora
            </button>
          </div>
        )}

        {isInstalled && (
          <div className="bg-emerald-950/30 border border-emerald-500/40 p-4 rounded-2xl flex items-center gap-3 text-emerald-300 text-xs font-medium">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              ¡Food Planet ya está instalado como aplicación en este dispositivo! Puedes abrirlo desde tu pantalla de inicio.
            </span>
          </div>
        )}

        {/* Tabs */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Opciones de Instalación para Android
            </h3>

            {/* Tab switchers */}
            <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('direct')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'direct'
                    ? 'bg-emerald-500 text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Instalación Directa (Nativa)
              </button>
              <button
                onClick={() => setActiveTab('apk_generator')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'apk_generator'
                    ? 'bg-emerald-500 text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Generador de APK (.apk)
              </button>
              <button
                onClick={() => setActiveTab('qr')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'qr'
                    ? 'bg-emerald-500 text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Abrir en tu Celular
              </button>
            </div>
          </div>

          {/* TAB 1: DIRECT WEBAK INSTALLATION */}
          {activeTab === 'direct' && (
            <div className="bg-stone-950 border border-stone-800 p-4 sm:p-5 rounded-2xl space-y-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span>🤖 Pasos para instalar en tu celular o tablet Android:</span>
              </div>
              <ol className="list-decimal list-inside space-y-2.5 text-stone-300 leading-relaxed pl-1">
                <li>
                  Abre <strong>Google Chrome</strong> o <strong>Samsung Internet</strong> en tu teléfono Android.
                </li>
                <li>
                  Ingresa a la dirección web de Food Planet.
                </li>
                <li>
                  Toca el menú de los <strong>tres puntos verticales (⋮)</strong> en la esquina superior derecha.
                </li>
                <li>
                  Selecciona la opción <strong>«Instalar aplicación»</strong> (o <em>«Agregar a la pantalla principal»</em>).
                </li>
                <li>
                  Pulsa <strong>«Instalar»</strong>. El sistema operativo Android generará el paquete <strong>WebAPK nativo</strong> con el logotipo oficial de Food Planet, funcionando como cualquier app descargada de Play Store.
                </li>
              </ol>
            </div>
          )}

          {/* TAB 2: STANDALONE APK BUILDER */}
          {activeTab === 'apk_generator' && (
            <div className="bg-stone-950 border border-stone-800 p-4 sm:p-5 rounded-2xl space-y-3.5 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <span>Compilar y Descargar archivo .APK para distribuir:</span>
              </div>
              <p className="text-stone-300 leading-relaxed">
                Si necesitas el archivo instalador <strong>.apk</strong> para instalarlo manualmente en varios celulares o tablets de tus meseros sin usar la tienda:
              </p>

              <div className="p-3.5 bg-stone-900 rounded-xl border border-stone-800 space-y-2">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>1. Generador Oficial en 1 Clic (PWABuilder / Google TWA)</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-800">
                    Gratis & Automático
                  </span>
                </div>
                <p className="text-stone-400 text-[11px]">
                  Genera el archivo <code className="text-amber-400 font-mono">app-release.apk</code> firmado listo para instalar en cualquier versión de Android.
                </p>
                <a
                  href={`https://www.pwabuilder.com/?url=${encodeURIComponent(window.location.origin)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors shadow-md mt-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Abrir Generador de APK con la URL de Food Planet
                </a>
              </div>

              <div className="p-3.5 bg-stone-900 rounded-xl border border-stone-800 space-y-2">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>2. Manifiesto TWA para Android Studio / Bubblewrap</span>
                </div>
                <p className="text-stone-400 text-[11px]">
                  Descarga el archivo de configuración <code className="text-stone-300 font-mono">twa-manifest.json</code> para compilarlo con Android SDK o Bubblewrap CLI.
                </p>
                <button
                  onClick={handleDownloadTwaManifest}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-xl text-xs transition-colors border border-stone-700 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  Descargar twa-manifest.json
                </button>
              </div>

              <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl text-amber-300 text-[11px]">
                <strong>Nota al instalar APKs manuales en Android:</strong> Si instalas el archivo .apk descargado, tu celular te pedirá habilitar <em>«Permitir la instalación de aplicaciones desconocidas»</em> en Ajustes $\rightarrow$ Seguridad.
              </div>
            </div>
          )}

          {/* TAB 3: QR CODE TO OPEN ON ANDROID PHONE */}
          {activeTab === 'qr' && (
            <div className="bg-stone-950 border border-stone-800 p-4 sm:p-5 rounded-2xl space-y-4 text-xs text-center">
              <div>
                <h4 className="font-bold text-white text-sm">
                  Abre la aplicación en tu teléfono Android
                </h4>
                <p className="text-stone-400 text-xs mt-1">
                  Copia el enlace para abrirlo en Chrome en tu celular y pulsar "Instalar aplicación":
                </p>
              </div>

              <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 flex items-center justify-between gap-2 max-w-md mx-auto">
                <span className="font-mono text-stone-300 truncate text-[11px]">
                  {currentUrl}
                </span>
                <button
                  onClick={handleCopyUrl}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shrink-0 cursor-pointer transition-colors"
                >
                  {copiedUrl ? '¡Copiado!' : 'Copiar URL'}
                </button>
              </div>

              <p className="text-[11px] text-stone-400">
                Una vez abierto en tu celular Android, pulsa el botón verde de instalación para tener la app nativa en tu pantalla de inicio.
              </p>
            </div>
          )}
        </div>

        {/* Benefits for Android POS */}
        <div className="pt-2 border-t border-stone-800">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
            Ventajas de Food Planet en Android:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800/80">
              <strong className="text-white block font-bold mb-0.5">📱 Meseros en Mesa</strong>
              <span className="text-[11px] text-stone-400">
                Toma pedidos directamente desde cualquier teléfono o tablet de los meseros.
              </span>
            </div>
            <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800/80">
              <strong className="text-white block font-bold mb-0.5">⚡ Sin Internet</strong>
              <span className="text-[11px] text-stone-400">
                La aplicación guarda las comandas en el almacenamiento local de Android.
              </span>
            </div>
            <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800/80">
              <strong className="text-white block font-bold mb-0.5">🖨️ Impresión Bluetooth</strong>
              <span className="text-[11px] text-stone-400">
                Imprime tickets térmicos directamente a impresoras portátiles bluetooth o de red.
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
