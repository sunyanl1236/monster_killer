const ATTACK_VALUE = 5;
const STRONG_ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 12;
const HEAL_VALUE = 10;
const MODE_ATTACK = 'ATTACK'; //MODE_ATTACK = 0
const MODE_STRONG_ATTACK = 'STRONG_ATTACK'; //MODE_STRONG_ATTACK = 1

const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';


function getMaxLifeValues(){
    const enteredValue = prompt('Maximum life for you and the monster.', '100'); //return a string
    let parsedValue = parseInt(enteredValue); //if not a number parseInt() will return a NaN(not a number)
    if (isNaN(parsedValue) || parsedValue <= 0) {//isNaN() check if not a num
        throw {message: 'Invalid user input, not a number'}; //can throw string or number or objects
    }
    return parsedValue;
}

try{
    let chosenMaxLife = getMaxLifeValues();
}catch(error) {
    console.log(error);
    chosenMaxLife = 100;
    alert('You entered something wrong, default value of 100 was used.');
} //can have finally here

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;
let battleLog = [];





adjustHealthBars(chosenMaxLife); //set all bar to chosenMaxLife

function reset(){
    currentPlayerHealth = chosenMaxLife;
    currentMonsterHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function writeLog(event, value, monsterHealth, playerHealth){
    let logEntry = {
        event: event,
        value: value,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
    };

    switch(event){ //switch takes a variable or an expression that yields a value
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry.target = 'PLAYER';
            break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry.target = 'PLAYER';
            break;
        case LOG_EVENT_GAME_OVER:
            break;
        default:
            logEntry = {}; //empty object
    }
    battleLog.push(logEntry);
}

function endRound(){
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentMonsterHealth, currentPlayerHealth);

    if (currentPlayerHealth <= 0 && hasBonusLife){
        hasBonusLife = false;
        removeBonusLife(); //change the UI
        currentPlayerHealth = initialPlayerHealth; //reset to the value before damage
        setPlayerHealth(initialPlayerHealth); //change the UI
        alert("You would be dead but the bonus life saved you!");
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert('You won!');
        writeLog(LOG_EVENT_GAME_OVER, 'PLAYER WON', currentMonsterHealth, currentPlayerHealth);
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert('You lost!');
        writeLog(LOG_EVENT_GAME_OVER, 'MONSTER WON', currentMonsterHealth, currentPlayerHealth);
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
        alert('You have a draw!');
        writeLog(LOG_EVENT_GAME_OVER, 'A DRAW', currentMonsterHealth, currentPlayerHealth);
    }
    
    if (currentMonsterHealth <= 0 || currentPlayerHealth<=0){
        reset();
    }
}

function attackMonster(mode){
    const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE; //tenary 
    const logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;

    const damage = dealMonsterDamage(maxDamage); //generate random number from 0 to maxDamage
    currentMonsterHealth -= damage;
    writeLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
    endRound();
}

function healPlayerHandler(){
    let healValue;
    if(currentPlayerHealth >= chosenMaxLife - healValue){
        alert('You can\'t heal to more than your max intial health.');
        healValue = chosenMaxLife - currentPlayerHealth;
    } else {
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue); 
    currentPlayerHealth += healValue; 
    endRound(); //monster still can attack
}

function attackHandler(){
    attackMonster('ATTACK');
}

function strongAttackHandler() {
    attackMonster('STRONG_ATTACK');
}

function printLogHandler(){
    // for(let i=0; i<battleLog.length; i++){
    //     console.log(battleLog[i]);
    // }
    // //same as above
    // for (const logEntry of battleLog){
    //     console.log(logEntry);
    // }
    let i=0;
    for(const logEntry of battleLog){
        console.log(`#${i}`);
        for(const key in logEntry){
            console.log(`${key} = ${logEntry[key]}`); //cannot use logEntry.key here, JS will find the property named 'key'
        }
        i++;
    }
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);