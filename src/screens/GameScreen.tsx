import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Pressable, Alert, Modal } from 'react-native';
import Board from '../components/Board';
import { initialPieces } from '../utils/initialPieces';
import { GameMode, Piece } from '../utils/types';
import { getValidMoves } from '../utils/chessLogic';
import { isCheckmate, isInCheck } from '../utils/checkLogic';
import { isStalemate, isFiftyMoveRule } from '../utils/drawLogic';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import CapturedPieces from '../components/CapturedPieces';
import PlayerProfile from '../components/PlayerProfile';

export default function GameScreen() {
    type GameRouteProp = RouteProp<RootStackParamList, 'Game'>;

    const initialTimeByMode: Record<GameMode, number> = {
        classic: 30 * 60, 
        rapid: 10 * 60,   
        blitz: 3 * 60     
    };

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const route = useRoute<GameRouteProp>();
    const mode = (route.params?.mode as GameMode) ?? 'classic'; 
    const initialTime = initialTimeByMode[mode] ?? 1800;       

    const [ capturedWhitePieces, setCapturedWhitePieces] = useState<Piece[]>([]);
    const [capturedBlackPieces, setCapturedBlackPieces] = useState<Piece[]>([]);

    const [whiteTime, setWhiteTime] = useState(initialTime);
    const [blackTime, setBlackTime] = useState(initialTime);

    const [pieces, setPieces] = useState<Piece[]>(initialPieces);
    const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
    const [validMoves, setValidMoves] = useState<{ row: number; col: number }[]>([]);
    const [turn, setTurn] = useState<'white' | 'black'>('white');
    const [promotionPending, setPromotionPending] = useState<{ row: number; col: number; color: 'white' | 'black' } | null>(null);
    const [enPassantTarget, setEnPassantTarget] = useState<{ row: number; col: number } | null>(null);
    const [halfMoveClock, setHalfMoveClock] = useState(0);
    const [drawRequest, setDrawRequest] = useState<null | 'white' | 'black'>(null);

    const player1Avatar = require('../assets/miranha.jpg');
    const player2Avatar = require('../assets/venom.jpg');

    const formatTime = (seconds: number) => {
        if (typeof seconds !== 'number' || isNaN(seconds)) return '00 : 00';
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins} : ${secs}`;
    };

    const resetGame = () => {
        setPieces(initialPieces);
        setSelectedPiece(null);
        setValidMoves([]);
        setTurn('white');
        setPromotionPending(null);
        setEnPassantTarget(null);
        setHalfMoveClock(0);
        setDrawRequest(null);
        setCapturedWhitePieces([]);
        setCapturedBlackPieces([]);
    };

    const handleRequestDraw = () => {
        setDrawRequest(turn);
    };

    const handleSelectPiece = (piece: Piece) => {
        if (piece.color !== turn) return;

        setSelectedPiece(piece);
        const moves = getValidMoves(piece, pieces, enPassantTarget);
        setValidMoves(moves);
    };

    const handleMove = (row: number, col: number) => {
        if (!selectedPiece) return;

        const isValid = validMoves.some(m => m.row === row && m.col === col);
        if (!isValid) {
            setSelectedPiece(null);
            setValidMoves([]);
            return;
        }

        const targetPiece = pieces.find(p => p.row === row && p.col === col);
        const isEnPassantCapture =
            selectedPiece.type === "pawn" &&
            enPassantTarget &&
            enPassantTarget.row === row &&
            enPassantTarget.col === col &&
            !targetPiece;

        let updatedPieces = pieces;
        const isCapture = !!targetPiece || isEnPassantCapture;

        if (isCapture && targetPiece) {
            if (targetPiece.color === 'white') {
                setCapturedWhitePieces(prev => [...prev, targetPiece]);
            } else {
                setCapturedBlackPieces(prev => [...prev, targetPiece]);
            }
        }

        const isPawnMove = selectedPiece.type === "pawn";

        if (isEnPassantCapture) {
            const direction = selectedPiece.color === "white" ? 1 : -1;
            const capturedPawnRow = row + direction;
            updatedPieces = updatedPieces.filter(
                p => !(p.row === capturedPawnRow && p.col === col)
            );
        } else {
            updatedPieces = updatedPieces.filter(
                p => !(p.row === row && p.col === col)
            );
        }

        const isKingSideCastle =
            selectedPiece.type === "king" &&
            Math.abs(col - selectedPiece.col) === 2 &&
            col > selectedPiece.col;

        const isQueenSideCastle =
            selectedPiece.type === "king" &&
            Math.abs(col - selectedPiece.col) === 2 &&
            col < selectedPiece.col;

        if (isKingSideCastle || isQueenSideCastle) {
            const rookStartCol = isKingSideCastle ? 7 : 0;
            const rookEndCol = isKingSideCastle ? col - 1 : col + 1;
            const rowOfKing = selectedPiece.row;

            updatedPieces = updatedPieces.map(p => {
                if (p.type === 'rook' && p.row === rowOfKing && p.col === rookStartCol) {
                    return { ...p, col: rookEndCol, hasMoved: true };
                }
                return p;
            });
        }

        updatedPieces = updatedPieces.map(p => {
            if (p.row === selectedPiece.row && p.col === selectedPiece.col) {
                return { ...p, row, col, hasMoved: true };
            }
            return p;
        });

        const movedPiece = updatedPieces.find(p => p.row === row && p.col === col);

        const promotionRow = movedPiece?.color === 'white' ? 0 : 7;
        if (movedPiece?.type === 'pawn' && row === promotionRow) {
            setPromotionPending({ row, col, color: movedPiece.color });
            setPieces(updatedPieces);
            setSelectedPiece(null);
            setValidMoves([]);
            setEnPassantTarget(null);
            setDrawRequest(null);
            return;
        }

        let newEnPassantTarget: { row: number; col: number } | null = null;
        if (
            movedPiece?.type === 'pawn' &&
            Math.abs(row - selectedPiece.row) === 2
        ) {
            const enPassantRow = (row + selectedPiece.row) / 2;
            newEnPassantTarget = { row: enPassantRow, col };
        }

        const nextHalfMoveClock = isPawnMove || isCapture ? 0 : halfMoveClock + 1;
        const nextTurn = turn === 'white' ? 'black' : 'white';

        setPieces(updatedPieces);
        setSelectedPiece(null);
        setValidMoves([]);
        setEnPassantTarget(newEnPassantTarget);
        setHalfMoveClock(nextHalfMoveClock);
        setTurn(nextTurn);
        setDrawRequest(null);

        setTimeout(() => {
            if (isFiftyMoveRule(nextHalfMoveClock)) {
                Alert.alert("Empate pela regra dos 50 lances", "", [{ text: "OK", onPress: resetGame }]);
                return;
            }

            const isOpponentInCheck = isInCheck(nextTurn, updatedPieces);
            const isOpponentCheckmate = isCheckmate(nextTurn, updatedPieces);
            const isOpponentStalemate = isStalemate(nextTurn, updatedPieces);

            if (isOpponentCheckmate) {
                Alert.alert("Cheque-mate", `Vitória das ${turn === 'white' ? 'brancas' : 'pretas'}!`, [
                    { text: "OK", onPress: resetGame }
                ]);
            } else if (isOpponentStalemate) {
                Alert.alert("Empate", "Empate por afogamento!", [
                    { text: "OK", onPress: resetGame }
                ]);
            } else if (isOpponentInCheck) {
                Alert.alert("Cheque", `As ${nextTurn === 'white' ? 'brancas' : 'pretas'} estão em cheque!`);
            }
        }, 100);
    };

    useEffect(() => {
        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            if (turn === 'white') {
                setWhiteTime(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current!);
                        Alert.alert("Tempo esgotado!", "As pretas venceram por tempo!", [
                            { text: "OK", onPress: resetGame }
                        ]);
                        return 0;
                    }
                    return prev - 1;
                });
            } else {
                setBlackTime(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current!);
                        Alert.alert("Tempo esgotado!", "As brancas venceram por tempo!", [
                            { text: "OK", onPress: resetGame }
                        ]);
                        return 0;
                    }
                    return prev - 1;
                });
            }
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [turn]);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const handlePromotion = (newType: Piece['type']) => {
        if (!promotionPending) return;

        const updatedPieces = pieces.map(p => {
            if (p.row === promotionPending.row && p.col === promotionPending.col) {
                return { ...p, type: newType };
            }
            return p;
        });

        const nextTurn = turn === 'white' ? 'black' : 'white';

        setPieces(updatedPieces);
        setPromotionPending(null);
        setTurn(nextTurn);
        setHalfMoveClock(0);
        setDrawRequest(null);

        setTimeout(() => {
            if (isFiftyMoveRule(halfMoveClock)) {
                Alert.alert("Empate pela regra dos 50 lances", "", [{ text: "OK", onPress: resetGame }]);
                return;
            }

            const isOpponentInCheck = isInCheck(nextTurn, updatedPieces);
            const isOpponentCheckmate = isCheckmate(nextTurn, updatedPieces);
            const isOpponentStalemate = isStalemate(nextTurn, updatedPieces);

            if (isOpponentCheckmate) {
                Alert.alert("Cheque-mate", `Vitória das ${turn === 'white' ? 'brancas' : 'pretas'}!`, [
                    { text: "OK", onPress: resetGame }
                ]);
            } else if (isOpponentStalemate) {
                Alert.alert("Empate", "Empate por afogamento!", [
                    { text: "OK", onPress: resetGame }
                ]);
            } else if (isOpponentInCheck) {
                Alert.alert("Cheque", `As ${nextTurn === 'white' ? 'brancas' : 'pretas'} estão em cheque!`);
            }
        }, 100);
    };

    return (
        <View style={styles.container}>
            <PlayerProfile
                avatar={player1Avatar}
                name="Miranha"
                rank="Rank 90º"
                time={formatTime(blackTime)}
                isActiveTurn={turn === 'black'}
            />
            <View style={{ marginVertical: 8 }}>
                <CapturedPieces pieces={capturedWhitePieces} />
            </View>
            <Board
                pieces={pieces}
                selectedPiece={selectedPiece}
                validMoves={validMoves}
                onSelectPiece={handleSelectPiece}
                onMove={handleMove}
            />
            <View style={{ marginVertical: 8 }}>
                <CapturedPieces pieces={capturedBlackPieces} />
            </View>
            <PlayerProfile
                avatar={player2Avatar}
                name="Venom"
                rank="Rank 90º"
                time={formatTime(whiteTime)}
                isActiveTurn={turn === 'white'}
            />
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <Pressable style={styles.button} onPress={handleRequestDraw}>
                    <Text style={styles.buttonText}>Pedir Empate</Text>
                </Pressable>
            </View>

            {promotionPending && (
                <View style={styles.modal}>
                    <Text style={styles.modalTitle}>Escolha a peça</Text>
                    <View style={styles.piecesRow}>
                        {['queen', 'rook', 'bishop', 'knight'].map((type) => (
                            <Pressable
                                key={type}
                                style={styles.pieceButton}
                                onPress={() => handlePromotion(type as Piece['type'])}
                            >
                                <Text style={styles.pieceText}>
                                    {type === 'queen' && '♛'}
                                    {type === 'rook' && '♜'}
                                    {type === 'bishop' && '♝'}
                                    {type === 'knight' && '♞'}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
            )}

            {drawRequest && turn === drawRequest && (
                <Modal transparent animationType="fade" visible>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>
                            As {drawRequest === 'white' ? 'brancas' : 'pretas'} propõem empate. Aceitar?
                        </Text>
                        <View style={styles.piecesRow}>
                            <Pressable style={styles.pieceButton} onPress={resetGame}>
                                <Text style={styles.pieceText}>Aceitar</Text>
                            </Pressable>
                            <Pressable style={styles.pieceButton} onPress={() => setDrawRequest(null)}>
                                <Text style={styles.pieceText}>Rejeitar</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        backgroundColor: '#E7C593',
    },
    modal: {
        position: 'absolute',
        top: '40%',
        left: '10%',
        right: '10%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    piecesRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    pieceButton: {
        padding: 10,
        marginHorizontal: 5,
        backgroundColor: '#ddd',
        borderRadius: 8,
    },
    pieceText: {
        fontSize: 20,
    },
    button: {
        backgroundColor: '#555',
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
    },
});
