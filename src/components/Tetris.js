import React, { useState } from 'react';

import { createStage, checkCollision } from '../gameHelpers';

// Styled Components
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris';

// Custom Hooks
import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useGameStatus } from '../hooks/useGameStatus';

//Components
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';

const Tetris = () => {
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false); // not game over when we start

    const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const [stage, setStage, rowsCleared] = useStage(player, resetPlayer); 
    const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);

    console.log('re-render');

    const movePlayer = dir => {
        if (!checkCollision(player, stage, { x: dir, y: 0})) {
            updatePlayerPos({ x: dir, y: 0}); // controls the left to right movement
        }
    };

    const startGame = () => {
        console.log('Test')
        // Reset everything
        setStage(createStage());
        setDropTime(1000);
        resetPlayer();
        setGameOver(false);
        setScore(0);
        setRows(0);
        setLevel(0);
    };

    const drop = () => {
        // Increase the level when the player has cleared 10 rows
        if (rows > (level + 1) * 10) {
            setLevel(prev => prev + 1); // increasing level by one
            // also want to increase the speed
            setDropTime(1000 / (level + 1) + 200);
        }
        if (!checkCollision(player, stage, { x: 0, y: 1})) {    // moving one step down every step 
            updatePlayerPos({ x: 0, y: 1, collided: false });
        } else {
            // Game Over
            if (player.pos.y < 1) {
                console.log('GAME OVER');
                setGameOver(true);
                setDropTime(null);
            }
            updatePlayerPos({ x: 0, y: 0, collided: true})
        }
    };

    const keyUp = ({ keyCode }) => {
        if(!gameOver) {
            if (keyCode === 40) {
                setDropTime(1000 / (level + 1) + 200);
                console.log("interval on");
            }
        }
    }

    const dropPlayer = () => {
        console.log("Interval Off");
        setDropTime(null);// stops the interval when the player moves side to side
        drop();
    };

    const move = ({ keyCode }) => {
        if (!gameOver) {
            if (keyCode === 37)  {
                movePlayer(-1);
            } else if (keyCode === 39) {
                movePlayer(1);
            } else if (keyCode === 40) {
                dropPlayer();
            } else if (keyCode === 38) { // rotating it clockwise because dir = 1
                playerRotate(stage, 1);
            }
        }
    };

    // this will drop the tetromino without having to continuously hit the down button, it will drop one row every second
    useInterval(() => {
        drop();
    }, dropTime);

    return (
        <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={e => move(e)} onKeyUp={keyUp}>
            <StyledTetris>
                <Stage stage={stage} />
                <aside>
                    {gameOver ? (
                        <Display gameOver={gameOver} text="Game Over" />
                    ) : (
                        <div>
                            <Display text={`Score: ${score}`} />
                            <Display text = {`Rows: ${rows}`} />
                            <Display text = {`Level: ${level}`} />
                        </div>
                    )}
                    <StartButton callback={startGame} />
                </aside>
            </StyledTetris>
        </StyledTetrisWrapper>
    );
};

export default Tetris;