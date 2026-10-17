import { newGame } from "../engine/engine";
export {rngFor} from "../engine/rng";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LifeTree } from "../components/lifeTree";
import "./welcome.css";

export default function WelcomePage(){
    const navigate = useNavigate();
    const [treeKey, setTreeKey] = useState(0);
    function startGame() {
        const game = newGame("42");
        navigate("/game", {
            state: { game }
        });
    }
    return(
        <div className="welcome">
            <div className="welcome-text">
                <h1 className="welcome-title">
                    GUT<span className="welcome-accent">(S)</span><br />Decisions
                </h1>
                <p className="welcome-tagline">
                    Do you have the <span className="welcome-highlight">GUTS</span> to make the decision?
                </p>
                <p className="welcome-rules">
                    Live a life from 0 to 60. At every stage you get two choices and have to make one 'GUT(S)' decision.
                </p>

                <div className="welcome-buttons">
                    <button type="button" className="welcome-button start" onClick={startGame}>
                        Start your life
                    </button>
                    <button type="button" className="welcome-button replay" onClick={() => setTreeKey(k => k + 1)}>
                        Replay
                    </button>
                </div>
            </div>

            {/* Changing the key remounts the tree, which restarts the animation with a new random path */}
            <LifeTree key={treeKey} />
        </div>
    )
}
