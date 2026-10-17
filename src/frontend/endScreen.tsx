import Stats from "../components/stats";
import type { GameState } from "../engine/types";

export default function EndScreen({game}:{game:GameState}) {
    return (
        <div>
            <h1>
                The game is over. Your final stats were:
            </h1>
            <Stats stats={game.stats}/>
        </div>
    )
}