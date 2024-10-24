'use strict';

/////////////////////////////////////////////////
// *   >>>>>>>>>> BANK APP <<<<<<<<<<<<   // 
/////////////////////////////////////////////////

// ! ->>>>>>>>>>>>> Accounts <<<<<<<<- // 
const account1 = {
  owner:"Hossam Gamal",
  movements: [200, 455, -306.5, 250, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2021-11-18T21:31:17.178Z",
    "2022-12-23T07:42:02.383Z",
    "2022-01-28T09:15:04.904Z",
    "2023-04-01T10:17:24.185Z",
    "2024-05-20T14:11:59.604Z",
    "2024-10-21T17:01:17.194Z",
    "2024-10-22T23:36:17.929Z",
    "2024-10-23T10:51:36.790Z",
  ],
  currency: "EGP",
  locale: "ar-EG", // de-DE
};

const account2 = {
  owner: "Mohamed Gamal",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2024-05-20T14:11:59.604Z",
    "2024-10-21T17:01:17.194Z",
    "2024-10-22T23:36:17.929Z",
    "2024-10-23T10:51:36.790Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

// ! ->>>>>>>>>>> Elements <<<<<<<<<- //
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////

/////////////////////////////////////////////////

// ! Format Movements Date
const formatMovementDate = function(date,locale){
  const calcDayPassed = (day1 , day2) => 
    Math.round(Math.abs((day1 - day2)/(1000 * 60 * 60 * 24)));

  
  const daysPassed = calcDayPassed(new Date() ,date);

  if(daysPassed === 0) return 'Today';
  if(daysPassed === 1) return 'Yesterday';
  if(daysPassed <= 7) return `${daysPassed} day ago`;
  else{
    // const day = `${date.getDate()}`.padStart(2, '0'); // Correctly use getDate() for day of the month
    // const month = `${date.getMonth() + 1}`.padStart(2, '0'); // getMonth() is zero-based
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }

}

// ! Display Current balance
const displayMovements = function(acc, sort = false) {
  containerMovements.innerHTML = '';

  // Create a sorted copy of movements if sort is true, else use original array
  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function(mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // * Get currency 
    const formattedMov = formatCurrency(mov ,acc.locale ,acc.currency);
    
    // * Get the corresponding date from movementsDates
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date);
    
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}"> ${i + 1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// ! ADD username to each account 
const createUsername = function(accs){
  accs.forEach(function(acc){
    acc.username = acc.owner.toLocaleLowerCase()
    .split(' ')
    .map(word => word[0])
    .join('');
  })
}
createUsername(accounts);

// ! Calculate Balance of account
const calcDisplayBalance = function(acc){
  acc.balance = acc.movements.reduce((acc,cur) =>acc + cur , 0).toFixed(2);
  labelBalance.textContent = formatCurrency(acc.balance,acc.locale,acc.currency);
};

// ! Calculate income and outcome in summary of account
const calcDisplaySummary = function(account){
  // * calc income
  const incomes = account.movements
  .filter(mov => mov > 0)
  .reduce((cur,mov)=> cur + mov , 0).toFixed(2);
  labelSumIn.textContent = formatCurrency(incomes,account.locale,account.currency);
  // * calc outcome
  const outcome = account.movements
  .filter(mov => mov < 0)
  .reduce((cur,mov)=> cur + mov , 0).toFixed(2);

  labelSumOut.textContent = formatCurrency(Math.abs(outcome),account.locale,account.currency);;

  // * calc interset
  const interset = account.movements
  .filter(mov => mov > 0)
  .map(deposit => deposit * account.interestRate / 100)
  // delete value less than or equal 1
  .filter(int=> {return int >= 1;}) 
  .reduce((cur , mov) => cur+mov,0).toFixed(2);

  labelSumInterest.textContent = formatCurrency(interset,account.locale,account.currency);;
}

/////////////////////////////////////////////////////////
// * -----> Helper Function <------ // 

// ! Update information of account
const updateUI = function(account){
  displayMovements(account);
  calcDisplaySummary(account);
  calcDisplayBalance(account);
}

// ! Get Currency
const formatCurrency = function(value ,locale ,currency){
  return new Intl.NumberFormat(locale,
    {style : 'currency',
      currency : currency,
    }).format(value)
}

// ! manual Current Date 
/*
const CurrentDate = function(){
  const now       = new Date();
  const day       = `${now.getDay()}`.padStart(2,0);
  const month     = `${now.getMonth() + 1}`.padStart(2,0);
  const year      = now.getFullYear();
  const hour      = `${now.getHours()}`.padStart(2,0);
  const mintues   = `${now.getMinutes()}`.padStart(2,0);
  labelDate.textContent = `${day}/${month}/${year}, ${hour}:${mintues}`
}
*/

// ! Experimenting with API
const createCurrentDate = function(acc){
  // * Create Current date
  const now = new Date();
  const option = {
    hour    : 'numeric',
    minute  : 'numeric',
    day     : 'numeric',
    month   : 'long',
    year    : 'numeric',
    weekday : 'short'
  };
  // en-Us , en-UK
  const locale = acc.locale; 
  labelDate.textContent = new Intl.DateTimeFormat(locale,option).format(now);
}

// ! Time out log out
const startLogOutTimer = function(){
  const tick = function(){
    const min = String(Math.trunc(time / 60)).padStart(2,0);
    const sec = String(time % 60).padStart(2,0);
    // in each call , print the remaining time to UI
    labelTimer.textContent = `${min} : ${sec}`;
  
    // When 0 secound , stop timer and og out user
    if(time === 0){
      clearInterval(timer);
      
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    // Decrease 1s
    time--;
  }
  // Set time to 5 mins
  let time = 300;
  // Call the Timer every 1 sec
  tick();
  const timer = setInterval(tick , 1000);
  return timer;
}

//////////////////////////////////////////////////////////
// * ---------> Events <------------

// ! login (check user account)
let currentAccount, timer;
btnLogin.addEventListener('click',function(e){
  e.preventDefault();
  currentAccount = accounts.find(user => user.username == inputLoginUsername.value);
  if(currentAccount?.pin == inputLoginPin.value)
  {
    // * Display Name of owmner
    labelWelcome.textContent = `Welcome back, 
    ${currentAccount.owner.split(' ')[0]}`
    
    // * Display APP
    containerApp.style.opacity = 1;
    
    // * current Date
    createCurrentDate(currentAccount);

    // * Clear flieds 
    inputLoginUsername.value = inputLoginPin.value = ' ';
    
    // * Clear focus 
    inputLoginUsername.blur();
    inputLoginPin.blur();

    // * Update Time out 
    if(timer) clearInterval(timer);
    timer = startLogOutTimer();

    // * Update data
    updateUI(currentAccount);
  }
});

// ! transfer 
btnTransfer.addEventListener('click',function(e){
  e.preventDefault();

  const amount = (Number(inputTransferAmount.value));
  const receiverAcc = accounts.find(user => user.username == inputTransferTo.value);
  if(amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username){
      // * Doing the transfer
      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);
      // * Push Date to movements
      currentAccount.movementsDates.push(new Date().toISOString());
      receiverAcc.movementsDates.push(new Date().toISOString());
      // * Update Time out 
      if(timer) clearInterval(timer);
      timer = startLogOutTimer();
      // * update UI
      updateUI(currentAccount);
      
  }
})

// ! Close account
btnClose.addEventListener('click',function(e){
  e.preventDefault();

  if(currentAccount.username === inputCloseUsername.value && 
    currentAccount.pin == Number(inputClosePin.value))
    {
      const index = accounts.findIndex(acc => acc.username === currentAccount.username);
      accounts.splice(index, 1);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
      currentAccount = undefined;

    }
    inputCloseUsername.value = inputClosePin.value = '';

})

// ! loan
btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  const checkTrue = currentAccount.movements.some(mov => mov >= loanAmount*0.1);
  if(loanAmount > 0 && checkTrue){
    currentAccount.movements.push(loanAmount);
    currentAccount.movementsDates.push(new Date().toISOString());
    setTimeout(() => {
      updateUI(currentAccount);
    }, 2000);
  }
  inputLoanAmount.value = '';
  // * Update Time out 
  if(timer) clearInterval(timer);
  timer = startLogOutTimer();
})

// ! Sort 
let sorted = false;
btnSort.addEventListener('click',function(e){
  e.preventDefault()
  displayMovements(currentAccount,!sorted);
  sorted = !sorted;
})



