//Board.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Piece } from '../utils/types';
import PieceComponent from './Piece';

interface Props {
    pieces: Piece[];
    selectedPiece: Piece | null;
    validMoves: { row: number; col: number }[];
    onSelectPiece: (piece: Piece) => void;
    onMove: (row: number, col: number) => void;
}

export default function Board({ pieces, selectedPiece, validMoves, onSelectPiece, onMove }: Props) {
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
                        style={[
                            styles.square,
                            { backgroundColor: isWhite ? '#f0d9b5' : '#b58863' },
                            hasEnemyPiece && isValidMove && { borderWidth: 2, borderColor: 'green' },
                        ]}
                    >
                        {isValidMove && !hasEnemyPiece && <View style={styles.moveIndicator} />}
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
