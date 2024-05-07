import Welcome from './components/Welcome';
import Hangman from './components/Hangman';
import { useState } from 'react';

const fruts = ['apple', 'banana', 'cherry', 'date', 'grape', 'fig', 'kiwi', 'watermelon',],
    countries = ['brasil', 'mexico', 'usa', 'canada', 'españa', 'china', 'francia', 'rusia',],
    figures = ['circle', 'square', 'trangle', 'rectangle', 'star', 'heart', 'pentagon', 'oval',],
    anatomy = ['head', 'face', 'neck', 'arm', 'shoulder', 'leg', 'foot', 'hand',],
    office = ['notepad', 'eraser', 'tape', 'scissors', 'folder', 'stapler', 'pencils', 'pens',]

const words = [fruts, countries, figures, anatomy, office];

const pistas = ["CATEGORIA DE FRUTAS", "CATEGORIA DE CIUDADES", "CATEGORIA DE FIGURAS",
                "CATEGORIA DE PARTES DEL CUERPO HUMANO", "CATEGORIA OBJETOS DE OFICINA"]

function App() {

    const [start, setStart] = useState(false);
    const random = Math.floor(Math.random() * words.length);
    return (
        <div className='App'>
            {start ? (

                <Hangman words={words[random]} hint={pistas[random]} />
            ) : (
                <Welcome onStart={() => setStart(true)} />
            )}
        </div>
    );
}

export default App;