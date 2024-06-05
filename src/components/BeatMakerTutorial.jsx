import  { useState } from 'react';

const BeatMakerTutorial = ({ onClose, }) => {
  const [step, setStep] = useState(0);
  const steps = [
    
      {
        title: "BeatMaker",
        description: "With a BeatMaker, you can compose a sound melody in 32 steps. Each step represents an specific moment in beat time. Combine the sounds you want and explore the magic they can do in 32 steps ;) ",
      },
      
      {
        title: "How to use BeatMaker - Navigation slides",
        description: "Use the navigation buttons to switch between the 4 slides. Each slide have 8 squares and represents a different part of the sequence. Use all slides to achieve 32 steps, adding complexity and variety to your beat.",
      },
      {
        title: "How to use BeatMaker - Activate steps",
        description: "Click on the squares to activate or deactivate them. Activated squares will play a sound when the sequence runs. Use all slides to create a richer composition.",
      },
      {
        title: "How to use BeatMaker - BPM",
        description: "BPM (Beats Per Minute) controls the tempo of your beat. Adjusting the BPM changes the speed and feel of your music. Higher BPM means a faster tempo, while lower BPM means a slower tempo.",
      },
      {
        title: "How to use BeatMaker - Playing the sequence",
        description: "Press the play button to hear your composed beat. The sequence will loop through all 32 steps, and using all slides ensures a fuller, more dynamic sound.",
      },

      
   
  ];

  
  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose(); // Close the tutorial when finished
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const skipAll =()=>{
    onClose()
  }
  
  
  
  return (
    <div className="tutorial-overlay">
      <div className="tutorial-content">
        <h2>{steps[step].title}</h2>
        <p>{steps[step].description}</p>
        <div className="tutorial-buttons">
          {step > 0 && <button className='btnSkip' onClick={prevStep}>Previous</button>}
          <button className='btnSkip' onClick={nextStep}>{step < steps.length - 1 ? 'Next' : 'Finish'}</button>

        </div>
        <div className='skip'>          <button className='btnSkip' onClick={skipAll}>SKIP</button>

</div>
      </div>
    </div>
  );
};

export default BeatMakerTutorial;
