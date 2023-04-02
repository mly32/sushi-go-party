import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { lobbyApi } from './lobby';

export interface RoomData {
  matchID: string;
  playerID: string;
  credentials: string;
}

interface State {
  playerName: string | null;
  roomData: RoomData | null;
}

const initialState = (): State => {
  return {
    playerName: '',
    roomData: null,
  };
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setPlayerName: (state, action: PayloadAction<string | null>) => {
      const nickname = action.payload;
      state.playerName = nickname;
    },
    setRoomData: (state, action: PayloadAction<RoomData | null>) => {
      const roomData = action.payload;
      state.roomData = roomData;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        lobbyApi.endpoints.joinMatch.matchFulfilled,
        (state, action) => {
          const roomData: RoomData = {
            matchID: action.meta.arg.originalArgs.matchID,
            playerID: action.payload.playerID,
            credentials: action.payload.playerCredentials,
          };
          state.roomData = roomData;
        }
      )
      .addMatcher(lobbyApi.endpoints.leaveMatch.matchFulfilled, (state) => {
        state.roomData = null;
      });
  },
});

export const { setPlayerName, setRoomData } = userSlice.actions;
