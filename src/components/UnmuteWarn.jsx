
const UnmuteWarn= ({ onClose, }) => {
  const warn = 
  {
    title: "Unmute",
    description: "Make sure that SILENT MODE IS OFF; it's the only way to hear your sounds! If you have the volume up and hear no sound, you must TURN OFF SILENT MODE on your device.",
  }
     
      
   
  

  
  const gotIt = () => {
   
      onClose(); 
   
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
