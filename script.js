document.addEventListener('DOMContentLoaded', () => {

  // ----- document -----

  const my_card_area = document.querySelector('.my-card-area');
  const op_card_area = document.querySelector('.op-card-area');
  const my_card_value = document.querySelector('.my-card-value')
  const op_card_value = document.querySelector('.op-card-value');
  const stand_button = document.querySelector('.stand-button')
  const hit_button = document.querySelector('.hit-button')


  // ----- kurwa yebana -----

  let game_stage = 0 //-- 0=pre-hit (no cards), 1=cards-dealt (player hit/stand), 2=ai-turn, 3=game-end (reset)

  console.log(game_stage)

  // ----- bullshit -----

  const cards = {
    cardValues: {
      "2": 2,
      "3": 3,
      "4": 4,
      "5": 5,
      "6": 6,
      "7": 7,
      "8": 8,
      "9": 9,
      "10": 10,
      j: 11,
      q: 12,
      k: 13,
      a: 1
    },
    ranks: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k", "a"],
    suits: ["h", "d", "c", "s"]
  };

  const already_drawn_cards = [];
  const my_cards = [];
  const op_cards = [];

  // ----- funcstionsts -----

  function random_card() {
    while (true) {
      const rank = cards.ranks[Math.floor(Math.random() * cards.ranks.length)];
      const suit = cards.suits[Math.floor(Math.random() * cards.suits.length)];
      const value = cards.cardValues[rank];
      
      const card_id = rank + suit;

      const card = {
        "name": rank + suit,
        "value": value,
      };

      if (!already_drawn_cards.includes(card_id)) {
          already_drawn_cards.push(card_id);
          console.log(already_drawn_cards);
          return card;
      }
    };
  };

  function hit() {
    const card = random_card();

    document.querySelector('.my-cards').style.visibility = 'visible';
    document.querySelector('.op-cards').style.visibility = 'visible';

    if (game_stage === 1) {
      const card2 = random_card();
      const card3 = random_card();

      my_cards.push(card, card2);
      console.log(my_cards, " -- minu kaardid on sellised")

      op_cards.push(card3)
      console.log(op_cards, " -- vastase kaardid on vot sellised")

    } else if (game_stage === 2) {
      my_cards.push(card);
    } else if(game_stage === 3) {
      op_cards.push(card);
    }

    const my_value = count_card_value(my_cards)
    const op_value = count_card_value(op_cards)

    my_card_area.innerHTML = my_cards
      .map(card => `<playing-card cid="${card.name}"></playing-card>`)
      .join('')

    op_card_area.innerHTML = op_cards
      .map(card => `<playing-card cid="${card.name}"></playing-card>`)
      .join('')

    if (game_stage === 1 || game_stage === 2) {
      stand_button.disabled = my_value < op_value;
    }

    my_card_value.textContent = count_card_value(my_cards);
    op_card_value.textContent = count_card_value(op_cards)
  };

  function restart_game() {

    hit_button.disabled = true;
    stand_button.disabled = true;

    setTimeout(() => {
      document.querySelector('.my-cards').style.visibility = 'hidden';
      document.querySelector('.op-cards').style.visibility = 'hidden';

      console.log('restart game'); // to do something with it!

      my_cards.length = 0;
      op_cards.length = 0;
      already_drawn_cards.length = 0;

      hit_button.disabled = false;
      stand_button.disabled = false;

      game_stage = 0;

      console.log(my_cards);
    }, 1500);
  }

  function count_card_value(hand) {
    let value = 0;

    for (const card of hand) {
      value += card.value;
    }

    return value;
  }

  // ----- e -----

  document.addEventListener('click', async (e) => {

    if (e.target.closest('.hit-button')) {

      if (game_stage === 0) {
        game_stage = 1;

        hit();
        let value = count_card_value(my_cards);

        console.log(my_cards);
        console.log("HHHHHHHHHHHHHHHHH");
        console.log(op_cards);

        console.log("väärtus on mul vorstiviilud: ", value);

        if (value > 21) {
          console.log('you lost');
          restart_game();
        } else if (value === 21) {
          console.log('you won');
          restart_game();
        } else {
          game_stage = 2;
        }

      } else if (game_stage === 2) { // kuna võimatu on näha siis siin algab after esimest drawi

        hit();
        let value = count_card_value(my_cards);

        console.log(my_cards);
        console.log("HHHHHHHHHHHHHHHHH");
        console.log(op_cards);

        console.log("väärtus on mul vorstiviilud: ", value);

        if (value > 21) {
          console.log('you lost');
          restart_game();
        } else if (value === 21) {
          console.log('you won');
          restart_game();
        }
      } else if (game_stage === 3) {
        hit_button.disabled = true
        stand_button.disabled = true
      }
      
    }

    if (e.target.closest('.stand-button')) {

      stand_button.disabled = true;
      hit_button.disabled = true

      if (game_stage === 2) {

        let my_value = count_card_value(my_cards);
        let op_value = count_card_value(op_cards);
        game_stage = 3;

        while (op_value < 21) {

          await new Promise(resolve => setTimeout(resolve, 1000));

          hit();
          op_value = count_card_value(op_cards);

          console.log(my_cards);
          console.log("HHHHHHHHHHHHHHHHH");
          console.log(op_cards);
          console.log("väärtus on tal vorstiviilud: ", op_value);

          if (op_value > 21) {
            console.log('you win cuz ai >21');
            restart_game();
            break;
          } else if (op_value === 21 || op_value > my_value) {
            console.log('you lost');
            restart_game();
            break;
          }
        }
      }
    }
  });
});