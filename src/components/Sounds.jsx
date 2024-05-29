import { useEffect, useState } from 'react'
import '../styles/create.css'

function Sounds({ sounds,  handleSoundSelect, selectedSounds, playSound }) {
  //const [selectedOption, setSelectedOption] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('Basico')
  const [selectedCategory, setSelectedCategory] = useState('Basic')
  const [maxSoundsReached, setMaxSoundsReached] = useState(false);

  /*const handleOptionChange = option => {
    setSelectedOption(option)
    setSelectedGenre('')
    setSelectedCategory('')
  }*/
  
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
 
  const handleCheckboxChange = (event, sound) => {
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


                    
                  {/*  <span onClick={event => handleSoundNameClick(event, sound.soundUrl)}></span>*/}
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
                     {/*<span onClick={event => handleSelectedSoundClick(event, sound.soundUrl)}></span>*/}
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
