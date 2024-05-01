function playerInfo(){
  function init(){
    let playerArray = [];
    let button = document.querySelector('.beginGameSeries');

    button.addEventListener('click',() => {
        nameArray(playerArray);
        greeting(playerArray[0], playerArray[1]);
        let players = createPlayer(playerArray); /* includes player1, player2 to parse later */
        startGame(players);
    })  
    let changeNames = document.querySelector('.changeNames');
    changeNames.addEventListener('click', ()=>{
    playerNameDisplay(playerArray);
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
    scoreBoardPopulate(playerArray)
}
  function scoreBoardPopulate(playerArray){
    let player1H3 = document.querySelector('.player1Name');
    player1H3.textContent = playerArray[0] + ':';
    let player2H3 = document.querySelector('.player2Name');
    player2H3.textContent = playerArray[1] + ':';
    playerNameDisplay(playerArray);
   
  }
  function createPlayer(playerArray){
    let player1 = {name:playerArray[0], selector: 'X'};
    let player2 = {name:playerArray[1], selector:'O'};
    return{player1, player2};
  }
  function playerNameDisplay(playerArray){
    let namePopup = document.querySelector('.playerNameContainer')
    console.log(playerArray)
    if(playerArray.length !== 0){ /* disables removal of playerName popup in the case of non-entry */
      if (namePopup.style.display === 'none'){
        namePopup.style.display = 'flex'
       
      }
      else{
         namePopup.style.display = 'none';
      }
    }
    
    
  }
  function greeting(player1, player2){
    let welcome = document.querySelector('.welcome');
    let welcomeContainer = document.querySelector('.welcomeContainer>.header');
    welcome.textContent = `${player1}, and ${player2}.`
    welcomeContainer.style.display = 'block';
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
  
  // let playerTurn = document.querySelector('.playerTurn');
  // playerTurn.textContent = `${player[0](player.name)}'s turn!`

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
    outcomeDisplay(false) /* calls funct to set popup display to 'none' */

    
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
          eachCell.style.background = 'black' 
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
            let winningIndex =  winningIndexes[i];
            winningStyle(winningIndex);
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
    outcomeDisplay(true)
  }
  function outcomeDisplay(bool){
    let outcomePopup = document.querySelector('.outcomePopupContainer');
    if (bool === true){
      return outcomePopup.style.display = 'block';

    }
    outcomePopup.style.display = 'none';
    
    
  }
  function winningStyle(winningIndex){
    for(i of winningIndex){
      let winningCell = document.querySelector(`#cell${i}`);
      if(winningCell){
        winningCell.style.background = 'rgba(7, 187, 7, 0.692)';
      }
    }
  }
}
playerInfo();