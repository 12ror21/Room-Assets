// src/pages/Home/HomePage.tsx
import { useState } from 'react';
import { useApp } from '@/store';
import { Button } from '@/components/Button';
import { ResourceForm } from '@/components/ResourceForm';

export function HomePage() {
  const { data, deleteRoom, deleteAsset } = useApp();
  const [showForm, setShowForm] = useState<'room' | 'asset' | null>(null);

  return (
    <div>
      <h1>Каталог ресурсов</h1>
      <div style={{ marginBottom: 16 }}>
        <Button onClick={() => setShowForm('room')}>Добавить аудиторию</Button>
        <Button onClick={() => setShowForm('asset')} style={{ marginLeft: 10 }}>Добавить инвентарь</Button>
      </div>
      <h2>Аудитории</h2>
      <ul>
        {data.rooms.map(room => (
          <li key={room.id} style={{ marginBottom: 8 }}>
            {room.name} - Вместимость: {room.capacity}, Особенности: {room.features.join(', ') || 'нет'}
            <Button variant="secondary" size="sm" onClick={() => deleteRoom(room.id)} style={{ marginLeft: 10 }}>Удалить</Button>
          </li>
        ))}
      </ul>
      <h2>Инвентарь</h2>
      <ul>
        {data.assets.map(asset => (
          <li key={asset.id} style={{ marginBottom: 8 }}>
            {asset.name} - Код: {asset.inventoryCode}, Статус: {asset.status}
            <Button variant="secondary" size="sm" onClick={() => deleteAsset(asset.id)} style={{ marginLeft: 10 }}>Удалить</Button>
          </li>
        ))}
      </ul>
      {showForm && <ResourceForm type={showForm} onClose={() => setShowForm(null)} />}
    </div>
  );
}