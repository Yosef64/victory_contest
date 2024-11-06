import React from "react";
import "./rankCard.css";
function RankCard() {
  return (
    <div className="rank-card">
      <div className="profile">
        <span className="rank">4</span>
        <span>
          <img src="./profile.jpg" alt="" />
        </span>
        <p>smith carol</p>
      </div>
      <div>
        <span className="mark">6/10</span>
      </div>
    </div>
  );
}

export default RankCard;
