import { useState, useEffect } from "react";
import _ from "lodash";

function App() {
  const [deckid, setDeckid] = useState("");
  const [cards, setCards] = useState([]);
  const [clickedCards, setClickedCards] = useState([]);
  // Card available for this level of game
  const [boardCards, setBoardCards] = useState([]);
  // boardSize state is not required, can be found from boardCards length
  const [boardSize, setBoardSize] = useState(0);
  const [nPlay, setNPlay] = useState(false);
  const [playMode, setPlayMode] = useState("home");
  const [score, setScore] = useState(0);
  const [hScore, setHScore] = useState(0);
  const [nClick, setnClick] = useState(false);
  const [difficulty, setDifficulty] = useState("");

  // Define the API endpoint URL
  const apiUrl = "https://www.deckofcardsapi.com/api/deck/new/shuffle/";

  // List of cards to draw
  const cardsToDraw = ["AS", "AC", "AD", "AH", "KS", "KD", "KC", "KH", "JS", "JD", "JC", "JH", "QS", "QD", "QC", "QH"];

  useEffect(() => {
    const fetchData = async () => {
      const url = `${apiUrl}?cards=${cardsToDraw.join()}`;
      const response = await fetch(url);
      const data = await response.json();

      setDeckid(data.deck_id);
    };
    fetchData();
  }, [nPlay]);

  async function getCardsFromApi(count) {
    try {
      setScore(0);

      // Perform the fetch request
      const response = await fetch(`https://www.deckofcardsapi.com/api/deck/${deckid}/draw/?count=${count}`);

      // Parse the JSON response
      const data = await response.json();

      // Handle the drawn cards
      // setDeckid(data.deck_id);
      setCards(data.cards);
      if (count == 6) {
        setBoardCards(_.sampleSize(data.cards, 4));
        setBoardSize(4);
      } else if (count == 10) {
        setBoardCards(_.sampleSize(data.cards, 6));
        setBoardSize(6);
      } else if (count == 16) {
        setBoardCards(_.sampleSize(data.cards, 8));
        setBoardSize(8);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function handleBoardCards(e) {
    // console.log(e)
    if (cards.length == 1) {
      // It means there will be no more available cards after this click
      setPlayMode("gOver");
      document.getElementById("result").innerHTML = "You Won!";

      // Reset all state except hScore
      setCards([]);
      setClickedCards([]);
      setBoardCards([]);
      setBoardSize(0);
    } else if (clickedCards.length + 1 == 1) {
      // If clickedCards is 1
      let mCards = _.without(cards, e);
      let rem = _.sampleSize(mCards, boardSize - 1);
      setBoardCards(_.shuffle([e, ...rem]));
    } else if (clickedCards.length + 1 == 2) {
      // If clickedCards is 2
      let mCards = _.without(cards, e);
      let rem = _.sampleSize(mCards, boardSize - 2);
      setBoardCards(_.shuffle([...clickedCards, e, ...rem]));
    } else if (cards.length - 1 == 3) {
      // If unclickedCards is 2

      let mCards = _.without(cards, e);
      let rem = _.sampleSize(clickedCards, boardSize - 3);

      setBoardCards(_.shuffle([...mCards, ...rem]));
    } else if (cards.length - 1 == 2) {
      // If unclickedCards is 2

      let mCards = _.without(cards, e);
      let rem = _.sampleSize(clickedCards, boardSize - 2);

      setBoardCards(_.shuffle([...mCards, ...rem]));
    } else if (cards.length - 1 == 1) {
      // If unclickedCards is 1
      let mCards = _.without(cards, e);
      let rem = _.sampleSize(clickedCards, boardSize - 1);

      setBoardCards(_.shuffle([...mCards, ...rem]));
    } else if (clickedCards.length + 1 > 2 && clickedCards.length + 1 < boardSize) {
      //
      let mCards = _.without(cards, e);
      let rem = _.sampleSize(mCards, boardSize - clickedCards.length);

      setBoardCards(_.shuffle([...clickedCards, ...rem]));
    } else {
      let mCards = _.without(cards, e);

      let fst = _.sampleSize(clickedCards, boardSize / 2);
      let rem = _.sampleSize(mCards, boardSize / 2);

      setBoardCards(_.shuffle([...fst, ...rem]));

      console.log("condition 6 worked");
    }
  }
  // Call the function to draw the cards
  // drawCards();

  function handleCardClick(e) {
    // Check if clicked for twice
    if (clickedCards.includes(e)) {
      // If yes then End game otherwise continue
      setPlayMode("gOver");
      document.getElementById("result").innerHTML = "You Loose!";

      // Reset all state except hScore
      setCards([]);
      setClickedCards([]);
      setBoardCards([]);
      setBoardSize(0);
    } else {
      // push to clickedCards
      setClickedCards([...clickedCards, e]);

      // Remove clicked cards from cards
      setCards((prev) => _.without(prev, e));

      // Increase Score
      setScore((prev) => (prev += 1));
      // Increase highest score
      if (score + 1 > hScore) {
        setHScore((prev) => (prev += 1));
      }

      // Create new boardCards
      handleBoardCards(e);
      // Show boardCards to board

      // If no available cards. then game end. Player is winner

      // Reset all state except hScore
    }
  }

  function playAgain() {
    setScore(0);
    setPlayMode("gOn");
    setNPlay(!nPlay);
    if (difficulty == "easy") {
      getCardsFromApi(6);
      setDifficulty("easy");
      setScore(0);
    } else if (difficulty == "medium") {
      getCardsFromApi(10);
      setDifficulty("medium");
      setScore(0);
    } else if (difficulty == "hard") {
      getCardsFromApi(16);
      setDifficulty("hard");
      setScore(0);
    }
  }

  function goHome() {
    setPlayMode("home");
  }
  return (
    <>
      <header className={playMode}>
        <div className="top">
          <div className="title-area">
            <h1 className="title">Memorize Card Game</h1>
            <p>Earn points by clicking each card for once. If you click single card twice then game over!</p>
          </div>
          <div className="score" style={{ display: playMode == "gOn" && "flex" }}>
            <span>Score: {score}</span>
            <span>Highest Score: {hScore}</span>
          </div>
        </div>

        <nav style={{ display: playMode == "home" && "flex" }}>
          <h2 className="nav-title">Game Mode: </h2>
          <button
            className="btn btn-primary"
            onClick={(e) => {
              getCardsFromApi(6);
              setNPlay(!nPlay);
              setPlayMode("gOn");
              setDifficulty("easy");
              setScore(0);
            }}
          >
            Easy
          </button>
          <button
            className="btn btn-primary"
            onClick={(e) => {
              getCardsFromApi(10);
              setNPlay(!nPlay);
              setPlayMode("gOn");
              setDifficulty("medium");
              setScore(0);
            }}
          >
            Medium
          </button>
          <button
            className="btn btn-primary"
            onClick={(e) => {
              getCardsFromApi(16);
              setNPlay(!nPlay);
              setPlayMode("gOn");
              setDifficulty("hard");
              setScore(0);
            }}
          >
            Hard
          </button>
        </nav>
        <div className="over" style={{ display: playMode == "gOver" && "flex" }}>
          <h3 className="over-title" id="result">
            Game Over!
          </h3>
          <div className="score">
            <span>This Round Score: {score}</span>
            <span>Highest Score: {hScore}</span>
          </div>
          <div className="over-control">
            <button className="btn btn-primary" onClick={playAgain}>
              Play Again
            </button>
            <button className="btn btn-primary" onClick={goHome}>
              Go Home
            </button>
          </div>
        </div>
      </header>
      <section className={`board ${playMode} ${difficulty}`}>
        <ul className="items">
          {boardCards.map((e) => {
            return (
              <li
                onClick={(event) => {
                  setnClick(!nClick);
                  handleCardClick(e);
                }}
                key={e.code}
                value={e.code}
              >
                <img src={e.image} alt={e.code} />
              </li>
            );
          })}
        </ul>
      </section>
      <a href="https://github.com/syedshaon/Memory-Card" target="_blank" title="GitHub Repo Link" className="git-hub">
        GitHub Repo Link
      </a>
    </>
  );
}

export default App;
