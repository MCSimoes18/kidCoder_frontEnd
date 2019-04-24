# SUPERscript
by Sivan Adler and Maria Cristina Simoes


A project created during our time at the [Flatiron School](https://flatironschool.com/)

![](https://media.giphy.com/media/g04AH1QpwcCEOTnaNw/giphy.gif)

## TECHNOLOGIES
- Vanilla Javascript
- Ruby on Rails
- Custom Chai Test Suite
- Code Mirror Text Editor
- Custom CSS

## DESCRIPTION
SUPERscript is a game, created by Sivan Adler and Maria Cristina Simoes, that is designed to help teach children how to code in Javascript. SUPERscript is built on a Vanilla Javascript front-end, a Ruby on Rails back-end and a custom Chai Test Suite. Upon login, a user will be prompted by a challenge that is specific to each level. Below that challenge is a text editor, where the user will be prompted to fill in the missing line of code to pass the challenge for that level. Upon submit, the text editor executes the code that the user wrote and our custom Chai test suite checks if its return value matches that of the challenge at hand. Users are also able to click the 'hint' button to recieve a clue, or click the 'solution' button to see what the correct answer is for that level. 


## INSTALL
1. Clone down this repository to your local machine. 
2. Clone down the [front-end repository](https://github.com/MCSimoes18/kidCoder_frontEnd) to your local machine.
3. Run ```bundle install``` in your terminal after cloning down the backend. 
4. Before launching the app, you'll need to launch our database. In your terminal for the backend repository, run ```rails db:create``` and ```rails db:migrate```.
5. Run ```rails s``` in that same terminal session to launch our server.
6. Once your server is running, run ```open index.html``` in terminal for the frontend cloned repository.


## CONTRIBUTORS GUIDE
1. Fork and clone this repository.
2. Fork and clone the [front-end repository](https://github.com/MCSimoes18/kidCoder_frontEnd) .
3. Create your feature branch ```git checkout -b my-new-feature```.
4. Commit your changes ```git commit -m 'Add some feature'```.
5. Push to the branch ```git push origin my-new-feature```.
6. Create a new Pull Request.
