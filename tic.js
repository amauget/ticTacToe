function playerInfo(){
    function init(){
        let array = [];
        let button = document.querySelector('button');

        button.addEventListener('click',() => {
            nameArray(array);
            /* Need to disable this event when a winner is determined. */
            let players = createPlayer(array); /* includes player1, player2 to parse later */
            
            startGame(players);
        })  
    }
   
    function nameArray(array){
        let name1 = document.querySelector('#player1').value;
        let name2 = document.querySelector('#player2').value;
        if(name1 === ''){
            name1 = 'Player 1';
        }
        if(name2 === ''){
            name2 = 'Player 2';
        }
        array.splice(0,0,name1,name2)
        scoreBoardPopulate(name1, name2)
    }
    function scoreBoardPopulate(name1, name2){
        let player1H3 = document.querySelector('.player1Name');
        player1H3.textContent = name1 + ':';
        let player2H3 = document.querySelector('.player2Name');
        player2H3.textContent = name2 + ':';
    }
    function createPlayer(array){
        let player1 = {name:array[0], selector: 'X'};
        let player2 = {name:array[1], selector:'O'};
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
        resetGame(grid, clickHandler);
    })

    let resetScore = document.querySelector('.resetScore');

    resetScore.addEventListener('click', () => {
        let player = 'reset';
        playerScore = scoreKeeping(player, playerScore); /* updates playerScore w/ return value of scoreKeeping */
    })
    function resetGame(grid, clickHandler){
        grid.addEventListener('click', clickHandler);

        let outcome = document.querySelector('.outcome');
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
        console.log(cellIndex)
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
            
            let winner = true;
            for(i in winningIndexes){
                winner = winningIndexes[i].every(element => playerIndex.includes(element));
                if(winner){
                    endOfGame(grid, clickHandler, player)
                    scoreKeeping(player, playerScore);
                    
                }
            }
            let fullBoard = array.filter((item)=> {
                            return item !== undefined
                            }) /* filters out any undefined indexes because that's their default value */
            if(fullBoard.length === array.length){
                player = null 
                endOfGame(grid, clickHandler, player);
            }
           
            return winner
        }
    }
   
    function endOfGame(grid, clickHandler, player){
        let outcome = document.querySelector('.outcome');
        if(player === null){
            outcome.textContent = "Cat's Game!"
        }
        else{            
            outcome.textContent = `${player.name} wins!`;
            grid.removeEventListener('click', clickHandler);
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
       console.log(playerScore)
       player1Score.textContent = playerScore[0];
       player2Score.textContent = playerScore[1];
       return playerScore;
    }
}




playerInfo();