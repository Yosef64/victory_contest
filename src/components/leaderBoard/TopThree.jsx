import React from "react";

function TopThree({ rank, image, name, score, total }) {
  return (
    <>
      <img src={image || "./profile.jpg"} className={`pic${rank}`} alt="" />
      <span>{rank}</span>
      <article>
        <p>{name}</p>
        <p>
          {score}/{total}
        </p>
      </article>
    </>
  );
}
export default TopThree;
