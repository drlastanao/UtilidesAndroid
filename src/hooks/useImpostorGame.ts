"use client";

import { useState, useEffect, useCallback } from 'react';
import { ImpostorService, GameRoom, Player } from '../services/impostorService';

export function useImpostorGame() {
    const [roomId, setRoomId] = useState<string | null>(null);
    const [playerId, setPlayerId] = useState<string | null>(null);
    const [roomState, setRoomState] = useState<GameRoom | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Poll for updates (Simulation of real-time socket)
    useEffect(() => {
        if (!roomId) return;

        const checkUpdates = () => {
            const state = ImpostorService.getRoomState(roomId);
            if (state) {
                setRoomState(state);
            } else {
                // Room might have been deleted or invalid
                setError("La sala ya no existe");
                setRoomId(null);
            }
        };

        checkUpdates(); // Initial check
        const interval = setInterval(checkUpdates, 1000); // Check every second

        return () => clearInterval(interval);
    }, [roomId]);

    const createRoom = (playerName: string) => {
        try {
            const { room, playerId } = ImpostorService.createRoom(playerName);
            setRoomId(room.code);
            setPlayerId(playerId);
            setRoomState(room);
            setError(null);
        } catch (e) {
            console.error(e);
            setError("Error al crear la sala");
        }
    };

    const joinRoom = (code: string, playerName: string) => {
        try {
            const { room, playerId } = ImpostorService.joinRoom(code, playerName);
            setRoomId(room.code);
            setPlayerId(playerId);
            setRoomState(room);
            setError(null);
        } catch (e: any) {
            setError(e.message || "Error al unirse a la sala");
        }
    };

    const startGame = () => {
        if (roomId) {
            ImpostorService.startGame(roomId);
        }
    };

    const leaveRoom = () => {
        setRoomId(null);
        setPlayerId(null);
        setRoomState(null);
    };

    const myPlayer = roomState?.players.find(p => p.id === playerId);

    return {
        roomId,
        playerId,
        roomState,
        myPlayer,
        error,
        createRoom,
        joinRoom,
        startGame,
        leaveRoom
    };
}
