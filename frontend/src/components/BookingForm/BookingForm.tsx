// src/components/BookingForm/BookingForm.tsx
import { useState, useEffect } from 'react';
import { useApp } from '@/store';
import { Button } from '@/components/Button';
import type { Booking } from '@/types';

interface BookingFormProps {
  onClose: () => void;
  booking?: Booking;
}

export function BookingForm({ onClose, booking }: BookingFormProps) {
  const { data, addBooking, updateBooking } = useApp();
  const [form, setForm] = useState({
    resourceType: 'room' as 'room' | 'asset',
    resourceId: '',
    title: '',
    start: '',
    end: '',
    notes: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (booking) {
      setForm({
        resourceType: booking.resourceType,
        resourceId: booking.resourceId,
        title: booking.title,
        start: new Date(booking.start).toISOString().slice(0, 16),
        end: new Date(booking.end).toISOString().slice(0, 16),
        notes: booking.notes,
      });
    }
  }, [booking]);

  const allResources = [
    ...data.rooms.map(r => ({ id: r.id, name: r.name, type: 'room' })),
    ...data.assets.map(a => ({ id: a.id, name: a.name, type: 'asset' })),
  ];

  const handleSubmit = (e: React.FormEvent) => {
    console.log('Submit clicked', form);
    e.preventDefault();
    setError('');
    if (!form.resourceId) {
      setError('Выберите ресурс.');
      return;
    }
    if (!form.title.trim()) {
      setError('Введите название.');
      return;
    }
    if (!form.start || !form.end) {
      setError('Выберите даты начала и окончания.');
      return;
    }
    try {
      const startDate = new Date(form.start);
      const endDate = new Date(form.end);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        setError('Неверный формат даты.');
        return;
      }
      if (startDate >= endDate) {
        setError('Время окончания должно быть позже начала.');
        return;
      }
      if (booking) {
        // Проверка на пересечения при обновлении
        const hasConflict = data.bookings.some(b =>
          b.id !== booking.id &&
          b.resourceId === form.resourceId &&
          b.resourceType === form.resourceType &&
          ((startDate < new Date(b.end) && endDate > new Date(b.start)))
        );
        if (hasConflict) {
          setError('Пересечение с существующей бронью!');
          return;
        }
        updateBooking(booking.id, {
          resourceType: form.resourceType,
          resourceId: form.resourceId,
          title: form.title.trim(),
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          notes: form.notes.trim(),
        });
        alert('Бронирование обновлено!');
      } else {
        const newBooking: Booking = {
          id: Date.now().toString(),
          resourceType: form.resourceType,
          resourceId: form.resourceId,
          title: form.title.trim(),
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          notes: form.notes.trim(),
        };
        addBooking(newBooking);
        alert('Бронирование добавлено!');
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
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
        <h2>{booking ? 'Редактировать бронирование' : 'Добавить бронирование'}</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ marginBottom: 10 }}>
          <label>Тип ресурса:</label>
          <select
            value={form.resourceType}
            onChange={e => setForm({ ...form, resourceType: e.target.value as 'room' | 'asset', resourceId: '' })}
          >
            <option value="room">Аудитория</option>
            <option value="asset">Инвентарь</option>
          </select>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Ресурс:</label>
          <select
            value={form.resourceId}
            onChange={e => setForm({ ...form, resourceId: e.target.value })}
            required
          >
            <option value="">Выберите</option>
            {allResources.filter(r => r.type === form.resourceType).map(res => (
              <option key={res.id} value={res.id}>{res.name}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Название:</label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Начало:</label>
          <input
            type="datetime-local"
            value={form.start}
            onChange={e => setForm({ ...form, start: e.target.value })}
            required
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Конец:</label>
          <input
            type="datetime-local"
            value={form.end}
            onChange={e => setForm({ ...form, end: e.target.value })}
            required
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Примечания:</label>
          <textarea
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
          />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button type="submit">{booking ? 'Обновить' : 'Добавить'}</Button>
          <Button variant="secondary" onClick={onClose}>Отмена</Button>
        </div>
      </form>
    </div>
  );
}