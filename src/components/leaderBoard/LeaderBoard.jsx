import React, { useEffect, useState } from "react";
import "./leaderBoard.css";
import RankCard from "../rankCard/RankCard";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { NavLink } from "react-router-dom";
import TopThree from "./TopThree";
function LeaderBoard() {
  const [userList, setUserList] = useState([
    { name: "carol", score: 11, id: 339831, image: "./profile.jpg" },
    { name: "carol", score: 11, id: 339832, image: "./profile.jpg" },
    { name: "carol", score: 11, id: 339833, image: "./profile.jpg" },
    { name: "carol", score: 11, id: 339834, image: "./profile.jpg" },
    { name: "carol", score: 11, id: 339835, image: "./profile.jpg" },
    { name: "carol", score: 11, id: 339836, image: "./profile.jpg" },
    { name: "carol", score: 11, id: 339837, image: "./profile.jpg" },
    { name: "carol", score: 11, id: 339838, image: "./profile.jpg" },
    { name: "carol", score: 11, id: 339839, image: "./profile.jpg" },
    { name: "carol", score: 11, id: 339839, image: "./profile.jpg" },
    { name: "carol", score: 11, id: 339839, image: "./profile.jpg" },
    { name: "carol", score: 11, id: 339839, image: "./profile.jpg" },
    { name: "carol", score: 11, id: 339839, image: "./profile.jpg" },
    { name: "carol", score: 11, id: 339839, image: "./profile.jpg" },
    { name: "carol", score: 11, id: 339839, image: "./profile.jpg" },
    { name: "carol", score: 11, id: 339839, image: "./profile.jpg" },
  ]);

  useEffect(() => {}, []);

  return (
    <div className="leader-board">
      <div className="top-3">
        <div className="title">
          <div className="home-link">
            <NavLink to={"/"}>
              <MdOutlineKeyboardArrowLeft />
            </NavLink>
          </div>
          <span>leaderboard</span>
        </div>

        <div className="wrapper">
          {userList[1] && (
            <NavLink to={`/profile/${userList[1].id}`}>
              <div className="number2">
                <TopThree
                  name={userList[1].name}
                  image={userList[1].image}
                  id={userList[1].id}
                  score={userList[1].score}
                  total={userList.length}
                  rank={2}
                />
              </div>
            </NavLink>
          )}
          {userList[0] && (
            <NavLink to={`/profile/${userList[0].id}`}>
              <div className="number1">
                <svg
                  width="26"
                  height="21"
                  viewBox="0 0 26 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23.4281 10.7877L17.6434 15.4794L13.0801 8.60952L8.51845 15.4772L2.73528 10.8137L2.20203 7.64061L8.03877 12.3631L13.0791 4.77533L18.1204 12.3631L23.9571 7.64061L23.4281 10.7877Z"
                    fill="#ECF0F1"
                  />
                  <path
                    d="M23.4281 10.7851L21.8347 20.264H4.32449L2.73529 10.8111L8.51846 15.4779L13.0801 8.60986L17.6434 15.4809L23.4281 10.7851Z"
                    fill="#F8C660"
                  />
                  <path
                    d="M13.0796 4.77548C14.2518 4.77548 15.202 3.82523 15.202 2.65303C15.202 1.48083 14.2518 0.530579 13.0796 0.530579C11.9074 0.530579 10.9571 1.48083 10.9571 2.65303C10.9571 3.82523 11.9074 4.77548 13.0796 4.77548Z"
                    fill="#F8C660"
                  />
                  <path
                    d="M23.7449 8.51628C24.6973 8.51628 25.4694 7.74421 25.4694 6.7918C25.4694 5.8394 24.6973 5.06732 23.7449 5.06732C22.7925 5.06732 22.0204 5.8394 22.0204 6.7918C22.0204 7.74421 22.7925 8.51628 23.7449 8.51628Z"
                    fill="#F8C660"
                  />
                  <path
                    d="M2.25509 8.51628C3.20749 8.51628 3.97957 7.74421 3.97957 6.7918C3.97957 5.8394 3.20749 5.06732 2.25509 5.06732C1.30269 5.06732 0.530609 5.8394 0.530609 6.7918C0.530609 7.74421 1.30269 8.51628 2.25509 8.51628Z"
                    fill="#F8C660"
                  />
                  <path
                    d="M13.1083 18.4021L11.1974 15.6953L13.1083 12.9886L15.0191 15.6953L13.1083 18.4021Z"
                    fill="#DF5F4E"
                  />
                  <path
                    d="M26 6.79184C26 5.54836 24.9884 4.53675 23.7449 4.53675C22.5014 4.53675 21.4898 5.54836 21.4898 6.79184C21.4898 7.42305 21.7508 7.99414 22.1702 8.40389L18.2398 11.5839L13.9671 5.15293C14.9948 4.787 15.7327 3.80479 15.7327 2.65307C15.7327 1.19016 14.5425 0 13.0796 0C11.6167 0 10.4266 1.19016 10.4266 2.65307C10.4266 3.80453 11.1641 4.78654 12.1914 5.15267L7.91934 11.5839L3.90015 8.33198C4.27812 7.92858 4.51019 7.38695 4.51019 6.79184C4.51019 5.54836 3.49857 4.53675 2.25509 4.53675C1.01161 4.53675 0 5.54836 0 6.79184C0 7.91289 0.822352 8.84513 1.89546 9.01794L3.80128 20.3493C3.84424 20.6047 4.0655 20.7946 4.32453 20.7946H21.8347C22.0938 20.7946 22.315 20.6048 22.358 20.3493L24.2693 8.9861C25.2606 8.74905 26 7.85479 26 6.79184ZM11.4877 2.65307C11.4877 1.77531 12.2018 1.06123 13.0796 1.06123C13.9573 1.06123 14.6714 1.77531 14.6714 2.65307C14.6714 3.53082 13.9573 4.24491 13.0796 4.24491C12.2018 4.24491 11.4877 3.53082 11.4877 2.65307ZM8.11916 12.8876C8.26683 12.8649 8.3981 12.7811 8.48072 12.6567L13.0791 5.73422L17.6785 12.6567C17.7611 12.7811 17.8924 12.8649 18.04 12.8875C18.1877 12.91 18.338 12.8695 18.4542 12.7755L23.1587 8.96914C23.1705 8.97234 23.1823 8.97558 23.1942 8.97858L22.9392 10.4959L17.7623 14.6991L13.5221 8.31553C13.4238 8.1675 13.2579 8.07848 13.0801 8.07848C12.9024 8.07848 12.7364 8.16745 12.6381 8.31553L8.39866 14.6979L3.22415 10.5211L2.9575 8.93435L7.70499 12.7755C7.82113 12.8695 7.97134 12.9101 8.11916 12.8876ZM1.06123 6.79184C1.06123 6.13351 1.59677 5.59797 2.25509 5.59797C2.91342 5.59797 3.44896 6.13351 3.44896 6.79184C3.44896 7.45017 2.91342 7.98571 2.25509 7.98571C1.59677 7.98571 1.06123 7.45017 1.06123 6.79184ZM21.3859 19.7334H4.77334L3.4906 12.1026L8.18518 15.8908C8.30131 15.9846 8.45162 16.0243 8.59914 16.0017C8.74666 15.979 8.87783 15.8948 8.96045 15.7705L13.0801 9.5683L17.2014 15.7728C17.2842 15.8974 17.4156 15.9812 17.5634 16.0037C17.7115 16.0263 17.8617 15.9853 17.9778 15.8911L22.6719 12.0825L21.3859 19.7334ZM23.7449 7.98571C23.0866 7.98571 22.551 7.45017 22.551 6.79184C22.551 6.13351 23.0866 5.59797 23.7449 5.59797C24.4032 5.59797 24.9388 6.13351 24.9388 6.79184C24.9388 7.45017 24.4032 7.98571 23.7449 7.98571Z"
                    fill="#231F20"
                  />
                  <path
                    d="M13.5152 12.6826C13.4157 12.5418 13.2541 12.458 13.0817 12.458C12.9093 12.458 12.7477 12.5418 12.6482 12.6826L10.7374 15.3893C10.6078 15.5728 10.6078 15.8179 10.7374 16.0013L12.6482 18.7081C12.7477 18.8489 12.9093 18.9327 13.0817 18.9327C13.2541 18.9327 13.4157 18.8489 13.5152 18.7081L15.426 16.0013C15.5556 15.8179 15.5556 15.5727 15.426 15.3893L13.5152 12.6826ZM13.0817 17.4821L11.8204 15.6953L13.0817 13.9086L14.343 15.6953L13.0817 17.4821Z"
                    fill="#231F20"
                  />
                </svg>

                <TopThree
                  name={userList[0].name}
                  image={userList[0].image}
                  id={userList[0].id}
                  score={userList[0].score}
                  total={userList.length}
                  rank={1}
                />
              </div>
            </NavLink>
          )}
          {userList[2] && (
            <NavLink to={`/profile/${userList[2].id}`}>
              <div className="number3">
                <TopThree
                  name={userList[2].name}
                  image={userList[2].image}
                  id={userList[2].id}
                  score={userList[2].score}
                  total={userList.length}
                  rank={3}
                />
              </div>
            </NavLink>
          )}
        </div>

        <div className="custom-shape-divider-bottom-1730791905">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
      </div>

      <div className="total-rank">
        <div className="wrapper">
          {userList &&
            userList.map((user, index) => {
              if (index > 2) {
                return (
                  <NavLink to={`/profile/${user.id}`} key={index + 1}>
                    <RankCard
                      rank={index + 1}
                      total={userList.length}
                      name={user.name}
                      score={user.score}
                    />
                  </NavLink>
                );
              } else {
                return "";
              }
            })}
        </div>
      </div>
    </div>
  );
}

export default LeaderBoard;
