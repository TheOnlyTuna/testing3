import React, { useEffect, useState } from "react";
import { LHMPlayer, LHMTeam } from "../api/interfaces";
import { PickData, pickDataApi } from "../api/pickData";

interface Props {
  teamData?: any;
  teamBans?: any;
  teams: LHMTeam[];
  players: LHMPlayer[];
}

const SidePick = (props: Props) => {
  const data = props.teamData;
  const bans = props.teamBans;
  const teams = props.teams;
  const players = props.players;
  const [pickData, setPickData] = useState<PickData[]>([]);

  useEffect(() => {
    const fetchPickData = async () => {
      const data = await pickDataApi.get();
      setPickData(data);
    };
    fetchPickData();
    const interval = setInterval(fetchPickData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sidePick">
      {bans ? (
        bans.map((x: any) => (
          <div className="sidePickInfo">
            <p>Banned champion ID: {x}</p>
          </div>
        ))
      ) : (
        <></>
      )}
      {data
        ? data.map((x: any) => {
            const player = players.find((p) => p.steamid === x.summonerName);

            return (
              <div className="sidePickInfo">
                <div className="playerAvatar">
                  {player?.avatar ? (
                    <img
                      src={player.avatar}
                      alt="LHM Avatar"
                      className="playerAvatarImg"
                    />
                  ) : (
                    <div className="playerAvatarImg" />
                  )}
                </div>
                <p>Champion ID: {x.championId}</p>
                <p>Summoner ID: {x.summonerId}</p>
                <p>Summoner name: {x.summonerName}</p>
                <p>Assigned position: {x.AssignedPosition}</p>
                {player ? (
                  <p>
                    {player.firstName} {player.lastName} from {player.country}{" "}
                    (Team: {player.team})
                  </p>
                ) : (
                  <p>No LHM data found</p>
                )}
              </div>
            );
          })
        : null}
    </div>
  );
};

export default SidePick;
