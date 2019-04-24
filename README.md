# SUPERscript
by Sivan Adler and Maria Cristina Simoes


A project created during our time at the [Flatiron School](https://flatironschool.com/)

![](https://media.giphy.com/media/g04AH1QpwcCEOTnaNw/giphy.gif)

## DESCRIPTION
SUPERscript is a game, created by Sivan Adler and Maria Cristina Simoes, that is designed to help teach children how to code in Javascript. Upon login, a user will be prompted by a challenge that is specific to each level. Below that challenge is a text editor, where the user will be prompted to fill in the missing line of code to pass the challenge for that level. Upon submit, the text editor executes the code and checks if its return value matches that of the challenge at hand. If their code is correct, they'll move to the next level. However, if their code is incorrect, they will see an error pop up that gives them clue towards solving the challenge. If the user still doesn't know how to proceed, they can click the 'hint' button to recieve another clue, or click the 'solution' button to see what the correct answer is for that level. 


## INSTALL
1. Clone down this repository to your local machine. 
2. Clone down the [backend repository](https://github.com/MCSimoes18/kidCodeGame) to your local machine.
3. Run ```bundle install``` in your terminal after cloning down the backend. 
4. Before launching the app, you'll need to launch our database. In your terminal for the backend repository, run ```rails db:create``` and ```rails db:migrate```.
5. Run ```rails s``` in that same terminal session to launch our server.
6. Once your server is running, run ```open index.html``` in terminal for the frontend cloned repository.


## CONTRIBUTORS GUIDE
1. Fork and clone this repository.
2. Fork and clone the [backend repository](https://github.com/MCSimoes18/kidCodeGame) .
3. Create your feature branch ```git checkout -b my-new-feature```.
4. Commit your changes ```git commit -m 'Add some feature'```.
5. Push to the branch ```git push origin my-new-feature```.
6. Create a new Pull Request.
