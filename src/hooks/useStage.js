import { useState, useEffect } from 'react';
import { createStage } from '../gameHelpers';



export const useStage = (player, resetPlayer) => {
    const [stage, setStage] = useState(createStage()); // generates the initial stage for the game
    const [rowsCleared, setRowsCleared] = useState(0); 

    useEffect(() => {
        setRowsCleared(0);

        const sweepRows = newStage => 
            newStage.reduce((ack, row) => {
                if (row.findIndex(cell => cell[0] === 0) === -1) {
                    setRowsCleared(prev => prev + 1);
                    ack.unshift(new Array(newStage[0].length).fill([0, 'clear']));
                    return ack;
                }
                ack.push(row);
                return ack;
            }, []);
        
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
            // Then check if we collided 
            if (player.collided) {
                resetPlayer();
                return sweepRows(newStage);
            }
            return newStage;
        };

        setStage(prev => updateStage(prev));
    }, [player, resetPlayer]); // have to specify them as dependencies because we are using them in the useEffect

    return [stage, setStage, rowsCleared];
}