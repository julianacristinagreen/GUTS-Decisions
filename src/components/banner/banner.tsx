import "./banner.css";
import type { GameState } from "../../engine/types";

type BannerProps = {
    game: GameState;
};

export function Banner({game}: BannerProps) {
    const age = game.age;
    const currentDecisionsMade = game.history.length;
    return (
        <div className="banner">
            <h1 className="welcome-title">
                GUT<span className="welcome-accent">(S)</span> Decisions
            </h1>
            <div className="info">
                <p>You are <span style={{ color: "#DAB1DA" }}>{age}</span> {age == 1 ? 'year' : 'years'} old</p>
                <p>You have made  <span style={{ color: "#DAB1DA" }}>{currentDecisionsMade}</span> {currentDecisionsMade == 1 ? 'decision' : 'decisions'}</p>
            </div>
        </div>

    );
}