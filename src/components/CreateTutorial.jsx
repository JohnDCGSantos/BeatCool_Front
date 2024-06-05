import  { useState } from 'react';

const CreateTutorial = ({ onClose, }) => {
  const [step, setStep] = useState(0);

  const steps = [
   
    
      {
      title: "Create",
      description: "You can create a drum kit or beat maker by choosing sounds from various categories and genres. Choose your category and genre and sounds will be there for you ;) ",
    },
    {
        title: "Create - play",
        description: " If you want you can click on a sound to hear it ;).",
      },
    {
        title: "Create -  Saving",
        description: " Don't forget no give a name to your creation ;) Your creations will be stored in their respective lists for easy access.",
      },
      {
        title: "Create - combined",
        description: "You can create a combined, by choosing one drumkit and one beatmaker from your lists.",
      },
      {
        title: " Accessing and Managing Creations",
        description: "Go to the list of saved drum kits, beat makers or combined to search, play, update, or delete your creations.",
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
        <div className='skip'>           <button className='btnSkip' onClick={skipAll}>SKIP</button>
</div>
      </div>
    </div>
  );
};

export default CreateTutorial;
