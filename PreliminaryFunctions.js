function x_in_A(x, A) {
	for (var i=0; i<A.length; i++) {
		if (A[i] === x) {
			return true;
		}
	}
	return false;
}

function array_equals(a1, a2) {
    if (a1.length != a2.length) {
        return false;
    }
    for (var i=0; i<a1.length; i++) {
        if (a1[i] != a2[i]) {
            return false;
        }
    }
    return true;
}

function choose(choices) {
	var index = Math.floor(Math.random() * choices.length);
	return choices[index];
}

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function tryAll(list) {
	var result = [];
	var f = function(prefix, list) {
		for (var i = 0; i < list.length; i++) {
			result.push(prefix + list[i]);
			f(prefix + list[i], list.slice(i + 1));
		}
	}
	f('', list);
	return result;
}

function formatWordList(array) {
	var s = '';
	for (var i=0; i<array.length; i++) {
		s += array[i] + '&emsp;';
		if (i%2 == 1) {
			s += '<br>';
		}
	}
	return s.fontsize(5);
}

function formatMiddle(array) {
	var s = '&emsp;';
	for (var i=0; i<array.length; i++) {
		s += '  ' + array[i];
	}
	return s.fontsize(6);
}