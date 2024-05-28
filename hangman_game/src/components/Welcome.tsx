import hangman from '../img/hangman2.png';
import '../css/Welcome.css'

interface welcomeProps {
    onStart: () => void; // Definimos la interfaz para onStart
}

function Welcome({ onStart }: welcomeProps) {

    return (
        <>
            <div className="Wrapper">
                <h1>Welcome TO HANGMAN GAME!!</h1>
                <h2>The Classic Game</h2>
                <img src={hangman} alt="hangman image..." width={200} height={200}></img>
                <div>
                    <button className='Boton' onClick={onStart}>INICIAR JUEGO</button>
                </div>
                <h2>by Paulo Esteban Maza Rivera - 20460351</h2>
            </div>
        </>
    )
}
export default Welcome; 