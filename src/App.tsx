import React, { useState } from 'react';
import { RestaurantProvider } from './context/RestaurantContext';
import { Navbar, ActiveTab } from './components/Navbar';
import { MenuSheet } from './components/MenuSheet/MenuSheet';
import { POSView } from './components/POS/POSView';
import { KitchenView } from './components/Kitchen/KitchenView';
import { InventoryView } from './components/Inventory/InventoryView';
import { DishManagerView } from './components/DishManager/DishManagerView';
import { ReportsView } from './components/Reports/ReportsView';
import { WindowsInstallerModal } from './components/WindowsInstallerModal';
import { AndroidInstallerModal } from './components/AndroidInstallerModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('menu_sheet');
  const [windowsInstallerOpen, setWindowsInstallerOpen] = useState(false);
  const [androidInstallerOpen, setAndroidInstallerOpen] = useState(false);

  return (
    <RestaurantProvider>
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenWindowsInstaller={() => setWindowsInstallerOpen(true)}
          onOpenAndroidInstaller={() => setAndroidInstallerOpen(true)}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'menu_sheet' && (
            <MenuSheet
              onOpenWindowsInstaller={() => setWindowsInstallerOpen(true)}
              onOpenAndroidInstaller={() => setAndroidInstallerOpen(true)}
            />
          )}
          {activeTab === 'pos' && <POSView />}
          {activeTab === 'kitchen' && <KitchenView />}
          {activeTab === 'inventory' && <InventoryView />}
          {activeTab === 'dishes' && <DishManagerView />}
          {activeTab === 'reports' && <ReportsView />}
        </main>

        <WindowsInstallerModal
          isOpen={windowsInstallerOpen}
          onClose={() => setWindowsInstallerOpen(false)}
        />

        <AndroidInstallerModal
          isOpen={androidInstallerOpen}
          onClose={() => setAndroidInstallerOpen(false)}
        />
      </div>
    </RestaurantProvider>
  );
}
