// src/pages/Bookings/BookingsPage.tsx
import { useState } from 'react';
import { useApp } from '@/store';
import { Button } from '@/components/Button';
import { BookingForm } from '@/components/BookingForm';
import type { Booking } from '@/types';

export function BookingsPage() {
  const { data, deleteBooking } = useApp();
  const [filterResource, setFilterResource] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | undefined>();

  const filteredBookings = data.bookings.filter(booking => {
    const matchesResource = !filterResource || booking.resourceId === filterResource;
    const matchesDate = !filterDate || booking.start.startsWith(filterDate);
    return matchesResource && matchesDate;
  });

  const allResources = [
    ...data.rooms.map(r => ({ id: r.id, name: r.name, type: 'room' })),
    ...data.assets.map(a => ({ id: a.id, name: a.name, type: 'asset' })),
  ];

  return (
    <div>
      <h1>Управление бронированием</h1>
      <div style={{ marginBottom: 16 }}>
        <label>
          Фильтр по ресурсу:
          <select value={filterResource} onChange={e => setFilterResource(e.target.value)}>
            <option value="">Все</option>
            {allResources.map(res => (
              <option key={res.id} value={res.id}>{res.name} ({res.type})</option>
            ))}
          </select>
        </label>
        <label style={{ marginLeft: 16 }}>
          Фильтр по дате (YYYY-MM-DD):
          <input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
          />
        </label>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>Название</th>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>Ресурс</th>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>Начало</th>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>Конец</th>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>Примечания</th>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.map(booking => {
            const resource = allResources.find(r => r.id === booking.resourceId);
            return (
              <tr key={booking.id}>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{booking.title}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{resource?.name || 'Неизвестно'}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{new Date(booking.start).toLocaleString()}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{new Date(booking.end).toLocaleString()}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{booking.notes}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>
                  <Button variant="secondary" size="sm" onClick={() => setEditingBooking(booking)}>Редактировать</Button>
                  <Button variant="secondary" size="sm" onClick={() => deleteBooking(booking.id)}>Удалить</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Button onClick={() => setShowForm(true)}>Добавить бронирование</Button>
      {(showForm || editingBooking) && <BookingForm onClose={() => { setShowForm(false); setEditingBooking(undefined); }} booking={editingBooking} />}
    </div>
  );
}