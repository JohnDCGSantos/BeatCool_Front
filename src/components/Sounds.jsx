/*import { useEffect, useState } from 'react'
import '../styles/create.css'
import { useRef } from 'react'
function Sounds({ sounds,  handleSoundSelect, selectedSounds }) {
  //const [selectedOption, setSelectedOption] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('Basico')
  const [selectedCategory, setSelectedCategory] = useState('Basic')
  const [maxSoundsReached, setMaxSoundsReached] = useState(false);
  const audioRefs = useRef({})

  /*const handleOptionChange = option => {
    setSelectedOption(option)
    setSelectedGenre('')
    setSelectedCategory('')
  }*/
  /*useEffect(() => {
    const preloadSounds = () => {
      const soundsToPreload = sounds
        .filter((sound) => sound.genre === selectedGenre && sound.category === selectedCategory)
        .map((sound) => sound.soundUrl);

      soundsToPreload.forEach((soundUrl) => {
        const audio = new Audio(soundUrl);
        audio.preload = 'auto';
        audioRefs.current[soundUrl] = audio;
      });
    };

    preloadSounds();
  }, [sounds, selectedGenre, selectedCategory]);

  // Preload selected sounds
  useEffect(() => {
    selectedSounds.forEach((sound) => {
      if (!audioRefs.current[sound.soundUrl]) {
        const audio = new Audio(sound.soundUrl);
        audio.preload = 'auto';
        audioRefs.current[sound.soundUrl] = audio;
      }
    });
  }, [selectedSounds]);
  const handleGenreChange = event => {
    setSelectedGenre(event.target.value)
    setSelectedCategory('') // Reset selected category when genre changes
  }
  useEffect(() => {
    handleGenreChange
  }, [sounds])
  
  const handleCategoryChange = event => {
    setSelectedCategory(event.target.value)
  }

  /*const handleSoundNameClick = (event, soundUrl) => {
    event.stopPropagation() // Prevent event bubbling to parent elements
    handleSoundClick(soundUrl)
  }*/

  /*const handleCheckboxChange = (event, sound) => {
    event.stopPropagation(); // Prevent event bubbling to parent elements
    
    if (selectedSounds.length >= 24 && !selectedSounds.some(selectedSound => selectedSound.soundUrl === sound.soundUrl)) {
      setMaxSoundsReached(true);
      return;
    }
    
    setMaxSoundsReached(false); // Reset the state if the limit is not reached
    handleSoundSelect(sound);
  }
  /*const handleSelectedSoundClick = (event, soundUrl) => {
    event.stopPropagation() // Prevent event bubbling to parent elements
    playSound(soundUrl)
  }*/

 /* const playSound = soundUrl => {
    const audio = new Audio(soundUrl)
    audio.currentTime = 0
    audio.play().catch(error => console.error(`Failed to play sound: ${error}`))
  }

  const handlePlayButtonClick = soundUrl => {
    playSound(soundUrl)
  }

  // Group sounds by genre and category
  const groupedSounds = {}
  sounds.forEach(sound => {
    if (!groupedSounds[sound.genre]) {
      groupedSounds[sound.genre] = {}
    }
    if (!groupedSounds[sound.genre][sound.category]) {
      groupedSounds[sound.genre][sound.category] = []
    }
    groupedSounds[sound.genre][sound.category].push(sound)
  })

  return (
    <div>
      <div className='selectCards'>
        <div className='categoriesAndGenres'>
        <h4 >Select Genre and category </h4>

          <div className='category'>
            Categories
            <select value={selectedGenre} onChange={handleGenreChange}>
              <option value=''>Select Genre</option>
              {Object.keys(groupedSounds).map(genre => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
          {selectedGenre && (
            <div className='genre'>
              Genres
              <select value={selectedCategory} onChange={handleCategoryChange}>
                <option value=''>Select Category</option>
                {Object.keys(groupedSounds[selectedGenre]).map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className='availableSounds'>
          {selectedGenre && selectedCategory && (
            <>
              <h3>Select Sounds:</h3>
              <ul>
                {groupedSounds[selectedGenre][selectedCategory].map(sound => (
                  <li key={sound.soundUrl} className='selected-sound-item'>
                    <button
                      className='selected-sound-item'
                      type="button" 

                      onClick={() => handlePlayButtonClick(sound.soundUrl)}
                    >
                      <span>{sound.name}</span>
                      
                    </button>


                    
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        checked={selectedSounds.some(
                          selectedSound => selectedSound.soundUrl === sound.soundUrl
                        )}
                        onChange={event => handleCheckboxChange(event, sound)}
                        id={`switch-${sound.soundUrl}`}
                      />
                      <label
                        className='form-check-label'
                        htmlFor={`switch-${sound.soundUrl}`}
                      ></label>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        {maxSoundsReached && (
  <p style={{ color: 'red' }}>You can only select a maximum of 27 sounds.</p>
)}
        {selectedSounds.length > 0 && (
          <>
            
 <div className='selectedSounds'>
  <h3>Selected Sounds:</h3>
            <ul>
             
                {selectedSounds.map(sound => (
                  <li key={sound.soundUrl}>
                    <button
                      className='selected-sound-item'
                      type="button" 

                      onClick={() => handlePlayButtonClick(sound.soundUrl)}
                    >
                     <span> {sound.name}</span>
                    </button>
                  </li>
                ))}
              
            </ul></div>
          </>
        )}
      </div>
    </div>
  )
}
export default Sounds*/ 

import { useEffect, useState, useRef } from 'react';
import '../styles/create.css';

function Sounds({ sounds, handleSoundSelect, selectedSounds }) {
  const [selectedGenre, setSelectedGenre] = useState('Basico');
  const [selectedCategory, setSelectedCategory] = useState('Basic');
  const [maxSoundsReached, setMaxSoundsReached] = useState(false);
  const audioRefs = useRef({});

  useEffect(() => {
    const preloadSounds = async () => {
      const soundsToPreload = sounds
        .filter((sound) => sound.genre === selectedGenre && sound.category === selectedCategory)
        .map((sound) => sound.soundUrl);

      await Promise.all(
        soundsToPreload.map(async (soundUrl) => {
          if (!audioRefs.current[soundUrl]) {
            const audio = new Audio(soundUrl);
            await audio.load();
            audioRefs.current[soundUrl] = audio;
          }
        })
      );
    };

    preloadSounds();
  }, [sounds, selectedGenre, selectedCategory]);

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
    setSelectedCategory(''); // Reset selected category when genre changes
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };
  const handleTouchStart = (soundUrl) => {
    playSound(soundUrl);
};
  const handleCheckboxChange = (event, sound) => {
    event.stopPropagation(); // Prevent event bubbling to parent elements
    
    if (selectedSounds.length >= 27 && !selectedSounds.some(selectedSound => selectedSound.soundUrl === sound.soundUrl)) {
      setMaxSoundsReached(true);
      return;
    }
    
    setMaxSoundsReached(false); // Reset the state if the limit is not reached
    handleSoundSelect(sound);
  }

  const playSound = (soundUrl) => {
    const audio = new Audio(soundUrl);
    audio.currentTime = 0;
    audio.play().catch(error => console.error(`Failed to play sound: ${error}`));
  };

  const handlePlayButtonClick = (soundUrl) => {
    playSound(soundUrl);
  };

  const groupedSounds = {};
  sounds.forEach(sound => {
    if (!groupedSounds[sound.genre]) {
      groupedSounds[sound.genre] = {};
    }
    if (!groupedSounds[sound.genre][sound.category]) {
      groupedSounds[sound.genre][sound.category] = [];
    }
    groupedSounds[sound.genre][sound.category].push(sound);
  });

  return (
    <div>
      <div className='selectCards'>
        <div className='categoriesAndGenres'>
          <h4>Select Genre and category</h4>
          <div className='category'>
            Categories
            <select value={selectedGenre} onChange={handleGenreChange}>
              <option value=''>Select Genre</option>
              {Object.keys(groupedSounds).map(genre => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
          {selectedGenre && (
            <div className='genre'>
              Genres
              <select value={selectedCategory} onChange={handleCategoryChange}>
                <option value=''>Select Category</option>
                {Object.keys(groupedSounds[selectedGenre]).map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className='availableSounds'>
          {selectedGenre && selectedCategory && (
            <>
              <h3>Select Sounds:</h3>
              <ul>
                {groupedSounds[selectedGenre][selectedCategory].map(sound => (
                  <li key={sound.soundUrl} className='selected-sound-item'>
                    <button
                      className='selected-sound-item'
                      type="button" 
                      onTouchStart={() => handleTouchStart(sound.soundUrl)}

                    >
                      <span>{sound.name}</span>
                    </button>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        checked={selectedSounds.some(
                          selectedSound => selectedSound.soundUrl === sound.soundUrl
                        )}
                        onChange={event => handleCheckboxChange(event, sound)}
                        id={`switch-${sound.soundUrl}`}
                      />
                      <label
                        className='form-check-label'
                        htmlFor={`switch-${sound.soundUrl}`}
                      ></label>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        {maxSoundsReached && (
          <p style={{ color: 'red' }}>You can only select a maximum of 27 sounds.</p>
        )}
        {selectedSounds.length > 0 && (
          <div className='selectedSounds'>
            <h3>Selected Sounds:</h3>
            <ul>
              {selectedSounds.map(sound => (
                <li key={sound.soundUrl}>
                  <button
                    className='selected-sound-item'
                    type="button" 
                    onClick={() => handlePlayButtonClick(sound.soundUrl)}
                    onTouchStart={() => handleTouchStart(sound.soundUrl)}

                  >
                    <span>{sound.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sounds;

