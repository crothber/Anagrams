function flip() {
    if (letter_list.length > 0) {
        clearInterval(timeMidPre);
        clearInterval(timeMidLong);
        clearInterval(timeStealShort);
        clearInterval(timeStealPre);
        if (middle.length > 5) {
            checkMiddleLong();
        }
        if (manWords.length + compWords.length < 4) {
            var k = d*500
        } else if (manWords.length + compWords.length < 9) {
            k = d*1000
        } else if (manWords.length + compWords.length < 16) {
            k = d*1200
        } else if (manWords.length + compWords.length < 16) {
            k = d*1400
        } else {
            k = d*1600
        }
        timeStealPre = setInterval(compStealPre, choose([k*2, k*2.5, k*3]));
        timeStealShort = setInterval(compStealShort, k*8);
        timeMidPre = setInterval(checkMiddlePre, choose([k*1.8, k*2.4, k*2.8]));
        timeMidLong = setInterval(checkMiddleLong, choose([k*2.2, k*3.2, k*4.2]));
        var letter = letter_list[letter_list.length-1];
        middle.push(letter);
        letter_list.splice(letter_list.length-1, 1);
        document.getElementById("remainingLetters").innerHTML = letter_list.length;
    } else {
        gameOver();
    }
}

function gameOver() {
    var winStatement;
    if (man_score > comp_score) {
        winStatement = "HUZZAH! YOU WIN!";
    } else if (man_score < comp_score) {
        winStatement = "OH NO! YOU LOST! RELOAD TO PLAY AGAIN.";
    } else {
        winStatement = "IT'S A TIE! NOW YOU *HAVE* TO PLAY AGAIN!";
    }
    document.getElementById("status").innerHTML = winStatement;
}

function checkMiddlePre() {
    wordInMiddle('x', compWords, preDictionary)
}
function checkMiddleLong() {
    wordInMiddle('x', compWords, compDict);
}

function lettersToWord(key, dict) {
    for (var i=0; i<dict.length; i+=2) {
        if (array_equals(dict[i], key)) {
            return dict[i+1];
        }
    }
    return null;
}

function Score() {
    man_score = 0;
    comp_score = 0;
    for (i=0; i<manWords.length; i++) {
        man_score += manWords[i].length - 2;
    }
    for (i=0; i<compWords.length; i++) {
        comp_score += compWords[i].length - 2;
    }
    document.getElementById("comp_score").innerHTML = ('Computer: ' + comp_score);
    document.getElementById("man_score").innerHTML = ('You: ' + man_score);
}

function sameShoresh(w1, w2) {
    if (w2[w2.length-1] === 'e') {
        if (x_in_A(w1, [w2+'s', w2+'ing', w2+'r', w2+'d'])) {
            return true;
        } else if (x_in_A(w2, [w1+'s', w1+'ing', w1+'r', w1+'d'])) {
            return true;
        } else {
            return false;
        }
    } else {
        if (x_in_A(w1, [w2+'s', w2+'es', w2+'ing', w2+w2[w2.length-1]+'ing', w2+'er', w2+w2[w2.length-1]+'er', w2+w2[w2.length-1]+'ed', w2+'ed'])) {
            return true;
        } else if (x_in_A(w2, [w1+'s', w1+'es', w1+'ing', w1+w1[w1.length-1]+'ing', w1+'er', w1+w1[w1.length-1]+'er', w1+w1[w1.length-1]+'ed', w1+'ed'])) {
            return true;
        } else {
            return false;
        }
    }
}

function Steal(goal_word, side, player, maxLen, dict) {
    var potentialCombos = tryAll(middle);
    var combos = [];
    
    //LIMIT POSSIBLE NUMBER OF ADDED LETTERS
    if (player === 'C') {
        for (var i=0; i<potentialCombos.length; i++) {
            var combo = potentialCombos[i];
            if (combo.length>0 && combo.length<choose([3,4]) && !(x_in_A(combo, combos))) {
                combos.push(combo);
            }
        }
    } else {
        combos = potentialCombos;
    }
    
    combos.sort(function(a, b) { return a.length - b.length; }); //sort combos from least to greatest
    
    for (var i=0; i<combos.length; i++) {
        var added_letters = combos[i]; //for all combinations added_letters in the middle
        for (var j=0; j<side.length; j++) {
            var orig_word = side[j]; //for all original words on a given side
            var guess_letters = orig_word + added_letters;
            var key = guess_letters.split('').sort(); //the key is the original word's letter plus the added letters
            var potentialWords = lettersToWord(key, dict);
            /* BEGIN COMPUTER TURN */
            if (player == 'C' && potentialWords !== null) {
                for (var k=0; k<potentialWords.length; k++) {
                    var newWord = potentialWords[k]; //Try each word in potentialWords until a valid word is found
                    if (!(sameShoresh(newWord, orig_word)) && newWord.length<=maxLen) {
                        change(added_letters, orig_word, side, newWord, compWords);
                        update();
                        return true;
                    }
                }
            } else if (player == 'M' && potentialWords !== null) {
                /* BEGIN HUMAN TURN */
                if (x_in_A(goal_word, potentialWords)) {
                    if (!(sameShoresh(goal_word, orig_word))) {
                        change(added_letters, orig_word, side, goal_word, manWords); 
                        return true;
                    } else {
                        document.getElementById("status").innerHTML = ('You\'re just adding a suffix!');
                        return true;
                    }
                }
            }
        }
    }
    return false
}

function change(added_letters, orig_word, side, new_word, player) {
    player.push(new_word);
    for (var k=0; k<added_letters.length; k++) {
        middle.splice(middle.indexOf(added_letters[k]), 1);
    }
    if (player == compWords) {
        var stealer = "The computer";
    } else {
        var stealer = "You";
    }
    if (side != middle) {
        side.splice(side.indexOf(orig_word), 1);
        if (side == compWords) {
            if (player == compWords) {
                source = 'its word "' + orig_word + '!"';
            } else {
                source = 'the computer\'s word "' + orig_word + '!"';
            }
        } else {
            source = 'your word "' + orig_word + '!"';
        }
    } else {
        source = 'the middle!'
    }
    document.getElementById("status").innerHTML = (stealer + ' just stole "' + new_word + '" from ' + source);
    update();
}

function showLevel() {
    var level = document.getElementById("difficulty").value;
    document.getElementById("difficulty-label").innerHTML = level;
}

function Play(){

    var word = document.getElementById('word_entered').value.toString();

    var level = document.getElementById("difficulty").value;
    if (level == 5) {
        d = .75;
    } else if (level == 4) {
        d = 1.;
    } else if (level == 3) {
        d = 1.25;
    } else if (level == 2) {
        d = 2;
    } else if (level == 1) {
        d = 2.25;
    }

    if (word === '') {
        flip();
    } else if (x_in_A(word, wordlist)) {
        if (wordInMiddle(word, manWords, dictionary) === false) {
            if (Steal(word, compWords, 'M', 30, dictionary) === false) {
                if (Steal(word, manWords, 'M', 30, dictionary) === false) {
                    document.getElementById("status").innerHTML = ('Sorry, you can\'t make "' + word + '" with the available letters.');
                }
            }
        }
    } else {
        document.getElementById("status").innerHTML = ('Sorry, "' + word + '" is not a valid word.');
    }
    update();

}

function update() {
    document.getElementById("middle").innerHTML = formatMiddle(middle);
    document.getElementById("compWords").innerHTML = formatWordList(compWords);
    document.getElementById("manWords").innerHTML = formatWordList(manWords);
    Score();
}