import { GameState } from '../types/game';

const DB_NAME = 'GT3RacingManagerDB';
const DB_VERSION = 1;
const STORE_NAME = 'saves';

export interface SaveSlot {
  id: number;
  name: string;
  timestamp: number;
  gameState: GameState;
  thumbnail?: string;
}

class SaveManager {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Failed to open database:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async save(slotId: number, gameState: GameState, name?: string): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const saveData: SaveSlot = {
        id: slotId,
        name: name || `存档 ${slotId}`,
        timestamp: Date.now(),
        gameState,
        thumbnail: this.generateThumbnail(gameState)
      };

      const request = store.put(saveData);

      request.onsuccess = () => resolve();
      request.onerror = () => {
        console.error('Failed to save:', request.error);
        reject(request.error);
      };
    });
  }

  async load(slotId: number): Promise<SaveSlot | null> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(slotId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => {
        console.error('Failed to load:', request.error);
        reject(request.error);
      };
    });
  }

  async delete(slotId: number): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(slotId);

      request.onsuccess = () => resolve();
      request.onerror = () => {
        console.error('Failed to delete:', request.error);
        reject(request.error);
      };
    });
  }

  async listSaves(): Promise<SaveSlot[]> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const saves = (request.result as SaveSlot[]).sort((a, b) => b.timestamp - a.timestamp);
        resolve(saves);
      };
      request.onerror = () => {
        console.error('Failed to list saves:', request.error);
        reject(request.error);
      };
    });
  }

  async exportSave(slotId: number): Promise<string> {
    const save = await this.load(slotId);
    if (!save) {
      throw new Error('Save not found');
    }
    return JSON.stringify(save, null, 2);
  }

  async importSave(jsonString: string): Promise<SaveSlot> {
    const saveData = JSON.parse(jsonString) as SaveSlot;
    
    if (!saveData.gameState || !saveData.id) {
      throw new Error('Invalid save data format');
    }

    const slotId = saveData.id;
    await this.save(slotId, saveData.gameState, saveData.name);
    
    return saveData;
  }

  downloadSave(slotId: number): void {
    this.exportSave(slotId)
      .then(jsonString => {
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gt3_save_${slotId}_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Failed to download save:', error);
        alert('下载存档失败: ' + error.message);
      });
  }

  uploadSave(callback: (save: SaveSlot) => void): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const save = await this.importSave(text);
        callback(save);
        alert('存档导入成功!');
      } catch (error) {
        console.error('Failed to import save:', error);
        alert('导入存档失败: ' + (error as Error).message);
      }
    };

    input.click();
  }

  private generateThumbnail(gameState: GameState): string {
    return `Season ${gameState.currentSeason} - ${gameState.team.name}`;
  }

  async getAutoSave(): Promise<SaveSlot | null> {
    return this.load(0);
  }

  async autoSave(gameState: GameState): Promise<void> {
    await this.save(0, gameState, '自动存档');
  }
}

export const saveManager = new SaveManager();
