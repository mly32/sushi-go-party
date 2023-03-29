import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import SushiGo, { C } from '@sushi-go-party/sushi-go-game';
import { LobbyAPI } from 'boardgame.io';

import { CONFIG } from '../config';

const ServerUrl = CONFIG.serverUrl;
const GameName = SushiGo.name;

// TODO where for listMatches (isGameover, updatedBefore, updatedAfter)

export type MatchID = string;

export interface MatchData extends Omit<LobbyAPI.Match, 'setupData'> {
  setupData: C.SetupData;
}

export interface CreateMatchParams {
  numPlayers: number;
  setupData: C.SetupData;
  unlisted?: boolean;
}

export interface JoinMatchParams {
  // TODO playerID?, data?
  matchID: MatchID;
  playerName: string;
}

export interface LeaveMatchParams {
  matchID: MatchID;
  playerID: string;
  credentials: string;
}

export interface UpdatePlayerParams {
  // TODO data?
  matchID: MatchID;
  playerID: string;
  credentials: string;
  newName?: string;
}

export interface PlayAgainParams {
  matchID: MatchID;
  playerID: string;
  credentials: string;
  unlisted?: boolean;
}

export const lobbyApi = createApi({
  reducerPath: 'lobbyApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${ServerUrl}/games/${GameName}` }),
  endpoints: (builder) => ({
    listMatches: builder.query<MatchData[], boolean | undefined>({
      query: (gameOver) =>
        gameOver !== undefined
          ? `/?isGameover=${gameOver ? 'true' : 'false'}`
          : '/',
      transformResponse: (response: LobbyAPI.MatchList) =>
        response.matches as MatchData[],
    }),
    getMatch: builder.query<MatchData, MatchID>({
      query: (matchID) => `/${matchID}`,
    }),
    createMatch: builder.mutation<MatchID, CreateMatchParams>({
      query: (body) => ({
        url: '/create',
        method: 'POST',
        body,
      }),
      transformResponse: (response: LobbyAPI.CreatedMatch) => response.matchID,
    }),
    joinMatch: builder.mutation<LobbyAPI.JoinedMatch, JoinMatchParams>({
      query: ({ matchID, ...body }) => ({
        url: `${matchID}/join`,
        method: 'POST',
        body,
      }),
    }),
    leaveMatch: builder.mutation<void, LeaveMatchParams>({
      query: ({ matchID, ...body }) => ({
        url: `/${matchID}/leave`,
        method: 'POST',
        body,
      }),
    }),
    updatePlayer: builder.mutation<void, UpdatePlayerParams>({
      query: ({ matchID, ...body }) => ({
        url: `/${matchID}/update`,
        method: 'POST',
        body,
      }),
    }),
    playAgain: builder.mutation<MatchID, PlayAgainParams>({
      query: ({ matchID, ...body }) => ({
        url: `/${matchID}/playAgain`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: LobbyAPI.NextMatch) => response.nextMatchID,
    }),
  }),
});

export const {
  useListMatchesQuery,
  useGetMatchQuery,
  useCreateMatchMutation,
  useJoinMatchMutation,
  useLeaveMatchMutation,
  useUpdatePlayerMutation,
  usePlayAgainMutation,
} = lobbyApi;
