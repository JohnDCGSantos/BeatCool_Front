
const UnmuteWarn= ({ onClose, }) => {
  const warn = 
    {
      title: "Unmute",
      description: "Make sure that SILENT MODE IS OFF, is the only way to ear your sounds!! If you have volume up and ear no sound, you must TURN OFF SILENT MODE of your device.",
    }
    
     
      
   
  

  
  const gotIt = () => {
   
      onClose(); // Close the tutorial when finished
   
  };

  

  
  
  
  
  return (
    <div className="tutorial-overlay">
      <div className="tutorial-content">
        <h2>{warn.title}</h2>
        <p>{warn.description}</p>
        <div className="tutorial-buttons">
          <button className='btnSkip' onClick={gotIt}>Got It!!</button>

        </div>
       
      </div>
    </div>
  );
};

export default UnmuteWarn;
