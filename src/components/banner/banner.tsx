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
            <h1 className="banner-title">
                GUT<span className="banner-accent">(S)</span> Decisions
            </h1>
            <div className="banner-text">
                <p>You are <span className="banner-number">{age}</span> {age == 1 ? 'year' : 'years'} old</p>
                <p>You have made  <span className="banner-number">{currentDecisionsMade}</span> {currentDecisionsMade == 1 ? 'decision' : 'decisions'}</p>
            </div>
        </div>

    );
}