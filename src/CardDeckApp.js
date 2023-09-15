import React, { useState, useEffect } from 'react';
import axios from 'axios';


const CardDeckApp = () => {
  const [deckId, setDeckId] = useState(null);
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [intervalId, setIntervalId] = useState(null); // Added intervalId state

  // Function to create a new deck of cards
  const createDeck = async () => {
    try {
      const response = await axios.get(
        'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
      );
      setDeckId(response.data.deck_id);
    } catch (err) {
      setError('Error creating a new deck.');
    }
  };

  // Function to draw a card from the deck
  const drawCard = async () => {
    if (!deckId) {
      setError('Error: No deck created yet.');
      return;
    }

    try {
      const response = await axios.get(
        `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
      );
      if (response.data.cards.length === 0) {
        setError('Error: No cards remaining!');
      } else {
        const newCard = response.data.cards[0];
        setCards([...cards, newCard]);
      }
    } catch (err) {
      setError('Error drawing a card.');
    }
  };

  // Function to start or stop drawing cards
  const toggleDrawing = () => {
    if (drawing) {
      clearInterval(intervalId); // Clear the interval using intervalId
    } else {
      const id = setInterval(drawCard, 1000);
      setIntervalId(id); // Set intervalId when starting
    }
    setDrawing(!drawing);
  };

  useEffect(() => {
    createDeck();
  }, []);

  return (
    <div>
      <h1>Card Deck App</h1>
      <button onClick={toggleDrawing}>
        {drawing ? 'Stop Drawing' : 'Start Drawing'}
      </button>
      <div>
        {error && <p>{error}</p>}
        {cards.map((card, index) => (
          <img
            key={index}
            src={card.image}
            alt={`${card.value} of ${card.suit}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CardDeckApp;
