import { useState, useEffect } from 'react';
import { createStage } from '../gameHelpers';


export const useStage = (player, resetPlayer) => {
    const [stage, setStage] = useState(createStage()); // generates the initial stage for the game

    useEffect(() => {
        const updateStage = prevStage => {
            // First flush the stage
            const newStage = prevStage.map(row => 
                row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell)),
            );

            // Then draw the tetromino
            player.tetromino.forEach((row, y) => {
                row.forEach((value, x) => {  // checking to see which cells are occupied by the tetromino
                    if (value !== 0) { // gives us the coordinate on the stage
                        newStage[y + player.pos.y][x + player.pos.x] = [
                            value,
                            `${player.collided ? 'merged' : 'clear'}`,
                        ]; 
                    }
                });
            });

            return newStage;
        };

        setStage(prev => updateStage(prev));
    }, [player]); // have to specify them as dependencies because we are using them in the useEffect

    return [stage, setStage];
}