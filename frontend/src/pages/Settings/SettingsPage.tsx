// src/pages/Settings/SettingsPage.tsx
import { useApp } from '@/store';
import { Button } from '@/components/Button';

export function SettingsPage() {
  const { data, setData } = useApp();

  const handleExport = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'room-assets-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        // Валидация: проверить структуру
        if (importedData.rooms && importedData.assets && importedData.bookings) {
          setData(importedData);
          alert('Данные импортированы успешно!');
        } else {
          alert('Неверный формат файла.');
        }
      } catch (error) {
        alert('Ошибка при импорте файла.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <h1>Настройки</h1>
      <div style={{ marginBottom: 16 }}>
        <Button onClick={handleExport}>Экспорт данных в JSON</Button>
      </div>
      <div>
        <label>Импорт данных из JSON:</label>
        <input type="file" accept=".json" onChange={handleImport} />
      </div>
    </div>
  );
}