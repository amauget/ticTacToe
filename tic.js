function playerInfo(){
  function init(){
    let playerArray = [];
    let button = document.querySelector('.startGame');

    button.addEventListener('click',() => {
        nameArray(playerArray);
        /* Need to disable this event when a winner is determined. */
        let players = createPlayer(playerArray); /* includes player1, player2 to parse later */
        scoreBoardPopulate(playerArray)
        startGame(players);
    })  
  }

  function nameArray(playerArray){
    let name1 = document.querySelector('#player1').value;
    let name2 = document.querySelector('#player2').value;
    if(name1 === ''){
        name1 = 'Player 1';
    }
    if(name2 === ''){
        name2 = 'Player 2';
    }
    playerArray.splice(0,0,name1,name2)
    
}
  function scoreBoardPopulate(playerArray){
    let player1H3 = document.querySelector('.player1Name');
    player1H3.textContent = playerArray[0] + ':';
    let player2H3 = document.querySelector('.player2Name');
    player2H3.textContent = playerArray[1] + ':';
  }
  function createPlayer(playerArray){
    let player1 = {name:playerArray[0], selector: 'X'};
    let player2 = {name:playerArray[1], selector:'O'};
    return{player1, player2};
  }

  init();
  }

function startGame(players){
  let array = new Array(9).fill(undefined);
  let grid = document.querySelector('.grid');
  grid.disabled = false;
  
  let player1Index = [], player2Index = [];
  let count = 1;
  let playerScore = [0,0];
  

  let outcome = document.querySelector('.outcome');
  resetGame();
  scoreKeeping('reset');
// functions called to wipe game data if names change.    
  
  const clickHandler = (event) => {
    let target = event.target;
    switch(target.className){
        case 'cell':
            let cell = target;
            playerTurn(cell,players,count); 
            /* passes through playerTurn() to determine character entry for cell*/
    }
  }
  grid.addEventListener('click', clickHandler);

  let resetBoard = document.querySelector('.resetBoard');
  
  resetBoard.addEventListener('click', ()=>{
    resetGame();
    grid.addEventListener('click', clickHandler);
  })

  let resetScore = document.querySelector('.resetScore');
  resetScore.addEventListener('click', () => {
    playerScore = scoreKeeping('reset', playerScore); /* updates playerScore w/ return value of scoreKeeping */
  })

  function resetGame(){
    outcome.textContent = '';
    array = new Array(9).fill(undefined);
    player1Index = [], player2Index = [];
    count = 1;
    for (i = 0; i < 9; i++){
      let cellId = '#cell' + i;
      let eachCell = document.querySelector(cellId);
      if(eachCell){
          eachCell.textContent = '';
      }
    }
  }
  function playerTurn(cell,players, count){
    let {player1, player2} = players;
    if(count % 2 === 1){
        return gameTracking(cell,player1)
    }
    else{
        return gameTracking(cell, player2)
    }
  }
  function gameTracking(cell,player){ 
    let cellIndex = cell.id[4]; /* id's are given index position for ref */
    if(array[cellIndex] === undefined){ 
      arrayAppend(cellIndex, player.selector);
      DOMGame(cell, cellIndex);
      let winner = playerSelectIndex(cellIndex,player)
      if (winner === true){
      }
      // determineWinner(playerIndex);
      count++; /* only changes turns for valid entries */
      return count;
    }
      function arrayAppend(cellIndex,character){
        array.splice(cellIndex,1,character); /* find origin of character and change to selector to match obj */
        return array;
      }
      function DOMGame(cell,cellIndex){
        return cell.textContent = [array[cellIndex]].join(', ');
      }
      function playerSelectIndex(cellIndex, player){
        let playerIndex = undefined;
        if(player.selector === 'X'){
          player1Index.push(parseInt(cellIndex));
          playerIndex = player1Index;
        }
        else{
          player2Index.push(parseInt(cellIndex));
          playerIndex = player2Index;
        }
        determineWinner(playerIndex, player);
      }
      function determineWinner(playerIndex, player){
        let winningIndexes = [
        [0,1,2],
        [0,3,6],
        [0,4,8],
        [1,4,7],
        [2,5,8],
        [2,4,6],
        [3,4,5],
        [6,7,8],
        ]          
        let winner = false;
        
        for(i in winningIndexes){
          winner = winningIndexes[i].every(element => playerIndex.includes(element));
          if(winner){
              console.log(winner)
              endOfGame(grid, clickHandler, player)
              scoreKeeping(player, playerScore); 
              return winner;
          }
        }
        let fullBoard = 
          array.filter((item)=> {
            return item !== undefined
          }) /* filters out any undefined indexes because that's their default value */

        if(fullBoard.length === array.length && winner === false){
          endOfGame(grid, clickHandler, false);
          // player set to false to indicate a lack of winners, otherwise used to identify winner.
        }
        return winner
    }
  }
  function scoreKeeping(player, playerScore){
    let player1Score = document.querySelector('.player1Score');
    let player2Score = document.querySelector('.player2Score');

    if(player === 'reset'){
      playerScore = [0,0];
    }
    if(player.selector === 'X'){
    playerScore[0] += 1;
      
    } 
    else if(player.selector === 'O'){
    playerScore[1] += 1;
    }
    player1Score.textContent = playerScore[0];
    player2Score.textContent = playerScore[1];
    return playerScore;
  }

  function endOfGame(grid, clickHandler, player){
    if(player === false){
      outcome.textContent = "Cat's Game!"
      /* defined before resetGame() "p" html element */
    }
    else{            
      outcome.textContent = `${player.name} wins!`;
      grid.removeEventListener('click', clickHandler);
    }
  }
    
}
playerInfo();