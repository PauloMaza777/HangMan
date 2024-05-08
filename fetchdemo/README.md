# RECUPERACIÓN DE DATOS EN REACT

INSTITUTO TECNOLÓGICO DE MÉXICO CAMPUS COLIMA
Departamento de Sistemas y Computación
INGENIERÍA EN SISTEMAS COMPUTACIONALES

`Semestre 8`

`Nombre y No. de control`: Paulo Esteban Maza Rivera - 20460351

`Maestra`: PATRICIA ELIZABETH FIGUEROA MILLAN

`Materia`: APLICACIONES WEB MODERNAS

`Actividad`: Solución a Waterfall of Request in React.js

`Fecha de entrega`: Martes 7 de Mayo del 2024 

`Periodo`: (ENE-JUN 2024).

## INDICE

- [Tipos de obtención de datos](#tipos-de-obtención-de-datos)
- [¿Es necesario usar una biblioteca externa?](#es-necesario-usar-una-biblioteca-externa)
- [¿Qué es `performant` en una aplicación de React?](#qué-es-performant-en-una-aplicación-de-react)
- [Ciclo de vida de React y obtención de datos](#ciclo-de-vida-de-react-y-obtención-de-datos)
- [Limitaciones del navegador y obtención de datos](#limitaciones-del-navegador-y-obtención-de-datos)
- [Solicitudes cascadas, ¿Cómo aparecen?](#solicitudes-cascadas-cómo-aparecen)
- [Cómo resolver solicitudes en cascada](#cómo-resolver-solicitudes-en-cascada)
- [¿Qué pasa con el suspenso?](#qué-pasa-con-el-suspenso)

## Tipos de obtención de datos

- `Recuperación de datos bajo demanda`: se trata de datos obtenidos después de que el usuario interactúa con una página. Ejemplos de esto incluyen autocompletados, formularios dinámicos y búsquedas. En React, generalmente se activan mediante devoluciones de llamada.

- `Recuperación de datos inicial`: son los datos que se muestran inmediatamente cuando se abre una página, necesarios para que el componente pueda ofrecer una experiencia significativa desde el inicio. En React, suele ocurrir en useEffect (en componentes funcionales) o componentDidMount (en componentes de clase).

Aunque ambos conceptos parecen diferentes, los principios y patrones para obtener datos son similares. Sin embargo, la recuperación de datos inicial es más crucial porque determina la primera impresión del usuario sobre el rendimiento de la aplicación. 

## Es necesario usar una biblioteca externa

Si queremos recuperar datos pero nuestra primer opcion es mediante una biblioteca externa, cabe rrecalcar que no es necesario implementarlo asi. con un simple hook se resuelve nuestros problemas, por ejemplo:

```ts
const Component = () => {
  const [data, setData] = useState();

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const data = await (
        await fetch(
          'https://run.mocky.io/v3/d6155d63-938f-484c-8d87-6f918f126cd4',
        )
      ).json();

      // set state when the data received
      setData(data);
    };

    dataFetch();
  }, []);

  return <>...</>;
};
```

Este ejemplo demuestra cómo realizar una solicitud HTTP para obtener datos de un endpoint y luego actualizar el estado del componente para reflejar esos datos, todo usando hooks de React sin necesidad de bibliotecas externas.

## Qué es `performant` en una aplicación de React

Se presentan tres ejemplos para ilustrar diferentes enfoques de carga de datos y cómo afectan la experiencia del usuario:

- Primera aplicación: Carga todo antes de mostrar algo, en 3 segundos. Es rápida en tiempo total, pero el usuario ve una pantalla vacía hasta que se carga todo.
- Segunda aplicación: Muestra algo (como una barra lateral) rápidamente, pero el resto tarda un poco más, con un tiempo total de 4 segundos. Ofrece retroalimentación visual temprana, pero toma más tiempo para completar.
- Tercera aplicación: Muestra la parte principal primero, pero tarda más en cargar otras partes, con un tiempo total de 5 segundos. Esto puede parecer más lógico, pero sigue un orden diferente al típico y es el más lento en general.

No hay una solución única para lograr buen rendimiento.

El enfoque óptimo depende de qué parte de la aplicación es más importante y cómo se quiere contar la "historia" a los usuarios. Algunos puntos clave para mejorar el rendimiento incluyen entender cuándo iniciar la carga de datos, qué hacer mientras se carga y cómo gestionar el flujo de información para ofrecer la mejor experiencia posible.

## Ciclo de vida de React y obtención de datos

Lo más importante que debe saber y recordar al planificar su estrategia de recuperación de solicitudes es cuándo se activa el ciclo de vida del componente React.

```ts
const Child = () => {
  useEffect(() => {
    // do something here, like fetching data for the Child
  }, []);

  return <div>Some child</div>;
};

const Parent = () => {
  // set loading to true initially
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) return 'loading';

  return <Child />;
};
```

- Se define un estado "isLoading" que inicialmente es true.
- Se muestra un mensaje de "loading" si "isLoading" es true. Si es false, se renderiza un componente `Child`.
- En el componente `Child`, se utiliza useEffect para realizar una acción (como recuperar datos) cuando el componente se renderiza.
- Como `Child` solo se renderiza cuando "isLoading" es false, el efecto en `Child` solo se activará entonces.

```ts
const Parent = () => {
  // set loading to true initially
  const [isLoading, setIsLoading] = useState(true);

  // child is now here! before return
  const child = <Child />;

  if (isLoading) return 'loading';

  return child;
};
```

- Se crea un elemento child con `Child`  antes del bloque condicional if (isLoading).
- A pesar de que el elemento child se crea antes del bloque condicional, el efecto en `Child` no se activa hasta que el elemento se incluye en el árbol de renderizado visible.
- Así, el resultado es el mismo que en la primera versión: el efecto en `Child` solo se activa cuando "isLoading" se establece en false.

La clave está en entender que el uso de `Child` es solo un "azúcar sintáctico" para describir un futuro componente, pero no implica que se renderice o active su useEffect hasta que realmente se incluye en el árbol de renderizado.

## Limitaciones del navegador y obtención de datos

Las limitaciones de los navegadores al manejar muchas solicitudes de datos simultáneamente y cómo eso puede afectar el rendimiento de una aplicación.

### Límite de solicitudes simultáneas:

- Los navegadores tienen un límite para las solicitudes paralelas al mismo host. En Chrome, el límite es 6 para servidores HTTP1. Si se supera, las solicitudes adicionales se ponen en cola.

### Problema con solicitudes múltiples:

- En una aplicación grande, es fácil alcanzar el límite de 6 solicitudes. Si tienes muchas solicitudes en cola, esto puede ralentizar la carga de toda la aplicación.

### Ejemplo para demostrar el problema:

- Se muestra un componente React que usa un hook para obtener datos. Aquí está el código:

```ts
const App = () => {
  // Extraje la obtención de datos y useEffect en un hook
  const { data } = useData('/fetch-some-data');

  if (!data) return 'loading...';

  return <div>I'm an app</div>;
};

// Llamadas de datos que se realizan antes de cargar App
fetch('https://some-url.com/url1');
fetch('https://some-url.com/url2');
fetch('https://some-url.com/url3');
fetch('https://some-url.com/url4');
fetch('https://some-url.com/url5');
fetch('https://some-url.com/url6');
```

Si cada una de estas 6 solicitudes tarda 10 segundos, incluso una solicitud rápida (~50 ms) que está dentro del componente App se verá afectada y la aplicación tomará esos 10 segundos para cargar por completo. Esto muestra cómo el rendimiento se degrada si se exceden los límites del navegador.

## Solicitudes cascadas, Cómo aparecen

Un problema común en aplicaciones React, conocido como "cascadas de solicitudes" (request waterfalls), y cómo puede afectar el rendimiento al intentar mostrar contenido lo más rápido posible.

Explicación del problema:

- Una cascada de solicitudes ocurre cuando el proceso de renderizado desencadena una serie de operaciones asíncronas de recuperación de datos, y cada paso depende del anterior para avanzar. Esto puede causar demoras significativas porque cada componente espera a que el anterior termine de cargar sus datos antes de iniciar su propia solicitud.

Ejemplo de cascada de solicitudes:

- Se muestra un ejemplo de una aplicación React simple con tres componentes principales: App, Issue, y Comments. El componente App renderiza Sidebar y Issue, mientras que Issue a su vez renderiza Comments.

Para obtener datos, se utiliza un hook llamado useData, que realiza una solicitud de datos en useEffect y devuelve el resultado a través del estado.

El componente App comienza cargando datos para la barra lateral. Mientras espera, muestra un mensaje de "loading".

Una vez que App termina de cargar, se renderiza Issue, que también realiza una solicitud para obtener datos relacionados con el problema. Mientras tanto, muestra "loading".

Luego, Issue renderiza Comments, que hace su propia solicitud para cargar datos. Al esperar cada paso, el proceso se ralentiza, creando un efecto de cascada.
Cómo afectan las cascadas al rendimiento:

En este ejemplo, cada componente solo inicia su solicitud después de que el anterior haya terminado de cargar y renderizarse. Esto lleva a tiempos de espera más largos y a una experiencia de usuario lenta, ya que se crean dependencias entre las solicitudes de datos.

```ts
// Componente principal que renderiza la barra lateral y la sección de problemas
const App = () => {
  return (
    <>
      <Sidebar />
      <Issue />
    </>
  );
};

// Barra lateral (sin datos dinámicos en este caso)
const Sidebar = () => {
  return <div>Algunos enlaces en la barra lateral</div>;
};

// Componente que muestra detalles del problema y renderiza comentarios
const Issue = () => {
  return (
    <>
      <div>Detalles del problema</div>
      <Comments />
    </>
  );
};

// Componente para mostrar comentarios
const Comments = () => {
  return <div>Algunos comentarios</div>;
};
```

Hook para recuperar datos:

```ts
// Hook que recupera datos y gestiona el estado
export const useData = (url) => {
  const [state, setState] = useState();

  useEffect(() => {
    const dataFetch = async () => {
      const data = await (await fetch(url)).json();

      setState(data);
    };

    dataFetch();
  }, [url]);

  return { data: state };
};
```
Ahora vamos a utilizar el hook useData para agregar recuperación de datos a cada componente. Este es el código que causa el problema de cascada:

```ts
// Componente de comentarios que muestra "loading" mientras espera datos
const Comments = () => {
  const { data } = useData('/get-comments');

  if (!data) return 'loading';

  return data.map((comment) => <div>{comment.title}</div>);
};

// Componente de problema que muestra "loading" mientras espera datos
const Issue = () => {
  const { data } = useData('/get-issue');

  if (!data) return 'loading';

  return (
    <div>
      <h3>{data.title}</h3>
      <p>{data.description}</p>
      <Comments />
    </div>
  );
};

// Componente principal que muestra "loading" mientras espera datos
const App = () => {
  const { data } = useData('/get-sidebar');

  if (!data) return 'loading';

  return (
    <>
      <Sidebar data={data} />
      <Issue />
    </>
  );
};
```

## Cómo resolver solicitudes en cascada

Se proporciona dos soluciones para resolver el problema de las cascadas de solicitudes en aplicaciones React, permitiendo mejorar el rendimiento al cargar datos.

### Solución 1: Usar Promise.all para solicitudes paralelas

La idea es lanzar múltiples solicitudes al mismo tiempo y esperar a que todas se completen, evitando el efecto de cascada. Con Promise.all, todas las solicitudes se envían en paralelo, y solo se espera el tiempo de la solicitud más lenta, no la suma de todas.

### Código para usar Promise.all:

```ts
import { useEffect, useState } from 'react';

// Hook para obtener todos los datos en paralelo
const useAllData = () => {
  const [sidebar, setSidebar] = useState(null);
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Iniciar todas las solicitudes en paralelo
      const results = await Promise.all([
        fetch('/get-sidebar'),
        fetch('/get-issue'),
        fetch('/get-comments'),
      ]);

      // Convertir las respuestas a JSON
      const [sidebarData, issueData, commentsData] = await Promise.all(
        results.map((res) => res.json())
      );

      // Guardar en el estado
      setSidebar(sidebarData);
      setIssue(issueData);
      setComments(commentsData);
    };

    fetchData();
  }, []); // El array vacío garantiza que esto solo se ejecute una vez

  return { sidebar, issue, comments };
};

// Componente principal que renderiza según los datos disponibles
const App = () => {
  const { sidebar, issue, comments } = useAllData();

  if (!sidebar || !issue || !comments) {
    return 'loading...';
  }

  return (
    <>
      <Sidebar data={sidebar} />
      <Issue issue={issue} comments={comments} />
    </>
  );
};
```

En esta solución, el componente App espera hasta que todas las solicitudes se completen antes de renderizar sus hijos. El tiempo de espera total es el de la solicitud más larga, evitando las cascadas tradicionales.

### Solución 2: Manejo de Promesas Independientes

En esta solución, las solicitudes aún se inician en paralelo, pero cada una se resuelve de manera independiente, permitiendo mostrar partes de la aplicación tan pronto como estén listas. Con esta aproximación, el renderizado puede ocurrir en partes, evitando esperar hasta que todas las solicitudes se completen.

### Código para Promesas Independientes:

```ts
import { useEffect, useState } from 'react';

// Hook que lanza todas las solicitudes en paralelo, pero resuelve independientemente
const useAllData = () => {
  const [sidebar, setSidebar] = useState(null);
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState(null);

  useEffect(() => {
    // Solicitudes en paralelo pero cada una resuelve independientemente
    fetch('/get-sidebar')
      .then((res) => res.json())
      .then((data) => setSidebar(data));

    fetch('/get-issue')
      .then((res) => res.json())
      .then((data) => setIssue(data));

    fetch('/get-comments')
      .then((res) => res.json())
      .then((data) => setComments(data));
  }, []);

  return { sidebar, issue, comments };
};

// Componente principal que renderiza partes de la aplicación a medida que los datos están disponibles
const App = () => {
  const { sidebar, issue, comments } = useAllData();

  if (!sidebar) {
    return 'loading...';
  }

  return (
    <>
      <Sidebar data={sidebar} />
      {issue ? <Issue issue={issue} comments={comments} /> : 'loading...'}
    </>
  );
};
```

En esta solución, las partes de la aplicación se muestran a medida que sus datos están listos. Aunque se logran mejoras significativas en el rendimiento, el estado se actualiza varias veces, lo que puede provocar re-renderizaciones adicionales. Se sugiere tener cuidado con esto para evitar re-renderizaciones innecesarias que puedan afectar el rendimiento.

Ambas soluciones tienen sus ventajas y desventajas, pero permiten evitar las cascadas de solicitudes que ralentizan la carga de la aplicación y mejoran la experiencia del usuario.

## Qué pasa con el suspense

Suspense es una característica experimental de React para manejar estados de carga de manera más elegante. Sin embargo, su uso en producción no es recomendable porque sigue siendo experimental. Además, Suspense no resuelve problemas fundamentales como las limitaciones de los recursos del navegador, el ciclo de vida de React y las cascadas de solicitudes (request waterfalls).

Con Suspense, puedes mostrar un contenido alternativo mientras se cargan datos. Aquí hay un ejemplo básico:

```ts
import React, { Suspense } from 'react';

const Comments = ({ comments }) => {
  if (!comments) return 'loading';
  return comments.map((comment) => <div>{comment.title}</div>);
};

const Issue = () => {
  return (
    <Suspense fallback="loading">
      <Comments />
    </Suspense>
  );
};
```

En este ejemplo, el componente Issue usa Suspense para mostrar un estado de carga mientras se obtienen los datos de Comments. Esto simplifica el manejo del estado de carga, pero no resuelve completamente otros problemas asociados con el rendimiento y las limitaciones del navegador.