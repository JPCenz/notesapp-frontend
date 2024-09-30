import { useEffect, useState } from "react";
import AddNote from "./components/CreateNote";
import axiosInstance from "../../axios.config";
export default function Home() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editNoteId, setEditNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [showArchived, setShowArchived] = useState(false);


  const urlSaveNotes = '/api/notes/';
  const urlGetNotes = '/api/notes/?archived=';

  const fetchNotes = async () => {

    try {

      const response = await axiosInstance.get(urlGetNotes+showArchived);
      const data = setNotes(response.data.notes);
      console.log(data);
    } catch (error) {
      console.log(error)
    }
  };
  const onAddNoteClick = ()=>{
      console.log("onAddNoteClick: "+title+","+content)
      axiosInstance.post(urlSaveNotes, { title, content })
        .then((response) => {
          setNotes([...notes, response.data]);
          setTitle("");
          setContent("");
          fetchNotes();
        })
        .catch((error) => console.error("Error adding note:", error));

  }

  const onEditNoteClick = (note) => {
    setEditNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const onSaveEditClick = () => {
      axiosInstance.put(`${urlSaveNotes}+${editNoteId}`, { title: editTitle, content: editContent })
        .then((response) => {
          const nuevo =  { id:editNoteId,title: editTitle, content: editContent }
          setNotes(notes.map(note => note.id === editNoteId ?  nuevo: note));
          setEditNoteId(null);
          setEditTitle("");
          setEditContent("");
        })
        .catch((error) => console.error("Error updating note:", error));
    fetchNotes().then();
  };

  const oNDeleteNoteClick = (note) => {
      axiosInstance.delete(`${urlSaveNotes}+${note.id}`)
        .then(() => {
          setNotes(notes.filter((n) => n.id !== note.id));
        })
        .catch((error) => console.error("Error deleting note:", error));
  };

  const onArchivedNote = (note) => {
      axiosInstance.put(`${urlSaveNotes}+${note.id}`, { archived: true })
        .then((response) => {
          const nuevo =  { id:note.id,title: note.title, content: note.content, archived: true }
          setNotes(notes.filter((n) => n.id !== note.id));
        })
        .catch((error) => console.error("Error updating note:", error));

  }
  const toggleShowArchived = () => {
    setShowArchived(!showArchived);
  };

  useEffect(() => {


    fetchNotes();


  },[showArchived]);


  return (
      <>
        <div className="container mx-auto  px-32" >
          <div className="grid grid-cols-2 gap-4 m-4">


          </div>

        </div>
        <div className="container mx-12 px-8 mt-4">

          <h1 className=" text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center mx-8 px-3">Lista de Notas</h1>

          <form class="flex items-center mx-32 my-4" onSubmit={null} >
            <label for="simple-search" class="sr-only">Buscar Notas</label>
            <div class="relative w-full">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2" />
                </svg>
              </div>
              <input

                  title="."
                  name="account"
                  type="text" id="account" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Categoria" required />
            </div>
            <button ref={null} type="submit" class="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
              <span class="sr-only">Search</span>
            </button>
            <button
                type="button"
                className="m-1 text-white bg-gradient-to-br from-green-600 to-teal-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                onClick={toggleShowArchived}
            >
              {showArchived ? "Mostrar Activas" : "Mostrar Archivadas"}
            </button>

          </form>

          <div className=" mx-12 px-8 mt-7grid grid-cols-1 gap-2">
            <AddNote
                title={title}
                setTitle={setTitle}
                content={content}
                setContent={setContent}
                onAddNote={onAddNoteClick}
            />

          </div>

          <div class=" mx-12 px-8 mt-7 grid grid-cols-3 gap-2">

            {notes.length > 0 && notes.map(i => (

                <div key={i.id} className="">
                  <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ">
                    <a href="#" className="flex justify-center items-center">
                    </a>
                    <div class="p-3">
                      {editNoteId === i.id ? (
                          <>
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="break-words mb-2 p-2 border rounded text-gray-700 dark:text-gray-400  dark:bg-gray-800"
                            />
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="break-words mb-2 p-2 border rounded  text-gray-700 dark:text-gray-400  dark:bg-gray-800"
                            />
                            <b/>
                            <button
                                onClick={onSaveEditClick}
                                className="text-white bg-blue-700 rounded-lg px-3 py-2"
                            >
                              Guardar
                            </button>
                          </>
                      ) : (
                          <>
                            <h5 className="break-words mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{i.title}</h5>
                            <p className=" break-words mb-3 font-normal text-gray-700 dark:text-gray-400">{i.content}</p>
                            <b/>
                            <button
                                onClick={() => onEditNoteClick(i)}
                                className="m-1 text-white bg-blue-700 rounded-lg px-3 py-2"
                            >
                              Editar
                            </button>
                            <button
                                onClick={() => oNDeleteNoteClick(i)}
                                className=" m-1 text-white bg-orange-600 rounded-lg px-3 py-2"
                            >
                              Eliminar
                            </button>
                            {i.archived? null :
                                <button
                                    onClick={() => onArchivedNote(i)}
                                    className=" m-1 text-white bg-orange-600 rounded-lg px-3 py-2"
                                >
                                  Archivar
                                </button>

                            }

                          </>
                      )}

                    </div>
                  </div>
                </div>

            ))}

          </div>

        </div>
      </>
  )


}