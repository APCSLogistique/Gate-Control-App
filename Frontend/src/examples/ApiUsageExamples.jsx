/**
 * Exemple d'utilisation des services API
 * Ce fichier montre comment utiliser les services dans des composants React
 */

import React, { useState, useEffect } from 'react';
import {
  useUserProfile,
  useUserBookings,
  useCreateBooking,
  useTimeSlotAvailability,
  useQRCode,
  useScanQRCode,
  useTodaySchedule,
  usePendingIncidents,
  useCreateIncident,
  useAI,
} from '../hooks/useApi';

// ============================================
// EXEMPLE 1: Profil Utilisateur
// ============================================
export function UserProfileExample() {
  const { data: profile, loading, error, refetch } = useUserProfile();

  if (loading) return <div>Chargement du profil...</div>;
  if (error) return <div className="error">Erreur: {error}</div>;

  return (
    <div className="card">
      <h2>Profil Utilisateur</h2>
      <p>Nom: {profile?.name}</p>
      <p>Email: {profile?.email}</p>
      <p>Rôle: {profile?.role}</p>
      <button onClick={refetch}>Actualiser</button>
    </div>
  );
}

// ============================================
// EXEMPLE 2: Liste des Réservations
// ============================================
export function BookingsListExample() {
  const { data: bookings, loading, error } = useUserBookings();

  if (loading) return <div>Chargement des réservations...</div>;
  if (error) return <div className="error">Erreur: {error}</div>;

  return (
    <div className="card">
      <h2>Mes Réservations</h2>
      {bookings?.length === 0 ? (
        <p>Aucune réservation</p>
      ) : (
        <ul>
          {bookings?.map((booking) => (
            <li key={booking.booking_id}>
              {booking.booking_id} - {booking.timeslot.date} à {booking.timeslot.hour_start}h
              <span className={`badge ${booking.status}`}>{booking.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ============================================
// EXEMPLE 3: Créer une Réservation
// ============================================
export function CreateBookingExample() {
  const { createBooking, loading, error } = useCreateBooking();
  const [formData, setFormData] = useState({
    truck_number: '',
    date: '',
    hour_start: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await createBooking({
        truck_number: formData.truck_number,
        user_id: 'current_user_id', // À récupérer du context
        timeslot: {
          date: formData.date,
          hour_start: formData.hour_start,
        },
      });

      alert(`Réservation créée avec succès! ID: ${result.booking_id}`);
      setFormData({ truck_number: '', date: '', hour_start: '' });
    } catch (err) {
      console.error('Erreur lors de la création:', err);
    }
  };

  return (
    <div className="card">
      <h2>Nouvelle Réservation</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Numéro de camion:</label>
          <input
            type="text"
            value={formData.truck_number}
            onChange={(e) => setFormData({ ...formData, truck_number: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Heure:</label>
          <select
            value={formData.hour_start}
            onChange={(e) => setFormData({ ...formData, hour_start: e.target.value })}
            required
          >
            <option value="">Sélectionner...</option>
            {Array.from({ length: 10 }, (_, i) => i + 8).map((hour) => (
              <option key={hour} value={hour}>
                {hour}:00 - {hour + 1}:00
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Création en cours...' : 'Créer la réservation'}
        </button>

        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}

// ============================================
// EXEMPLE 4: Vérifier Disponibilité d'un Créneau
// ============================================
export function TimeSlotAvailabilityExample() {
  const [date, setDate] = useState('2024-02-07');
  const [hour, setHour] = useState('14');

  const { data: availability, loading, error } = useTimeSlotAvailability(date, hour);

  return (
    <div className="card">
      <h2>Disponibilité du Créneau</h2>

      <div className="form-group">
        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Heure:</label>
        <input type="number" min="8" max="17" value={hour} onChange={(e) => setHour(e.target.value)} />
      </div>

      {loading && <p>Vérification...</p>}
      {error && <div className="error">Erreur: {error}</div>}
      {availability && (
        <div className="availability-info">
          <p>Capacité maximale: {availability.max_capacity}</p>
          <p>Places disponibles: {availability.capacity}</p>
          <p>Capacité tardive: {availability.late_capacity}</p>
          <div className={`status ${availability.capacity > 0 ? 'available' : 'full'}`}>
            {availability.capacity > 0 ? '✓ Disponible' : '✗ Complet'}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// EXEMPLE 5: Afficher QR Code
// ============================================
export function QRCodeDisplayExample({ bookingId }) {
  const { data: qrData, loading, error } = useQRCode(bookingId);

  if (loading) return <div>Génération du QR code...</div>;
  if (error) return <div className="error">Erreur: {error}</div>;

  return (
    <div className="card">
      <h2>QR Code</h2>
      {qrData && (
        <div className="qr-code-container">
          {/* Utiliser une bibliothèque QR comme 'qrcode.react' */}
          <div className="qr-placeholder">
            <p>Code: {qrData.qr}</p>
            {/* <QRCodeSVG value={qrData.qr} size={256} /> */}
          </div>
          <button onClick={() => navigator.clipboard.writeText(qrData.qr)}>
            Copier le code
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================
// EXEMPLE 6: Scanner QR Code (Opérateur)
// ============================================
export function QRScannerExample() {
  const { scanQRCode, data, loading, error } = useScanQRCode();
  const [qrInput, setQrInput] = useState('');

  const handleScan = async () => {
    if (!qrInput.trim()) return;

    try {
      const result = await scanQRCode(qrInput);
      alert('QR Code scanné avec succès!');
      console.log('Résultat du scan:', result);
      setQrInput('');
    } catch (err) {
      console.error('Erreur de scan:', err);
    }
  };

  return (
    <div className="card">
      <h2>Scanner QR Code</h2>

      <div className="form-group">
        <label>Code QR:</label>
        <input
          type="text"
          value={qrInput}
          onChange={(e) => setQrInput(e.target.value)}
          placeholder="Collez le code QR ici"
        />
      </div>

      <button onClick={handleScan} disabled={loading || !qrInput}>
        {loading ? 'Scan en cours...' : 'Scanner'}
      </button>

      {error && <div className="error">{error}</div>}
      {data && <div className="success">✓ Scan réussi!</div>}
    </div>
  );
}

// ============================================
// EXEMPLE 7: Planning du Jour (Admin)
// ============================================
export function TodayScheduleExample() {
  const { data: schedule, loading, error, refetch } = useTodaySchedule();

  if (loading) return <div>Chargement du planning...</div>;
  if (error) return <div className="error">Erreur: {error}</div>;

  return (
    <div className="card">
      <h2>Planning d'Aujourd'hui</h2>
      <button onClick={refetch}>Actualiser</button>

      {schedule?.map((daySchedule) => (
        <div key={daySchedule.date}>
          <h3>{daySchedule.date}</h3>
          <p>
            Maximum: {daySchedule.max_shipments} | Réservé: {daySchedule.booked_amount}
          </p>

          <table>
            <thead>
              <tr>
                <th>Heure</th>
                <th>Capacité Max</th>
                <th>Réservé</th>
              </tr>
            </thead>
            <tbody>
              {daySchedule.schedule.map((slot) => (
                <tr key={slot.hour_start}>
                  <td>{slot.hour_start}:00</td>
                  <td>{slot.max_capacity}</td>
                  <td>{slot.booked_capacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

// ============================================
// EXEMPLE 8: Incidents en Attente (Admin)
// ============================================
export function PendingIncidentsExample() {
  const { data: incidents, loading, error, refetch } = usePendingIncidents();

  if (loading) return <div>Chargement des incidents...</div>;
  if (error) return <div className="error">Erreur: {error}</div>;

  return (
    <div className="card">
      <h2>Incidents en Attente</h2>
      <button onClick={refetch}>Actualiser</button>

      {incidents?.length === 0 ? (
        <p>Aucun incident en attente</p>
      ) : (
        <ul>
          {incidents?.map((incident) => (
            <li key={incident.incident_id}>
              <strong>#{incident.booking_id}</strong> - {incident.message}
              <span className="badge">{incident.type}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ============================================
// EXEMPLE 9: Créer un Incident
// ============================================
export function CreateIncidentExample({ bookingId }) {
  const { createIncident, loading, error } = useCreateIncident();
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createIncident({
        booking_id: bookingId,
        message: message,
      });

      alert('Incident créé avec succès!');
      setMessage('');
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  return (
    <div className="card">
      <h2>Signaler un Incident</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Décrivez l'incident..."
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Envoi...' : 'Signaler'}
        </button>

        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}

// ============================================
// EXEMPLE 10: Assistant IA
// ============================================
export function AIAssistantExample() {
  const { chatId, messages, loading, error, createChat, sendMessage, loadMessages } = useAI();
  const [input, setInput] = useState('');

  useEffect(() => {
    // Créer un chat au montage du composant
    createChat();
  }, []);

  useEffect(() => {
    // Charger les messages quand le chat est créé
    if (chatId) {
      loadMessages(chatId);
    }
  }, [chatId]);

  const handleSend = async () => {
    if (!input.trim() || !chatId) return;

    try {
      const response = await sendMessage(input);
      setInput('');
      // Recharger les messages pour inclure la réponse
      await loadMessages(chatId);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  return (
    <div className="card ai-assistant">
      <h2>Assistant IA</h2>

      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg.message_id} className={`message ${msg.sender}`}>
            <div className="message-sender">{msg.sender === 'human' ? 'Vous' : 'Assistant'}</div>
            <div className="message-content">{msg.message}</div>
            <div className="message-time">{new Date(msg.created_at).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>

      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Posez votre question..."
          disabled={loading || !chatId}
        />
        <button onClick={handleSend} disabled={loading || !chatId || !input.trim()}>
          {loading ? 'Envoi...' : 'Envoyer'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}
    </div>
  );
}
