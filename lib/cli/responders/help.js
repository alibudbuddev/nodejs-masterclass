const help = (cli) => {
  // Codify the commands and their explanations
  var commands = {
    'products' : 'Display products',
    'orders' : 'Display orders placed in the last 24 hours',
    'users' : 'Display users signed up in the last 24 hours',
    'users --{email}' : 'Show details of a specified user',
    'orders --{orderId}' : 'Show details of a specified order',
  };

  // Show a header for the help page that is as wide as the screen
  cli.horizontalLine();
  cli.centered('CLI MANUAL');
  cli.horizontalLine();
  cli.verticalSpace(2);

  // Show each command, followed by its explanation, in white and yellow respectively
  for(var key in commands){
     if(commands.hasOwnProperty(key)){
        var value = commands[key];
        var line = '      \x1b[33m '+key+'      \x1b[0m';
        var padding = 60 - line.length;
        for (i = 0; i < padding; i++) {
            line+=' ';
        }
        line+=value;
        console.log(line);
        cli.verticalSpace();
     }
  }
  cli.verticalSpace(1);

  // End with another horizontal line
  cli.horizontalLine();
}

module.exports = help;