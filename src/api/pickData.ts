import { apiCall, addonApiUrl } from './api';

export interface PickData {
  actorCellId: number;
  championId: number;
  completed: boolean;
}

interface TeamPlayer {
  actorCellId: number;
  championId: number;
  completed?: boolean;
  type?: string;
}

interface PicksResponse {
  myTeam?: TeamPlayer[];
  theirTeam?: TeamPlayer[];
}

let cache: {
  data: PickData[];
  timestamp: number;
} | null = null;

const CACHE_DURATION = 1000; // 1 second cache
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second delay between retries

const processTeamData = (team: TeamPlayer[] | undefined): PickData[] => {
  if (!team || !Array.isArray(team)) return [];
  return team
    .filter((player): player is TeamPlayer => 
      typeof player === 'object' && 
      player !== null && 
      typeof player.championId === 'number' && 
      player.championId > 0 &&
      player.type !== 'ban'
    )
    .map(player => ({
      actorCellId: player.actorCellId,
      championId: player.championId,
      completed: player.completed || false
    }));
};

const fetchWithRetry = async (retries = MAX_RETRIES): Promise<PicksResponse> => {
  try {
    const result = await apiCall(addonApiUrl, 'picks');
    return result || {};
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(retries - 1);
    }
    throw error;
  }
};

export const pickDataApi = {
  get: async (): Promise<PickData[]> => {
    try {
      const now = Date.now();
      if (cache && (now - cache.timestamp) < CACHE_DURATION) {
        return cache.data;
      }

      const picks = await fetchWithRetry();
      const allTeams = [
        ...processTeamData(picks.myTeam),
        ...processTeamData(picks.theirTeam)
      ];

      cache = {
        data: allTeams,
        timestamp: now
      };

      return allTeams;
    } catch (error) {
      console.error('Error fetching pick data:', error);
      return cache?.data || [];
    }
  }
};