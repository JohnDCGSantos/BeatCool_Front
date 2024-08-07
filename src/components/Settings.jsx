import { useState, useEffect } from 'react';
import '../styles/SettingsModal.css';

function Settings({ drumSounds, colors, setColors, customKeyAssignments, setCustomKeyAssignments, onClose }) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showKeyAssignment, setShowKeyAssignment] = useState(false);
  const [keyAssignments, setKeyAssignments] = useState({});

  useEffect(() => {
    if (drumSounds) {
      const keys = [
        'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ç',
        'z', 'x', 'c', 'v', 'b', 'n', 'm'
      ];

      const defaultKeyAssignments = {};

      drumSounds.forEach((sound, index) => {
        const soundUrl = sound?.soundUrl;
        if (soundUrl) {
          defaultKeyAssignments[soundUrl] = keys[index % keys.length];
        }
      });

      // Update the key assignments to include custom ones if they exist
      setKeyAssignments(prevAssignments => ({
        ...defaultKeyAssignments,
        ...customKeyAssignments
      }));
    }
  }, [drumSounds, customKeyAssignments]);

  const handleColorChange = (soundUrl, color) => {
    setColors(prevColors => ({ ...prevColors, [soundUrl]: color }));
  };

  const handleKeyChange = (soundUrl, newKey) => {
    setCustomKeyAssignments(prevAssignments => ({
      ...prevAssignments,
      [soundUrl]: newKey
    }));
  };

  return (
    <div className="settings-modal">
      <div className="settings-modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Settings</h2>
        <div className="settings-navigation">
          <button 
            style={{height:'auto', padding:'5px'}}
            onClick={() => setShowColorPicker(prev => !prev)}
          >
            {showColorPicker ? 'Hide Pad Colors' : 'Change Pad Colors'}
          </button>

          <button 
            style={{height:'auto', padding:'5px'}}
            onClick={() => setShowKeyAssignment(prev => !prev)}
          >
            {showKeyAssignment ? 'Hide Key Assignments' : 'Change Key Assignments'}
          </button>

          {showColorPicker && (
            <div className="color-settings">
              {drumSounds.map(drumSound => (
                <div key={drumSound.soundUrl} className="color-picker">
                  <label>{drumSound.name}</label>
                  <input
                    type="color"
                    value={colors[drumSound.soundUrl] || '#3BBC80'}
                    onChange={(e) => handleColorChange(drumSound.soundUrl, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          {showKeyAssignment && (
            <div className="key-settings">
              {drumSounds.map(drumSound => (
                <div key={drumSound.soundUrl} className="key-assigner">
                  <label>{drumSound.name}</label>
                  <input
                    style={{backgroundColor:'green', textAlign:'center'}}
                    type="text"
                    value={keyAssignments[drumSound.soundUrl] || ''}
                    maxLength="1"
                    onChange={(e) => handleKeyChange(drumSound.soundUrl, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;