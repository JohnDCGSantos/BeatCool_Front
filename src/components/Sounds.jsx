import { useEffect, useState } from 'react'
import '../styles/create.css'

function Sounds({ sounds,  handleSoundSelect, selectedSounds, playSound, preloadSounds, keyAssignments}) {
  const [selectedGenre, setSelectedGenre] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [maxSoundsReached, setMaxSoundsReached] = useState(false);


  
  const handleGenreChange = event => {
    setSelectedGenre(event.target.value)
    setSelectedCategory('') 
  }
  useEffect(() => {
    handleGenreChange
  }, [sounds])
  
  const handleCategoryChange = event => {
    setSelectedCategory(event.target.value)
  }

  
  useEffect(() => {
    if (selectedGenre && selectedCategory) {
      const filteredSounds = sounds.filter(
        sound => sound.genre === selectedGenre && sound.category === selectedCategory
      );
      preloadSounds(filteredSounds);
    }
  }, [selectedGenre, selectedCategory, sounds, preloadSounds]);

  const handleCheckboxChange = (event, sound) => {
    event.stopPropagation(); // Prevent event bubbling to parent elements
    
    if (selectedSounds.length >= 20 && !selectedSounds.some(selectedSound => selectedSound.soundUrl === sound.soundUrl)) {
      setMaxSoundsReached(true);
      return;
    }
    
    setMaxSoundsReached(false); // Reseting the state if the limit is not reached
    handleSoundSelect(sound);
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
        <h4>Select Genre and category</h4>

        <div className="dropdown">
          <button className="btn btn-secondary dropdown-toggle" type="button" id="genreDropdownButton" data-bs-toggle="dropdown" aria-expanded="false">
            {selectedGenre ? selectedGenre : 'Select Genre'}
          </button>
          <ul className="dropdown-menu" aria-labelledby="genreDropdownButton">
            {Object.keys(groupedSounds).map(genre => (
              <li key={genre}>
                <button className="dropdown-item" onClick={() => { handleGenreChange({ target: { value: genre } }); setSelectedGenre(genre); }}>
                  {genre}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {selectedGenre && (
         
            <div className="dropdown">
              <button className="btn btn-secondary dropdown-toggle" type="button" id="categoryDropdownButton" data-bs-toggle="dropdown" aria-expanded="false">
                {selectedCategory ? selectedCategory : 'Select Category'}
              </button>
              <ul className="dropdown-menu " aria-labelledby="categoryDropdownButton">
                {Object.keys(groupedSounds[selectedGenre]).map(category => (
                  <li key={category}>
                    <button className="dropdown-item" onClick={() => { handleCategoryChange({ target: { value: category } }); setSelectedCategory(category); }}>
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
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
  <p style={{ color: 'red' }}>You can only select a maximum of 20 sounds.</p>
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
                      <div className='selectedSoundsSpan'>
                     <span style={{fontSize:'12px'}}> {sound.name}</span>
                     <span style={{fontSize:'12px'}}className='span2'>  {keyAssignments[sound.soundUrl]}</span> {/* Display assigned key */}
</div>
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
              
            </ul></div>
          </>
        )}
      </div>
    </div>
  )
}
export default Sounds
