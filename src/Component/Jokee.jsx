import React, { useEffect, useState } from "react";
import css from "./joke-main.module.scss";
import logo from "../assert/logo.png";
import ava from "../assert/ava.jpeg";
import jokes from "../data/jokes";
import Cookies from "js-cookie";

function Jokee() {
  const [joke, setJoke] = useState(-1);
  const [voted_joke, setVotedJoke] = useState([]);
  const [like, setLike] = useState(true);
  const [done, setDone] = useState(false);

  const selectRandomIndex = () => {
    //select random joke index, except voted joke
    let rand_index = -1;
    do {
      rand_index = Math.floor(Math.random() * 4);
    } while (voted_joke.includes(rand_index));
    return rand_index;
  };

  const selectNextStory = () => {
    if (voted_joke.length === 4) {
      //no more new joke
      setDone(true);
    } else {
      //select next joke
      let rand_index = selectRandomIndex();
      setJoke(rand_index);
    }
  };

  const likeJoke = (like) => {
    setLike(like);
    //get old cookie
    let cookie = JSON.parse(Cookies.get("voted_joke"));
    cookie[joke] = like;

    Cookies.set("voted_joke", JSON.stringify(cookie));
    selectNextStory();
  };

  useEffect(() => {
    if (Cookies.get("voted_joke")) {
      //get cookie
      let vote_stored = Object.keys(JSON.parse(Cookies.get("voted_joke")));
      vote_stored = vote_stored.map((vote) => parseInt(vote));
      //set voted jokes
      setVotedJoke(vote_stored);
    }
    if (voted_joke.length !== jokes.length) {
      selectNextStory();
    }
  }, []);

  useEffect(() => {
    if ((!voted_joke || !voted_joke.includes(joke)) && joke >= 0) {
      //if joke unread
      setVotedJoke([...voted_joke, joke]);

      if (voted_joke.length <= jokes.length) {
        //if still have  unread joke
        let cookie = {};
        if (Cookies.get("voted_joke")) {
          //get old cookie
          cookie = JSON.parse(Cookies.get("voted_joke"));
        }
        cookie[joke] = like;
        Cookies.set("voted_joke", JSON.stringify(cookie));
      }
    }
  }, [joke, voted_joke]);

  return (
    <div className={css["jokee-wrapper"]}>
      <div className={css["header"]}>
        <img className={css["image"]} src={logo} alt="" />
        <div className={css["user-info"]}>
          <div>
            <div style={{ fontSize: 12, fontStyle: "italic" }}>
              Handicrafted by
            </div>
            <div style={{ fontSize: 12, fontWeight: "700" }}>Jim HLS</div>
          </div>
          <img className={`${css.image} ${css.ava}`} src={ava} alt="" />
        </div>
      </div>
      <div className={css["title"]}>
        <h2>A jokes a day can keeps the doctor away</h2>
        <div>If you joke wrong way, your teetch have to pay. (Serious)</div>
      </div>
      <div className={css["content"]}>
        <div>
          {done
            ? "That's all the jokes for today! Come back another day!"
            : joke >= 0
            ? jokes[joke]
            : ""}
        </div>
        <hr></hr>
      </div>
      <div className={css["choose-button"]}>
        <button
          style={{ backgroundColor: "#2c7edb" }}
          onClick={() => {
            likeJoke(true);
          }}
        >
          This is Funny!
        </button>
        <button
          style={{ backgroundColor: "#29b363" }}
          onClick={() => {
            likeJoke(false);
          }}
        >
          This is not funny.
        </button>
      </div>
      <hr></hr>
      <div className={css["footer"]}>
        <div>
          This website is created as part of Hlsolutions program. The materials
          contained on this website are provided for general information only
          and do not constitute any form of advice. HLS assumes no
          responsibility for the accuracy of any particular statement and
          accepts no liability for any loss or damage which may arise from
          reliance on the information contained on this site.
        </div>
        <div style={{ fontWeight: 500 }}>Copyright 2021 HLS</div>
      </div>
    </div>
  );
}

export default Jokee;
