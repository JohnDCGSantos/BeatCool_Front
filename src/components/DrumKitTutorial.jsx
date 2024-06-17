import  { useState } from 'react';

const DrumKitTutorial = ({ onClose, }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Unmute",
      description: "Make sure that SILENT MODE IS OFF. It is the only way to hear your sounds! If you have the volume up and hear no sound, you must TURN OFF SILENT MODE on your device.",
    },
    
    {
      title: "DrumKit",
      description: "The drum kit consists of various pads, each representing a different sound (e.g., snare, kick, hi-hat). Pack your sounds and play with no limits!!!",
    },
    
    {
      title: "DrumKit - Playing Pads",
      description: "Click on the pads to play the corresponding sounds. Experiment with different pads to create unique rhythms.",
    },
    
    {
      title: "DrumKit - Record and Export",
      description: "You can record your session and export it ;)",
    },
    

    
      
   
  ];

  
  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose(); 
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

export default DrumKitTutorial;
