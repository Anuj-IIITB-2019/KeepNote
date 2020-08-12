import React from "react";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";




function CreateArea(props) {


const [isExpanded,setExpanded] = React.useState(false,);
const[note,setNote] =React.useState({title:"",content:""})

function handleChange(event){
	const {name,value} = event.target;

	setNote(prevNote=>{
		return{
			...prevNote,
			[name]:value,

		};
	}); 
}

function expand(){
	setExpanded(true);
}


function submitNote(event){

	props.onAdd(note);
	setNote({
		title:"",content:""
	})
	event.preventDefault();
}



  return (
    <div>
      <form className="create-note">
       {isExpanded &&  <input name="title" placeholder="Title" 
        onChange={handleChange} value={note.title}/>}
        <textarea name="content" placeholder="Take a note..." 
        onChange={handleChange} onClick={expand} value={note.content} rows={isExpanded?3 : 1} />
        
        <Zoom in ={isExpanded}>
        <Fab onClick={submitNote}><AddIcon /></Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
