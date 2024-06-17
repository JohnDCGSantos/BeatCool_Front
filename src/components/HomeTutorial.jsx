import  { useState } from 'react';

const Tutorial = ({ onClose, }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
        title: "Welcome to Beat It Up.",
        description: "Beat it Up, is an app where you can create and play with Drumkits, BeatMakers and even combine them if you want! ",
      },
      {
        title: "Record and export",
        description: "Record whyle you are playing, save your record and export it!! ",
      },
      
      {
        title: "BeatMaker",
        description: "With a BeatMaker, you can compose a sound melody in 32 steps. Each step represents an specific moment in beat time. Combine the sounds you want and explore the magic they can do in 32 steps ;) ",
      },
      {
        title: "DrumKit",
        description: "The drum kit consists of various pads, each representing a different  sound (e.g., snare, kick, hi-hat). Pack your sounds and play with no limits!!!",
      },

      {
        title: "Combining Drum Kit and Beat Maker",
        description: "Enjoy the mix of both drum kit and beat maker. Ensure you have created at least one drum kit and one beat maker.",
      },
      {
        title: "SignUp/Login to have full access",
        description: "Make sure you are logged in to save your creations and access your lists ;) ",
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

export default Tutorial;
