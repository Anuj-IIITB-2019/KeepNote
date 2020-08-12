import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";

function Note(note){
	
function handleDelete(){
	note.onDelete(note.id)
}


	return(
		<div className="note">
			<h1>{note.title}</h1>
			<p>{note.content}</p>
			<button onClick={handleDelete}><DeleteIcon /></button>
		</div>
		);
}
export default Note;
