import { useState, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';
import { Download, Upload, RefreshCw } from 'lucide-react';

export function SaveManager() {
  const exportSave = useGameStore((state) => state.exportSave);
  const importSave = useGameStore((state) => state.importSave);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const saveData = JSON.parse(content);
        importSave(saveData);
        alert('存档导入成功！');
      } catch (err) {
        setImportError('导入失败，请确保选择了正确的存档文件。');
        console.error('Import error:', err);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="p-6 bg-carbon-800 border border-carbon-600 rounded-xl">
      <h3 className="text-lg font-semibold text-white mb-4">存档管理</h3>
      <div className="space-y-3">
        <button
          onClick={exportSave}
          className="w-full bg-fuel-gold text-carbon-950 hover:bg-fuel-gold/90 transition-colors flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-lg"
        >
          <Download className="w-4 h-4" />
          导出存档
        </button>
        <div className="relative">
          <button
            onClick={handleImportClick}
            className="w-full bg-carbon-600 text-white hover:bg-carbon-500 transition-colors flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-lg"
          >
            <Upload className="w-4 h-4" />
            导入存档
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
        {importError && (
          <p className="text-sm text-red-400 text-center">{importError}</p>
        )}
        <div className="pt-4 border-t border-carbon-600">
          <p className="text-sm text-gray-400 text-center">
            导出的存档文件可以分享给其他玩家，或保存到GitHub上进行跨设备游玩
          </p>
        </div>
      </div>
    </div>
  );
}
