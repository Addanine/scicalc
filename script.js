function calculate(operation, fnum, snum) {
    let result;

    if (isNaN(fnum) || isNaN(snum)) {
        result = "Invalid numbers.";
    } else {
        switch (operation) {
            case '+':
                result = fnum + snum;
                break;
            case '-':
                result = fnum - snum;
                break;
            default:
                result = "Invalid operation.";
        }
    }

    document.getElementById('result').innerText = result;
}
