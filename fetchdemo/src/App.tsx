import { useState, useEffect } from 'react';

function useFetch(url: string) {
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, { mode: "cors" });
        if (!response.ok) {
          throw new Error('No se pudieron cargar los datos');
        }
        const result = await response.json();
        setData(result[0].url);
      } catch (error) {
      }
    };

    fetchData();

  }, [url]);

  return { data, error };
}

function EstadoConFetch() {
  const { data: imageURL, error } = useFetch("https://jsonplaceholder.typicode.com/photos");

  if (error) return <div>Error al cargar los datos</div>;
  if (!imageURL) return <div>Cargando...</div>;

  return (
    <>
      <h1>An image using useFetch</h1>
      <img src={imageURL} alt={"placeholder text"} />
    </>
  );
}

export default EstadoConFetch;