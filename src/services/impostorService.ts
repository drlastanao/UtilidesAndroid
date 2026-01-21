export type Role = 'IMPOSTOR' | 'CITIZEN' | null;

export interface Player {
    id: string;
    name: string;
    role: Role;
    isHost: boolean;
}

export interface GameRoom {
    code: string;
    hostId: string;
    players: Player[];
    status: 'LOBBY' | 'PLAYING' | 'FINISHED';
    secretWord: string;
    impostorId: string | null;
}

const STORAGE_KEY = 'impostor_games';

// Helper to get all rooms
const getRooms = (): Record<string, GameRoom> => {
    if (typeof window === 'undefined') return {};
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
};

// Helper to save room
const saveRoom = (room: GameRoom) => {
    const rooms = getRooms();
    rooms[room.code] = room;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
    // Dispatch event for local updates across hooks if needed (mostly for same-tab updates)
    window.dispatchEvent(new Event('impostor-storage-update'));
};

const WORDS = [
    'Guitarra', 'Elefante', 'Playa', 'Pizza', 'Universo', 'Reloj',
    'Montaña', 'Libro', 'Computadora', 'Futbol', 'Avion', 'Helado'
];

export const ImpostorService = {
    createRoom: (playerName: string): { room: GameRoom, playerId: string } => {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const playerId = crypto.randomUUID();

        const newRoom: GameRoom = {
            code,
            hostId: playerId,
            players: [{
                id: playerId,
                name: playerName,
                role: null,
                isHost: true
            }],
            status: 'LOBBY',
            secretWord: '',
            impostorId: null
        };

        saveRoom(newRoom);
        return { room: newRoom, playerId };
    },

    joinRoom: (code: string, playerName: string): { room: GameRoom, playerId: string } => {
        const rooms = getRooms();
        const room = rooms[code];

        if (!room) throw new Error('Sala no encontrada');
        if (room.status !== 'LOBBY') throw new Error('El juego ya ha comenzado');

        const playerId = crypto.randomUUID();
        room.players.push({
            id: playerId,
            name: playerName,
            role: null,
            isHost: false
        });

        saveRoom(room);
        return { room, playerId };
    },

    startGame: (code: string) => {
        const rooms = getRooms();
        const room = rooms[code];
        if (!room) return;

        // Assign Roles
        const playerIds = room.players.map(p => p.id);
        const impostorIndex = Math.floor(Math.random() * playerIds.length);
        const impostorId = playerIds[impostorIndex];
        const word = WORDS[Math.floor(Math.random() * WORDS.length)];

        room.players = room.players.map(p => ({
            ...p,
            role: p.id === impostorId ? 'IMPOSTOR' : 'CITIZEN'
        }));

        room.impostorId = impostorId;
        room.secretWord = word;
        room.status = 'PLAYING';

        saveRoom(room);
    },

    endGame: (code: string) => {
        const rooms = getRooms();
        const room = rooms[code];
        if (!room) return;

        room.status = 'FINISHED';
        saveRoom(room);
    },

    getRoomState: (code: string): GameRoom | null => {
        const rooms = getRooms();
        return rooms[code] || null;
    }
};
