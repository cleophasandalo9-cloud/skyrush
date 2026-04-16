//1. Get elements from HTML
const splash = document.getElementById('splash');
const game = document.getElementById('game');
const multiplierText = document.getElementById('multiplier');
const balanceText = document.getElementById('balance');
const betInput = document.getElementById('betAmount');
const betBtn = document.getElementById('betBtn');
const cashOutBtn = document.getElementById('cashOutBtn');
const betMessage = document.getElementById('betMessage');
const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');

//2. Game variables
let multiplier = 1.00;
let speed = 0.01; //how fast it increases/multiplies
let crashPoint = 0;
let balance = 1000;
let currentBet = 0;
let hasBet = false;
let x = 0;
let y = canvas.height;

//3. Function: Generate random crashpoint
function generateCrashPoint() {
  //random number between 1.5x and 10x
  return (Math.random() * 8.5 + 1.5);
}

function drawGraph() {
  //move right
  x += 3;

  //curve going up
  y = canvas.height - (multiplier * 5);

  //draw line
  ctx.lineTo(x, y);
  ctx.strokeStyle = 'rgb(255, 59, 59)';
  ctx.lineWidth = 0.5;
  ctx.stroke();
}
//4. Function: Start game loop
function startGame() {
  //reset graph
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();

  x = 0;
  y = canvas.height;

  ctx.moveTo(x, y);


  multiplier = 1.00;
  crashPoint = generateCrashPoint();

  const interval = setInterval(() => {
    multiplier += speed;

    drawGraph();

    //update display
    multiplierText.textContent = multiplier.toFixed(2) + 'x';

    //check crash
    if (multiplier >= crashPoint) {
      clearInterval(interval);

      //show crash
      multiplierText.textContent = '🎇 Crashed at' + multiplier.toFixed(2) + 'x';

      //NEW: lose bet if not cashed out
      if (hasBet) {
        hasBet = false;
        currentBet = 0;
      }

      //restart after 2 seconds
      setTimeout(startGame, 2000);
    }
  }, 100); //runs every 100ms
}

//5. Splash screen logic
setTimeout(() => {
  splash.style.display = 'none'; //hide splash
  game.style.display = 'block'; //showgame

  startGame(); //autostart game
}, 2000); //2 seconds


/*/adding event listner to the bet button
betBtn.addEventListener('click', () => {
  const betValue = parseFloat(betInput.value);

  if (betValue > 0 && betValue <= balance && !hasBet) {
    currentBet = betValue;
    balance -= betValue;
    hasBet = true;

    balanceText.textContent = balance.toFixed(2);
  }
});
*/

function showError(message) {
  betMessage.textContent = message;
  betInput.classList.add('input-error');
}

function clearError() {
  betMessage.textContent = '';
  betInput.classList.remove('input-error');
}
//--------------------------
//NEW: bet button updated
//--------------------------
betBtn.addEventListener('click', () => {
  const betValue = parseFloat(betInput.value);

  //clear old error first
  clearError();

  //check if input is empty or invalid
  if (!betInput.value || isNaN(betValue)) {
    showError('Please enter a bet amount first!');
    return;
  }

  if (betValue <= 5) {
    showError('Bet must be greater than 5!');
    return;
  }

  if (betValue > balance) {
    showError('Insufficient balance!');
    return;
  }

  if (hasBet) {
    showError('You already placed a bet!');
    return;
  }

  //valid bet
  currentBet = betValue;
  balance -= betValue;
  hasBet = true;

  balanceText.textContent = balance.toFixed(2);

  clearError(); //remove error if everything is fine
});

betInput.addEventListener('input', () => {
  clearError
});

//adding event listener to cashout button i.e cashout logic
cashOutBtn.addEventListener('click', () => {
  if (hasBet) {
    let winnings = currentBet * multiplier;

    balance += winnings;

    balanceText.textContent = balance.toFixed(2);

    hasBet = false;
    currentBet = 0;
  }
});