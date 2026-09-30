// src/components/ResourceForm/ResourceForm.tsx
import { useState, useEffect } from 'react';
import { useApp } from '@/store';
import { Button } from '@/components/Button';
import type { Room, Asset } from '@/types';

interface ResourceFormProps {
  type: 'room' | 'asset';
  onClose: () => void;
}

export function ResourceForm({ type, onClose }: ResourceFormProps) {
  const { addRoom, addAsset } = useApp();
  const [form, setForm] = useState<{
    name: string;
    capacity?: number;
    features?: string;
    inventoryCode?: string;
    status?: 'available' | 'unavailable';
  }>(
    type === 'room'
      ? { name: '', capacity: 1, features: '' }
      : { name: '', inventoryCode: '', status: 'available' }
  );
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(
      type === 'room'
        ? { name: '', capacity: 1, features: '' }
        : { name: '', inventoryCode: '', status: 'available' }
    );
  }, [type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (type === 'room') {
      if (!form.name.trim() || (form.capacity ?? 0) <= 0) {
        setError('Заполните название и вместимость > 0.');
        return;
      }
      const room: Room = {
        id: `r-${Date.now()}`,
        name: form.name.trim(),
        capacity: form.capacity!,
        features: form.features!.split(',').map(f => f.trim()).filter(f => f),
      };
      addRoom(room);
    } else {
      if (!form.name.trim() || !form.inventoryCode?.trim()) {
        setError('Заполните название и инвентарный код.');
        return;
      }
      const asset: Asset = {
        id: `a-${Date.now()}`,
        name: form.name.trim(),
        inventoryCode: form.inventoryCode!.trim(),
        status: form.status!,
      };
      addAsset(asset);
    }
    alert(`${type === 'room' ? 'Аудитория' : 'Инвентарь'} добавлен!`);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <form onSubmit={handleSubmit} style={{
        background: '#fff',
        padding: 20,
        borderRadius: 8,
        width: 400,
        maxWidth: '90%',
      }}>
        <h2>Добавить {type === 'room' ? 'аудиторию' : 'инвентарь'}</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ marginBottom: 10 }}>
          <label>Название:</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        {type === 'room' ? (
          <>
            <div style={{ marginBottom: 10 }}>
              <label>Вместимость:</label>
              <input
                type="number"
                value={form.capacity}
                onChange={e => setForm({ ...form, capacity: Number(e.target.value) })}
                min={1}
                required
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Особенности (через запятую):</label>
              <input
                type="text"
                value={form.features}
                onChange={e => setForm({ ...form, features: e.target.value })}
                placeholder="projector, whiteboard"
              />
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 10 }}>
              <label>Инвентарный код:</label>
              <input
                type="text"
                value={form.inventoryCode}
                onChange={e => setForm({ ...form, inventoryCode: e.target.value })}
                required
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Статус:</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value as 'available' | 'unavailable' })}
              >
                <option value="available">Доступен</option>
                <option value="unavailable">Недоступен</option>
              </select>
            </div>
          </>
        )}
        <div style={{ display: 'flex', gap: 10 }}>
          <Button type="submit">Добавить</Button>
          <Button variant="secondary" onClick={onClose}>Отмена</Button>
        </div>
      </form>
    </div>
  );
}