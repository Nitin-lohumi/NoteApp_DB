import { useEffect, useState } from 'react'
import './App.css'

function App() {
   const [storeData,setStoreData] = useState([]);
   const [editText,setEditText] = useState('');
   const [noteNumber,setNoteNumber] = useState(0);
   const [Text,SetText] = useState('');
   const [Title,SetTitle] = useState('');
   const [change,setChange]= useState(true);
   const [currentName,setCurrentName] = useState('');
   const [changeButtons,setChangeButtons] = useState('');

   useEffect(()=>{
    NoteTextInfo();
   },[]);
    
   async function NoteTextInfo(){
    try {
      const res = await fetch('http://localhost:3000/');
      const data = await res.json();
      setStoreData(data);
    } catch (error) {
      throw error;
      // alert("Failed to connect!! :: try to check internet connection or DB connnection");
    }
   }

   async function handleSubmit(e){
    e.preventDefault();
    const note ={Title:Title,Text:Text};
    try {
        let res = await fetch('http://localhost:3000/NoteApp',{
          method:'POST',
          headers:{
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(note)
        })
        setNoteNumber(e=>e+1);
    } catch (error) {
      // alert(error);
      throw error;
    }
    SetText(' ');
    NoteTextInfo(); 
    clearForm();
   }
  async function EditSubmit(e){
    alert('Changes Saved')
    e.preventDefault();
    setChange(true);
    setChangeButtons('');
    const note ={Text:editText};
    try {
        let res = await fetch(`http://localhost:3000/NoteApp/update/${currentName}`,{
          method:'POST',
          headers:{
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(note)
        })
    } catch (error) {
      throw error;
    }
    NoteTextInfo(); 
   }
   const clearForm = () => {
    SetText('');
    SetTitle('');
    setEditText(" ")
  };
   function EditButton(title){
    setChangeButtons(title);
    setCurrentName(title);
    setChange(false);
   }
   function CancelClick(title){
    NoteTextInfo();
    setChangeButtons('');
    setChange(true);
    window.location.reload(true);
   }
   async function DeleteNote(name){
    try {
      await fetch(`http://localhost:3000/NoteApp/delete/${name}`, {
        method: 'Post'
      });
    } catch (error) {
      alert(error);
    }
    NoteTextInfo();
  }
  return (
    <>
     <div className="Flex">
     <div className='TextField bg'>
        <form action="" onSubmit={handleSubmit} className='Form'>
          <h1>Let's start Making notes</h1>
          <input type="text" name="title" value={Title} placeholder='Enter your Title' onChange={e=>SetTitle(e.target.value)}  className='title'/>  
        <textarea name="text" value={Text} className='textArea' onChange={e=>SetText(e.target.value)} placeholder="Writes Somes Text...." required/>
        <input type="submit" value={"Create New Note"} className='ButtonCreate'/>
        </form>
     </div>

     {storeData.length!=0?storeData.map((val)=>{
     return ( <>
      <div className='TextField Grid' key={val.Title}>
      <form onSubmit={EditSubmit} className='DataOutput'>
        <p><strong style={{color:"blue"}}>Title</strong> {val.Title}</p>
      <textarea name="text" className='notEditable' onChange={e=>setEditText(e.target.value)} readOnly={changeButtons!=val.Title}>{val.Text}</textarea>
      <div className='button_class_btn'>
        {changeButtons==val.Title?<div className='buttton_class'>
          <input type='button' onClick={()=>CancelClick(val.Title)} className='Buttons' value={'cancel'}/>
          <input type="submit" value={"Save"} className='Buttons'/>
          </div>:<div  className='buttton_class'>
          <input type='button' className='Buttons' onClick={()=>EditButton(val.Title)} value={'Edit'}/>
          <input type='button' className='Buttons' onClick={()=>DeleteNote(val.Title)} value={'Delete'}/>
          </div>
          }
      </div>
      </form>
      </div>
      </>)
     }):<div className='empty'><p>Currently notes are Empty</p></div>}
     </div>
    </>
  )
}

export default App
