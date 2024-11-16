import React from "react";
import "./rankCard.css";
function RankCard({ rank, name, score, total }) {
  return (
    <div className="rank-card">
      <div className="profile">
        <span className="rank">{rank}</span>
        <span>
          <img src="./profile.jpg" alt="" />
        </span>
        <p>{name}</p>
      </div>
      <div>
        <span className="mark">
          {score}/{total}
        </span>
      </div>
    </div>
  );
}

export default RankCard;
