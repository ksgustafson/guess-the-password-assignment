document.addEventListener('DOMContentLoaded', () => {
    const wordCount = 10;
    let guessCount = 4;
    let password = '';

    const start = d3.select('#start')
	            .on('click', () => {
			toggleClasses(d3.select('#start-screen'), 'hide', 'show');
			toggleClasses(d3.select('#game-screen'), 'hide', 'show');
			startGame();
		    });

    function toggleClasses(selection, ...classNames) {
	classNames.forEach( name => selection.classed(name, !selection.classed(name)) );
    }

    function startGame() {
	// get random words and append them to the DOM
	const wordList = d3.select('#word-list');
	// 'words' variable is from words.js
	const randomWords = getRandomValues(words); // eslint-disable-line no-undef
	randomWords.forEach( (word) => {
	    wordList.append('li')
		    .text(word);
	});

	// set a secret password and the guess count display
	password = getRandomValues(randomWords, 1)[0];
	setGuessCount(guessCount);

	// add update listener for clicking on a word
	wordList.on('click', updateGame)
    }

    let getRandomValues = (array, numVals=wordCount) => shuffle(array).slice(0,numVals);

    function shuffle(array) {
	let arrayCopy = array.slice();
	for (let idx1 = arrayCopy.length - 1; idx1 > 0; idx1--) {
	    // generate a random index between 0 and idx1 (inclusive)
	    let idx2 = Math.floor(Math.random() * (idx1 + 1));

	    // swap elements at idx1 and idx2
	    [arrayCopy[idx2], arrayCopy[idx1]] = [arrayCopy[idx1], arrayCopy[idx2]];
	}
	return arrayCopy;
    }

    function setGuessCount(newCount) {
	guessCount = newCount;
	d3.select('#guesses-remaining')
	    .text(`Guesses remaining: ${guessCount}.`);
    }

    function updateGame() {
	let target = d3.select(d3.event.target);
	if (target.node().tagName === 'LI' && !target.classed('disabled')) {
	// grab guessed word, check it against password, update view
	    const guess = target.text();
	    const similarityScore = compareWords(guess, password);
	    target.classed('disabled', true)
	          .text(`${guess} --> Matching Letters: ${similarityScore}`);
	    setGuessCount(guessCount - 1);

	    // check whether the game is over
	    if (similarityScore === password.length) {
		toggleClasses(d3.select('#winner'), 'hide', 'show');
		d3.select(this).on('click', null);
	    } else if (guessCount === 0) {
		toggleClasses(d3.select('#loser'), 'hide', 'show');
		d3.select(this).on('click', null);
	    }
	}
    }

    function compareWords(word1, word2) {
	if (word1.length !== word2.length) {
	    throw 'Words must have the same length';
	}
	let count = 0;
	for (let i = 0; i < word1.length; i++) {
	    if (word1[i] === word2[i]) count++;
	}
	return count;
    }
});
