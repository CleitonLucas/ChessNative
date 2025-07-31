import React from 'react';
import { View, StyleSheet, Pressable, ImageBackground } from 'react-native';
import { Piece } from '../../utils/types';
import PieceComponent from './Piece';

interface Props {
    pieces: Piece[];
    selectedPiece: Piece | null;
    validMoves: { row: number; col: number }[];
    onSelectPiece: (piece: Piece) => void;
    onMove: (row: number, col: number) => void;
}

export default function Board({ pieces, selectedPiece, validMoves, onSelectPiece, onMove }: Props) {
    const lightSquareTexture = require('../assets/textures/white_wood.png');
    const darkSquareTexture = require('../assets/textures/black_wood.png');

    const renderSquares = () => {
        const squares = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const isWhite = (row + col) % 2 === 0;
                const isValidMove = validMoves.some(m => m.row === row && m.col === col);
                const hasEnemyPiece = pieces.some(
                    p =>
                        p.row === row &&
                        p.col === col &&
                        selectedPiece &&
                        p.color !== selectedPiece.color
                );

                squares.push(
                    <Pressable
                        key={`${row}-${col}`}
                        onPress={() => onMove(row, col)}
                        style={styles.square}
                    >
                        <ImageBackground
                            source={isWhite ? lightSquareTexture : darkSquareTexture}
                            style={styles.square}
                            imageStyle={{ resizeMode: 'cover' }}
                        >
                            <View
                                style={[
                                    styles.overlay,
                                    {
                                        backgroundColor: isWhite ? 'black' : 'white',
                                        opacity: isWhite ? 0.05 : 0.09, 
                                    },
                                ]}
                            />
                            {isValidMove && !hasEnemyPiece && <View style={styles.moveIndicator} />}
                        </ImageBackground>
                    </Pressable>
                );
            }
        }
        return squares;
    };
    return (
        <View style={styles.container}>
            <View style={styles.board}>
                {renderSquares()}
                {pieces.map((piece, index) => {
                    const isValidCapture =
                        selectedPiece &&
                        selectedPiece.color !== piece.color &&
                        validMoves.some(m => m.row === piece.row && m.col === piece.col);
                    const isOwnPiece = selectedPiece?.color === piece.color;

                    return (
                        <PieceComponent
                            key={index}
                            piece={piece}
                            onSelect={() => {
                                if (!selectedPiece || isOwnPiece) {
                                    onSelectPiece(piece);
                                } else if (isValidCapture) {
                                    onMove(piece.row, piece.col);
                                }
                            }}
                            isSelected={
                                !!selectedPiece &&
                                selectedPiece.row === piece.row &&
                                selectedPiece.col === piece.col
                            }
                        />
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
    },
    board: {
        width: 320,
        height: 320,
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderColor: '#ccc',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    square: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowLabels: {
        width: 20,
        marginRight: 4,
    },
    rowLabel: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    colLabels: {
        flexDirection: 'row',
        width: 320,
        marginLeft: 24,
        marginTop: 1,
    },
    colLabel: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1b1b5e',
    },
    moveIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'black',
        borderWidth: 2,
        borderColor: 'yellow',
    },
});
