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
        array.splice(0,0,name1,name2)
        console.log(array)

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
    
    
    grid.addEventListener('click',(event) => {
        let target = event.target;
        switch(target.className){
            case 'cell':
                let cell = target;
                console.log(playerTurn(cell,players,count)); 
                
                /* passes through playerTurn() to determine character entry for cell*/
        }
    });
    
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
        let cellIndex = cell.id; /* id's are given index position for ref */

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
            cell.textContent = [array[cellIndex]].join(', ');
        }

        function playerSelectIndex(cellIndex, player){
            
            if(player.selector === 'X'){
                player1Index.push(parseInt(cellIndex));
                determineWinner(player1Index);

            }
            else{
                player2Index.push(parseInt(cellIndex));
                determineWinner(player2Index);
            }
            
        }
        function determineWinner(playerIndex){
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
            
            let winner = false
            for(i in winningIndexes){
                winner = winningIndexes[i].every(element => playerIndex.includes(element));
                if(winner){
                    if(array[winningIndexes[i][0]] === 'X'){
                        console.log('player 1 wins');
                        endOfGame()
                        
                    }
                    if(array[winningIndexes[i][0]] === 'O'){
                        console.log('player 2 wins');
                        
                    }
                   
                }
            }
            return winner
        }
    }
    function endOfGame(){
        // return grid.disabled = true;
    }
    
}




playerInfo();