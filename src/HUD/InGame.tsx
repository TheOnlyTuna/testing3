import React from "react";
import TopBar from "./assets/TopBar.png";
import Tower from "./assets/Tower.svg";
import Baron from "./assets/icons/Baron.svg";
import Dragon from "./assets/icons/Dragon.svg";
import Gold from "./assets/icons/Gold.svg";
// DRAGON ICON 
import Heralds from "./assets/icons/Heralds.svg";
import MountainDragon from "./assets/dragons/Mountain.svg";
import InfernalDragon from "./assets/dragons/Infernal.svg";
import CloudDragon from "./assets/dragons/Cloud.svg";
import ElderDragon from "./assets/dragons/Elder.svg";
import OceanDragon from "./assets/dragons/Ocean.svg";
import HextechDragon from "./assets/dragons/Hextech.svg";
import ChemtechDragon from "./assets/dragons/Chemtech.svg";






import { GameData, LHMMatch, LHMPlayer, LHMTeam, LOLStatistics } from "../api/interfaces";
import { avatars } from "../api/avatars";
import CameraView from "./Camera/Camera";
import CameraContainer from "./Camera/Container";
import { kill } from "process";

// Hàm định dạng số gold
const formatGold = (gold: number): string => {
  if (gold >= 1000) {
    return (gold / 1000).toFixed(1) + 'K';
  }
  return gold.toString();
};

const DRAGON_PATHS: Record<string, string> = {
  Cloud: CloudDragon,
  Mountain: MountainDragon,
  Infernal: InfernalDragon,
  Elder: ElderDragon,
  Ocean: OceanDragon,
  Hextech: HextechDragon,
  Chemtech: ChemtechDragon,
  Default: Dragon, 
};


const bestOfToAmount = (bo?: string) => {
  switch (bo) {
    case "bo1":
      return 1;
    case "bo3":
      return 2;
    case "bo5":
      return 3;
    case "bo7":
      return 4;
    default:
      return 0;
  }
};

interface InGameProps {
  leftTeam?: LHMTeam;
  rightTeam?: LHMTeam;
  match?: LHMMatch;
  time?: number;
  nextBaronTime?: number;  
  nextDragonTime?: number; 
  nextDragon?: string; 
  BaronTime?: number;
  statistics?: LOLStatistics;
  observedPlayerLeft?: LHMPlayer;
  observedPlayerRight?: LHMPlayer;
  bottomLeftImage?: string;
  bottomImages?: string[];
  hideTopBar?: boolean;
}

const InGame = (props: InGameProps) => {
  const {
    leftTeam,
    rightTeam,
    match,
    time,
    statistics,
    nextBaronTime,
    nextDragonTime,
    nextDragon,
    observedPlayerLeft,
    observedPlayerRight,
    bottomImages,
    bottomLeftImage,
    hideTopBar,
  } = props;

  const minutes = time ? Math.floor(time / 60) : 0;
  const seconds = time ? Math.floor(time % 60) : 0;

  const secondsToTime = (s: number): string => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const getCountdown = (target: number | undefined | null, current: number | undefined): string => {
    if (!target || !current) return "ALIVE";
    const diff = target - current;
    if (diff <= 0) return "ALIVE";
    return `${secondsToTime(diff)}`;
  };

  const baronCountdown = getCountdown(nextBaronTime, time);
  const dragonCountdown = getCountdown(nextDragonTime, time);
  

  return (
    <div className="ingame">

            <div className="baron-time">
              <div
                  className="time-icon"
                  style={{ backgroundImage: `url(${Baron})` }}
                  />
                  
                    <span className="time-text">{baronCountdown}</span>
        </div>
            <div className="dragon-time">
              <div
                  className="time-icon"
                  style={{ backgroundImage: `url(${nextDragon ? DRAGON_PATHS[nextDragon] || DRAGON_PATHS.Default : DRAGON_PATHS.Default})` }}
                  />
                  
                    <span className="time-text">{dragonCountdown}</span>
        </div>
      {/* vpstudio layout */}
      <div className="default-hub">
        

        <div className={`top-bar-container ${hideTopBar && "hidden"}`}>
          <div className="top-bar" style={{ backgroundImage: `url(${TopBar})` }}>
            
            <div className="inner-section">

              
              <div className="inner-inner-section">
              {!!leftTeam && (
                <div
                  className="team-logo"
                  style={{
                    backgroundImage: `url(/api/teams/logo/${leftTeam?._id})`,
                  }}
                />
              )}
                <div className="team-info">
                  <div className="bo-box">
                    {[...Array(match?.left?.wins || 0)].map((_, i) => (
                      <div className="box win" key={i} />
                    ))}
                    {[
                      ...Array(
                        bestOfToAmount(match?.matchType) -
                          (match?.left?.wins || 0)
                      ),
                    ].map((_, i) => (
                      <div className="box" key={i + 10} />
                    ))}
                  </div>
                  <div className="name">{leftTeam?.shortName || "ONE"}</div>
                </div>
                <div className="separator" />
                <div className="tower-info">
                  <div className="tower-div">

                  <div
                    className="tower-icon"
                    style={{ backgroundImage: `url(${Baron})` }}
                    />
                  <div className="amount">
                    {statistics?.red.barons || 0}
                  </div>
                    </div>
                    <div className="tower-div">
                  <div
                    className="tower-icon"
                    style={{ backgroundImage: `url(${Dragon})` }}
                  />
                  <div className="amount">
                  {statistics?.red.dragons.length || 0}
                  </div>
                  </div>
                  <div className="tower-div">

                  <div
                    className="tower-icon"
                    style={{ backgroundImage: `url(${Tower})` }}
                    />
                  <div className="amount">
                    {statistics?.red.turretsDestroyed || 0}
                  </div>
                  </div>
                    <div className="separator-md" />              
                  <div className="tower-div">
                    <div
                      className="tower-icon"
                      style={{ backgroundImage: `url(${Gold})` }}
                      />
                    <div className="amount">
                      {formatGold(statistics?.red.gold || 0)}
                    </div>
                  </div>
                </div>

                
                <div className="team-score">{statistics?.blue?.kills || 0}</div>
              </div>
              <div className="inner-inner-section right">
                {!!rightTeam && (
                <div
                  className="team-logo right"
                  style={{
                    backgroundImage: `url(/api/teams/logo/${rightTeam?._id})`,
                  }}
                />
              )}
                <div className="team-info">
                  <div className="name right">{rightTeam?.shortName || "TWO"}</div>
                  <div className="bo-box right">
                    {[...Array(match?.right?.wins || 0)].map((_, i) => (
                      <div className="box win right" key={i} />
                    ))}
                    {[
                      ...Array(
                        bestOfToAmount(match?.matchType) -
                          (match?.right?.wins || 0)
                      ),
                    ].map((_, i) => (
                      <div className="box" key={i + 10} />
                    ))}
                  </div>
                </div>
                <div className="separator" />
                <div className="tower-info">
                
                  <div className="tower-div">
                    <div
                      className="tower-icon"
                      style={{ backgroundImage: `url(${Gold})` }}
                    />
                    <div className="amount">
                      {formatGold(statistics?.blue.gold || 0)}
                    </div>
                  </div>
                  <div className="separator-md" />
                  <div className="tower-div">  
                    <div
                      className="tower-icon"
                      style={{ backgroundImage: `url(${Tower})` }}
                    />
                    <div className="amount">
                      {statistics?.blue.turretsDestroyed || 0}
                    </div>
                  </div>
                  
                  <div className="tower-div">  
                    <div
                      className="tower-icon"
                      style={{ backgroundImage: `url(${Dragon})` }}
                    />
                    <div className="amount">
                      {statistics?.blue.dragons.length || 0}
                    </div>
                  </div>
                  <div className="tower-div">  
                    <div
                      className="tower-icon"
                      style={{ backgroundImage: `url(${Baron})` }}
                    />
                    <div className="amount">
                      {statistics?.blue.barons || 0}
                    </div>
                  </div>
                </div>
                <div className="team-score right">
                  {statistics?.red?.kills || 0}
                </div>
              </div>
            </div>
            <div className="footer">
            <div className="footer-icon-dragons">
                      {statistics?.blue.dragons?.length
                      ? statistics.blue.dragons.map((dragon, i) => {
                        // Lấy icon dựa trên dragon.type
                        const icon = DRAGON_PATHS[dragon.type] ?? DRAGON_PATHS.Default;
                        return (
                          <div 
                          key={i}
                          className="footer-icon"
                          style={{
                            backgroundImage: `url(${icon})`,
                          }} 
                          />
                        );
                      })
                      : <div className="footer-icon"/>
                    }
                  </div>
              <div className="footer-amount">
                        {statistics?.blue.heralds || 0}
                      </div>
                  <div
                      className="footer-icon"
                      style={{
                        backgroundImage: `url(${Heralds})`,
                      }}
                    />
                    
                  <div className="separator-sm" />
                <div className="timer">               
                  {minutes}:{seconds < 10 ? "0" : ""}
                  {seconds}
                </div>
                  <div className="separator-sm right" />
                  <div
                      className="footer-icon"
                      style={{
                        backgroundImage: `url(${Heralds})`,
                      }}
                    />
                  <div className="footer-amount">
                        {statistics?.red.heralds || 0}
                    </div>
                    <div className="footer-icon-dragons">
                      {statistics?.red.dragons?.length
                      ? statistics.red.dragons.map((dragon, i) => {
                        // Lấy icon dựa trên dragon.type
                        const iconDragon = DRAGON_PATHS[dragon.type] ?? DRAGON_PATHS.Default;
                        return (
                          <>
                          <div 
                          key={i}
                          className="footer-icon"
                          style={{
                            backgroundImage: `url(${iconDragon})`,
                          }} 
                          />
                          </>
                        );
                      })
                      : <div className="footer-icon"/>
                    }
                  </div>
              </div>
          </div>
      </div>

      {/* PlayerPreview */}
      {/* <div className={`player-preview-box ${!observedPlayerLeft && "hidden"}`}>
        <div className="player-preview-inner-box">
          <div
            className="player-preview"
            style={{
              backgroundImage: observedPlayerLeft?.avatar
                ? `url(${observedPlayerLeft.avatar}),linear-gradient(0deg, #0E0B13 0%, #20192B 100%)`
                : "linear-gradient(0deg, #0E0B13 0%, #20192B 100%)",
            }}
          >
            <CameraContainer
              observedSteamid={observedPlayerLeft?.steamid || ""}
            />
          </div>
          <div className="bottom-deco" />
          <div className="name">{observedPlayerLeft?.username}</div>
        </div>
      </div> */}

      {/* <div
        className={`player-preview-box right ${
          !observedPlayerRight && "hidden"
        }`}
      >
        <div className="player-preview-inner-box">
          <div
            className="player-preview"
            style={{
              backgroundImage: observedPlayerRight?.avatar
                ? `url(${observedPlayerRight.avatar}),linear-gradient(0deg, #0E0B13 0%, #20192B 100%)`
                : "linear-gradient(0deg, #0E0B13 0%, #20192B 100%)",
            }}
          >
            <CameraContainer
              observedSteamid={observedPlayerRight?.steamid || ""}
            />
          </div>
          <div className="bottom-deco" />
          <div className="name">{observedPlayerRight?.username}</div>
        </div>
      </div> */}
      {/* {bottomImages?.length && (
        <div className="bottom-image">
          {bottomImages.map((image) => (
            <div
              className="bottom-image-inner"
              style={{
                backgroundImage: `url(data:image;base64,${image})`,
              }}
            />
          ))}
        </div>
      )}
      {!!bottomLeftImage && (
        <div
          className="bottom-left-image"
          style={{
            backgroundImage: `url(data:image;base64,${bottomLeftImage}),linear-gradient(0deg, #0E0B13 0%, #20192B 100%)`,
          }}
        />
      )} */}
      </div>
    </div>
  );
};

export default InGame;