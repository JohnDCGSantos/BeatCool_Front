/*import { useState, useEffect } from 'react'
import '../styles/drumKitPage.css'

function DrumKitSounds({ drumSounds, handleSoundClick }) {
  const [keyAssignments, setKeyAssignments] = useState({})
  const [pressedKey, setPressedKey] = useState(null)
  const [lastTapTime, setLastTapTime] = useState(0);

 
  
  useEffect(() => {
    if (drumSounds) {
      const keys = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ç', 'z', 'x', 'c','v','b','n','m']

      const newKeyAssignments = {}

      drumSounds.forEach((sound, index) => {
        const soundUrl = sound?.soundUrl
        if (soundUrl) {
          newKeyAssignments[soundUrl] = keys[index % keys.length]
        }
      })

      setKeyAssignments(newKeyAssignments)
    }
  }, [drumSounds])


  const handleTouchStart = (event, soundUrl) => {
    const now = Date.now();
    if (now - lastTapTime < 100) {
      // Ignore rapid consecutive taps (less than 100ms)
      return;
    }
    setLastTapTime(now);

    handleSoundClick(soundUrl);
    setPressedKey(soundUrl); 
  };


  const handleTouchEnd = () => {
    setPressedKey(null); 
  };

  
  useEffect(() => {
    // Add passive: false to preventDefault in a touch event listener without causing  warning
    document.addEventListener('touchstart', (event) => {
      if (event.target.closest('.drum-sound-btn')) {
      event.preventDefault();
      }
    }, { passive: false });

    return () => {
      document.removeEventListener('touchstart', (event) => {
        
        if (event.target.closest('.drum-sound-btn')) {
          event.preventDefault();
          }
      });
    };
  }, []);
 

  useEffect(() => {
    const handleKeyDown = event => {
      if (drumSounds) {
        const soundUrl = Object.keys(keyAssignments).find(
          url => keyAssignments[url] === event.key.toLowerCase()
        )
        
          handleSoundClick(soundUrl)
          setPressedKey(soundUrl) 
        
      }
    }

    const handleKeyUp = () => {
      setPressedKey(null) 
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [keyAssignments, drumSounds, handleSoundClick])

  

  
  return (

<div className="drum-kit-sounds" id="drumKitSounds">
{drumSounds &&
  drumSounds.map(drumSound => (
    <div className={`drum-sound-btn ${drumSound.soundUrl === pressedKey ? 'pressed' : ''}`} key={drumSound?.soundUrl}>
     <button
      className={drumSound.soundUrl === pressedKey ? 'pressed' : ''}
      onMouseDown={() => handleSoundClick(drumSound.soundUrl)}
      onTouchStart={(event) => handleTouchStart(event, drumSound.soundUrl)}
      onTouchEnd={handleTouchEnd}
     >
         
        <span>{drumSound?.name}</span>
             
        <span className='span2'>{keyAssignments[drumSound?.soundUrl]}</span> 

      </button>
      </div>
    ))}
</div>
  )
}

export default DrumKitSounds*/ 

import { useState, useEffect } from 'react';
import '../styles/drumKitPage.css';

function DrumKitSounds({ drumSounds, handleSoundClick }) {
  const [keyAssignments, setKeyAssignments] = useState({});
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [lastTapTime, setLastTapTime] = useState(0);

  useEffect(() => {
    if (drumSounds) {
      const keys = [
        'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ç',
        'z', 'x', 'c', 'v', 'b', 'n', 'm'
      ];

      const newKeyAssignments = {};

      drumSounds.forEach((sound, index) => {
        const soundUrl = sound?.soundUrl;
        if (soundUrl) {
          newKeyAssignments[soundUrl] = keys[index % keys.length];
        }
      });

      setKeyAssignments(newKeyAssignments);
    }
  }, [drumSounds]);

  const handleTouchStart = (event, soundUrl) => {
    const now = Date.now();
    if (now - lastTapTime < 100) {
      // Ignore rapid consecutive taps (less than 100ms)
      return;
    }
    setLastTapTime(now);

    handleSoundClick(soundUrl);
    setPressedKeys(prevKeys => new Set(prevKeys).add(soundUrl));
  };

  const handleTouchEnd = (soundUrl) => {
    setPressedKeys(prevKeys => {
      const newKeys = new Set(prevKeys);
      newKeys.delete(soundUrl);
      return newKeys;
    });
  };
  
  useEffect(() => {
    const handleMultiTouchStart = (event) => {
      for (let touch of event.touches) {
        const target = touch.target.closest('.drum-sound-btn');
        if (event.target.closest('.drum-sound-btn')) {
          event.preventDefault();
          }
        if (target) {
          const soundUrl = target.getAttribute('data-sound-url');
          handleTouchStart(event, soundUrl);
        }
      }
    };

    const handleMultiTouchEnd = (event) => {
      for (let touch of event.changedTouches) {
        const target = touch.target.closest('.drum-sound-btn');
        if (target) {
          const soundUrl = target.getAttribute('data-sound-url');
          handleTouchEnd(soundUrl);
        }
      }
    };

    document.addEventListener('touchstart', handleMultiTouchStart, { passive: false });
    document.addEventListener('touchend', handleMultiTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleMultiTouchStart);
      document.removeEventListener('touchend', handleMultiTouchEnd);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = event => {
      if (drumSounds) {
        const soundUrl = Object.keys(keyAssignments).find(
          url => keyAssignments[url] === event.key.toLowerCase()
        );

        if (soundUrl) {
          handleSoundClick(soundUrl);
          setPressedKeys(prevKeys => new Set(prevKeys).add(soundUrl));
        }
      }
    };

    const handleKeyUp = event => {
      if (drumSounds) {
        const soundUrl = Object.keys(keyAssignments).find(
          url => keyAssignments[url] === event.key.toLowerCase()
        );

        if (soundUrl) {
          setPressedKeys(prevKeys => {
            const newKeys = new Set(prevKeys);
            newKeys.delete(soundUrl);
            return newKeys;
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keyAssignments, drumSounds, handleSoundClick]);

  return (
    <div className="drum-kit-sounds" id="drumKitSounds">
      {drumSounds &&
        drumSounds.map(drumSound => (
          <div
            className={`drum-sound-btn ${pressedKeys.has(drumSound.soundUrl) ? 'pressed' : ''}`}
            key={drumSound?.soundUrl}
            data-sound-url={drumSound.soundUrl}
          >
            <button
              className={pressedKeys.has(drumSound.soundUrl) ? 'pressed' : ''}
              onMouseDown={() => handleSoundClick(drumSound.soundUrl)}
              onTouchStart={(event) => handleTouchStart(event, drumSound.soundUrl)}
              onTouchEnd={() => handleTouchEnd(drumSound.soundUrl)}
            >
              <span>{drumSound?.name}</span>
              <span className='span2'>{keyAssignments[drumSound?.soundUrl]}</span>
            </button>
          </div>
        ))}
    </div>
  );
}

export default DrumKitSounds;
