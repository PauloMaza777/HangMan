import { useState, useEffect } from 'react'
import './App.css'

const useImageURL = () => {
  const [imageURL, setImageURL] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // Simulando una primera solicitud de imagen
    fetch("https://jsonplaceholder.typicode.com/photos/1", { mode: "cors" })
      .then((response)=>{
        if (response.status >= 400){
          throw new Error("Server error!!");
        }
        return response.json();
      })
      .then((response) => {
        console.log(response)
        setImageURL(response.url)
      })
      .catch((error) => setError(error))
      .finally(()=>setLoading(false));

    // Simulando una segunda solicitud de imagen después de un retraso
    setTimeout(() => {
      fetch("https://jsonplaceholder.typicode.com/photos/2", { mode: "cors" })
        .then((response)=>{
          if (response.status >= 400){
            throw new Error("Server error!!");
          }
          return response.json();
        })
        .then((response) => {
          console.log(response)
          // Aquí solo estamos actualizando la URL de la imagen sin cambiar el estado de carga
          setImageURL(response.url)
        })
        .catch((error) => setError(error));
    }, 2000);
  }, []);

  return { imageURL, error, loading };
};

function App() {
  const { imageURL, error, loading } = useImageURL();

  if (loading) return <p>Loading...</p>
  if (error) return <p> A network error was encountered ! </p>

  return (
    imageURL && (
      <>
        <h1>An image</h1>
        <img src={imageURL} alt={"placeholder text"} />
      </>
    )
  )
}

export default App