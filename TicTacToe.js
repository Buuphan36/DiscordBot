const Discord = require('discord.js');
const client = new Discord.Client();

let user_message;
let player;
let turn;
let board = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
let mark;
let start_game;

//Initializes the game
const initialize_game = () => {
  turn = 1;
  player = 1;
  start_game = true;
  board = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
};

//Prints the board
const print_board = (end) => {
  let i;
  let formatted_board = '|'
  for (i = 1; i < board.length + 1; i++) {
    if (!(i === 9) && (i % 3) === 0) {
      formatted_board = formatted_board + board[i - 1] + '|\n|';
    } else {
      formatted_board = formatted_board + board[i - 1] + '|'
    }
  }
  if (end) {
    return {
      embed: {
        color: 3447003,
        title: "Game Result:",
        description: formatted_board,
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL(),
        }
      }
    }
  } else {
    if (player === 1) {
      return {
        embed: {
          color: 3447003,
          title: "Player 1\'s turn! Type !ttt x to place your mark where x must be a number between 1-9:",
          description: formatted_board,
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL(),
          }
        }
      }
    } else {
      return {
        embed: {
          color: 3447003,
          author: {
            name: client.user.username,
            icon_url: client.user.avatarURL()
          },
          title: "Player 2\'s turn! Type !ttt x to place your mark where x must be a number between 1-9:",
          description: formatted_board,
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL(),
          }
        }
      }
    }
  }
};

//Checks for winner
const check_winner = () => {
  //Win conditions  
  if (board[0] + board[1] + board[2] === mark + mark + mark)
    return true
  else if (board[3] + board[4] + board[5] === mark + mark + mark)
    return true
  else if (board[6] + board[7] + board[8] === mark + mark + mark)
    return true
  else if (board[0] + board[3] + board[6] === mark + mark + mark)
    return true
  else if (board[1] + board[4] + board[7] === mark + mark + mark)
    return true
  else if (board[2] + board[5] + board[8] === mark + mark + mark)
    return true
  else if (board[0] + board[4] + board[8] === mark + mark + mark)
    return true
  else if (board[6] + board[4] + board[2] === mark + mark + mark)
    return true
  //No winner yet
  else return false
};

//Places player mark
const place_mark = (location) => {
  //checks if the location is taken
  if ((board[location] === 'X') || (board[location] === 'O')) {
    return false;
  }
  //marks the player location
  else {
    if (player === 2) {
      mark = 'O'
    }
    else {
      mark = 'X'
    }
    board[location] = mark
    return true;
  }
};

//Displays on console if you successfully connect with the bot  
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

//This code runs if a user enter a message on Discord
client.on('message', msg => {
  //Skips if the message is from the bot
  if (msg.author.bot) {
    return;
  }

  //Convert user message to lowercased
  user_message = msg.content.toLowerCase();

  //Gets a list of commands
  if (user_message === '!help') {
    msg.channel.send(
      {
        embed: {
          color: 3447003,
          author: {
            name: client.user.username,
            icon_url: client.user.avatarURL()
          },
          title: "Command list:",
          fields: [{
            name: "!ttt start",
            value: "To start a new game you must use this command."
          },
          {
            name: "!ttt x",
            value: "once a game is started you can place down your mark entering a number x where x is a number between 1-9."
          },
          {
            name: "!help",
            value: "To get a list of all the commands."
          }
          ],
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL(),
          }
        }
      }
    )
  }

  //Starts the game if the user types !ttt 
  if (user_message.startsWith('!ttt')) {
    input = user_message.split(' ');
    //Checks for invalid input
    if (!(input[1] === undefined)) {
        //Starts the game
      if (input[1] === 'start') {
        initialize_game();
        msg.channel.send(print_board());
        return;
      }
      if (start_game) {
        location = Number(input[1])
        //Checks for valid number/location
        if (location > 9 || location < 1) {
          msg.reply('Not a valid number! only 1-9:');
          msg.channel.send(print_board(false));
          return;
        }

        //Checks for none integer input
        if (!(isNaN(location))) {
          if (place_mark(location - 1)) {
            if (check_winner()) {
              msg.channel.send(print_board(true));
              msg.reply('Congratulation you won!');
              start_game = false;
              return;
            } else {
              //Draw condition
              if (turn === 9) {
                msg.channel.send(print_board(true))
                msg.channel.send('Draw!');
                start_game = false;
                turn++;
                return;
              }

              if (player == 1) {
                player = 2;
                console.log('player should now be 2: ' + player)
                msg.channel.send(print_board(false));
                return

              } else {
                player = 1;
                console.log('player should be 1: ' + player)
                msg.channel.send(print_board(false));
                return
              }
            }
          } else {
            msg.reply('Location is taken! try again...');
            msg.channel.send(print_board(false));
            return;
          }
        }
        else {
          msg.reply('Invalid!');
          msg.channel.send(print_board(false));
          return;
        }
      } else {
        msg.reply('You must start the game first! To start do: !ttt start')
      }
    }
    else {
      msg.reply('What???');
      return;
    }
  }
});

client.login("Your bot token");