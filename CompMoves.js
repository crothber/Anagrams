function wordInMiddle(word, player, dict) {
    //Find all potential words in middle
    var combos = tryAll(middle);
    var potentialWords = [];
    for (var i=0; i<combos.length; i++) { //For each combination in the middle
        var key = combos[i].split('').sort(); //The key is the sorted letters
        wordsToPush = lettersToWord(key, dict);
        if (wordsToPush !== null) {
            for (var j=0; j<wordsToPush.length; j++) {
                potentialWords.push(wordsToPush[j]); //And this is words you can make from that combination
            }
        }
    }
    if (potentialWords.length == 0) { //If no words can be made from the ltters in the middle
        return false;
    }
    if (player === manWords) {
        if (!(x_in_A(word, potentialWords))) { //If the word isn't in the potential words
            return false;
        }
    } else {
        word = choose(potentialWords);
    }
    change(word, "x", middle, word, player);
    return true;
}