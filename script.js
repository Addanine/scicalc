const button1 = document.getElementById("1");

button1.addEventListener("click", function() {
    var eA = document.getElementById(equationArea);
    eA.value += newNum;
});

function addNum(equationArea, newNum) {
    var eA = document.getElementById(equationArea);
    eA.value += newNum;
}