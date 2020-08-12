import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

// import notes from "../notes";

// function createNotes(noteItem){
// 	return
// 	<Note key={noteItem.key},
// 	 title={noteItem.title},
// 	content={noteItem.content} />
// }

function App(){


const [notes, setNotes] = React.useState([]);

function addNote(newNote){
	setNotes(prevNotes => {
      return [...prevNotes, newNote];
    });
}

function deleteNote(id)
{
console.log("Delete was pressed");

setNotes(prevNotes=>{
	return prevNotes.filter((noteItem,index)=>{
		return index!== id;
	});
});

}

	return (<div>
		<Header />
		<CreateArea onAdd={addNote}/>
		{notes.map((noteItem,index)=> 
				{return <Note key={index} id={index} title={noteItem.title} content={noteItem.content} onDelete={deleteNote}/>}	
				
				)
		}
		<Footer />
	</div>);
}

export default App;