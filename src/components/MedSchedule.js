import React from 'react';

const MedSchedule = ({ medications }) => {
  return (
    <div className="med-list">
      {medications.length === 0 ? (
        <p style={{color: '#64748b'}}>No medications added yet.</p>
      ) : (
        medications.map((med, index) => (
          <div key={index} className="med-card">
            <h3 style={{margin: '0 0 8px 0', color: '#0f172a'}}>{med.name}</h3>
            <div style={{fontSize: '13px', color: '#475569'}}>
              <p><strong>Dosage:</strong> {med.dosage}</p>
              <p><strong>Frequency:</strong> {med.frequency}</p>
              <p><strong>Schedule:</strong> {med.times.join(', ')}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MedSchedule;