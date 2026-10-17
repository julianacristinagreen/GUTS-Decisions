import { newGame } from "../engine/engine";
export {rngFor} from "../engine/rng";
import { useNavigate } from "react-router-dom";

export default function WelcomePage(){
    const navigate = useNavigate();
    function startGame() {
        const game = newGame("42");
        navigate("/game", {
            state: { game }
        });
    }
    return(
        <div>
            <h1>Welcome to Guts Decisions</h1>
            <p>A game where the outcome depends entirely on your choices</p>

            <button type="button" onClick={startGame}>Press here to start</button>
        </div>
    )
}