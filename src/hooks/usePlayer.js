import { useState, useCallback } from 'react';

import { TETROMINOS, randomTetromino } from '../tetrominos';
import { STAGE_WIDTH, checkCollision } from '../gameHelpers';
import { clone } from '@babel/types';

export const usePlayer = () => {

    const [player, setPlayer] = useState({
        pos: { x: 0, y: 0},                                    // This is the initial state of the player
        tetromino: TETROMINOS[0].shape,
        collided: false,
    });

    const rotate = (matrix, dir) => {
        // Make the rows to become cols (transpose)

        const rotatedTetro = matrix.map((_, index) => 
            matrix.map(col => col[index])
        );
        // Reverse each row to get a rotated matrix
        if (dir > 0) return rotatedTetro.map(row => row.reverse()); // rotate in one direction
        return rotatedTetro.reverse(); // rotate in the other direction
    };

    const playerRotate = (stage, dir) => {
        // this is a deep clone of the player, its a complete player
        const clonedPlayer = JSON.parse(JSON.stringify(player)); // complete clone of our player, we don't want to mutate the state so we clone the player
        clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);

        const pos = clonedPlayer.pos.x;
        let offset = 1;
        while (checkCollision(clonedPlayer, stage, { x: 0, y: 0})) {
            clonedPlayer.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > clonedPlayer.tetromino[0].length) {
                rotate(clonedPlayer.tetromino, -dir);
                clonedPlayer.pos.x = pos;
                return;
            }
        }
        setPlayer(clonedPlayer);
    };

    const updatePlayerPos = ({ x, y, collided }) => {
        setPlayer(prev => ({
            ...prev,
            pos: { x: (prev.pos.x += x), y: (prev.pos.y += y)}, // setting the state with the new x and y values and collided value
            collided,
        }));
    };

    const resetPlayer = useCallback(() => {
        setPlayer({
            pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
            tetromino: randomTetromino().shape,
            collided: false,
        })
    }, []);

    return [player, updatePlayerPos, resetPlayer, playerRotate];
}