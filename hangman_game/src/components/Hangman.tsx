import { useState } from "react";
import Reloj from './Reloj';

interface HangmanProps {
    words: string[];
    hint: string;
}

import img0 from '../img/Fase0.png'
import img1 from '../img/Fase1.png'
import img2 from '../img/Fase2.png'
import img3 from '../img/Fase3.png'
import img4 from '../img/Fase4.png'
import img5 from '../img/Fase5.png'
import img6 from '../img/ColgadoFinal.png'

const imagenFases = [img0,img1,img2,img3,img4,img5,img6]

const Hangman = ({ words, hint }: HangmanProps) => { //Esqueleto del componente

    const [selectedWords, setSelectedWord] = useState(words[0]);
    const [guessdLetters, setGuessedLetters] = useState<string[]>([]);
    const [errorCount, setErrorCount] = useState(0);

    const displayWord = selectedWords.split('').map((letter) => {
        <div></div>
        console.log("SelectWord: ", selectedWords)
        if (guessdLetters.includes(letter)) {
            console.log("guesedLetters: ", guessdLetters)
            return letter;
        } else {
            return '_';
        }
    });

    const handleGuess = (letter: string) => {
        if (!guessdLetters.includes(letter)) {

            setGuessedLetters([...guessdLetters, letter]);
            if (!selectedWords.includes(letter)) {
                setErrorCount((prev) => prev + 1);
                console.log("setErrorCount: ", setErrorCount)
            }
        }
    };

    const restartGame = () => {
        const newWordIndex = Math.floor(Math.random() * words.length);
        const newWord = words[newWordIndex];
        setSelectedWord(newWord); //Fijar la nueva palabra
        setGuessedLetters([]); //Reiniciar las teclas adivinadas
        setErrorCount(0); //Iniciar el conteo de errores en 0
    }

    return (
        <div className="container2">
            <Reloj interval={1000} /> {/* Usa el componente Reloj */}
            <p className="pista">Pista: {hint}</p>
            <img className="imagenFases" src={imagenFases[errorCount]} />
            <p>{displayWord.join(' ')}</p>

            <input maxLength={1} onChange={(e) => handleGuess(e.target.value)} />
            {
                (displayWord.join('') === selectedWords || errorCount > 5) && (
                    <button className="newWord" onClick={() => {
                        restartGame();
                        setSelectedWord(words[Math.floor(Math.random() * words.length)]);
                    }}>Select new WORD</button>
                )
            }
            <p>Cantidad de errors {errorCount}</p>
            {displayWord.join('') === selectedWords && (

                <p className="WIN">You win in this game</p>
            )}
        </div>
    )
};

export default Hangman;