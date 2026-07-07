'use client';

import { useState, FormEvent } from 'react';
import axios from 'axios';

interface FormData {
  name: string;
  email: string;
  phone: string;
  agenda: string;
  meetingDate: string;
}

export default function BookingForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    agenda: '',
    meetingDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const { data } = await axios.post(`${apiUrl}/api/bookings`, formData);
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Something went wrong. Please try again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const textFields = [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', icon: '👤' },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@company.com', icon: '📧' },
    { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 (555) 000-0000', icon: '📱' },
    { name: 'meetingDate', label: 'Preferred Date & Time', type: 'datetime-local', placeholder: '', icon: '📅' },
  ];

  return (
    <div className="glass-card" style={{ padding: '40px' }}>
      {/* Form header */}
      <div style={{ marginBottom: '32px' }}>
        <h2
          style={{
            color: 'white',
            fontSize: '24px',
            fontWeight: '700',
            margin: '0 0 8px',
            letterSpacing: '-0.02em',
          }}
        >
          Schedule Your Session
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0 }}>
          Fill in the details below. You&apos;ll be redirected to Stripe for payment.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
      >
        {/* Text / email / tel / datetime-local fields */}
        {textFields.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              style={{
                display: 'block',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '8px',
                letterSpacing: '0.01em',
              }}
            >
              {field.icon} {field.label}
            </label>
            <input
              id={field.name}
              className="input-field"
              type={field.type}
              name={field.name}
              value={formData[field.name as keyof FormData]}
              onChange={handleChange}
              placeholder={field.placeholder}
              required
              style={{ colorScheme: 'dark' }}
            />
          </div>
        ))}

        {/* Agenda textarea */}
        <div>
          <label
            htmlFor="agenda"
            style={{
              display: 'block',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '13px',
              fontWeight: '500',
              marginBottom: '8px',
            }}
          >
            📋 Meeting Agenda
          </label>
          <textarea
            id="agenda"
            className="input-field"
            name="agenda"
            value={formData.agenda}
            onChange={handleChange}
            placeholder="Describe what you'd like to discuss in this session..."
            required
            rows={4}
            style={{ resize: 'vertical', minHeight: '100px' }}
          />
        </div>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              padding: '12px 16px',
              color: '#fca5a5',
              fontSize: '14px',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Pricing summary */}
        <div
          style={{
            marginTop: '8px',
            padding: '16px',
            background: 'rgba(99,102,241,0.08)',
            borderRadius: '12px',
            border: '1px solid rgba(99,102,241,0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ color: 'white', fontWeight: '600' }}>
              1-Hour Consulting Session
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
              Includes calendar invite + email confirmation
            </div>
          </div>
          <div style={{ color: '#a5b4fc', fontWeight: '700', fontSize: '22px' }}>
            $99
          </div>
        </div>

        {/* Submit button */}
        <button
          id="submit-booking"
          type="submit"
          className="gradient-btn"
          disabled={loading}
          style={{
            padding: '16px',
            borderRadius: '12px',
            fontSize: '16px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <>
              <span
                style={{
                  display: 'inline-block',
                  width: '18px',
                  height: '18px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              Redirecting to Payment...
            </>
          ) : (
            <>Proceed to Payment →</>
          )}
        </button>

        {/* Security note */}
        <p
          style={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.35)',
            fontSize: '12px',
            margin: 0,
          }}
        >
          🔒 Secured by Stripe. We never store your card details.
        </p>
      </form>
    </div>
  );
}
