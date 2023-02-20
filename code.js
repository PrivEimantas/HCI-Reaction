/*eslint-env browser */

var startTime, timeOut,
SPACE_CODE = 32,
E_CODE = 101,
THOUSAND = 1000;
let circle,
times,
result,
hasChanged = false;
var startButton;
var trialCounter = 0;
var trials = 15;

// changes
LEFT_CODE = 37,
RIGHT_CODE = 39,
arrayOfResults = []; //Will contain the reaction time and whether the answer was correct or not
var answerIsRed = false;



function init(){
    startButton = document.querySelector(".button");
    startButton.addEventListener("click", startExperiment);
    document.addEventListener("keydown", onKeyPressed);
    result = document.getElementById("results");
    times = document.getElementById("times");
    description = document.getElementById("description");
}

//experiment is started when the start button is clicked
function startExperiment(){
    resetTest();
    timeOut = setTimeout(changeColor, getRandomTime());
    startButton.classList.add("disabled");
}

//a random amount of seconds is calculated between 2 and 5 seconds
function getRandomTime(){
    var min = 2,
    max = 5,
    rand = Math.floor(Math.random() * (max - min + 1) + min);
    return rand * THOUSAND;
}

function changeColor(){
    circle = document.getElementById("circle");
    
    // changes
    // Randomly choose between red and blue as the correct answer
    answerIsRed = Math.floor(Math.random() * 2) == 1;
    circle.style.background = (answerIsRed) ? "red" : "blue";
    
    startTime = new Date();
    hasChanged = true;
}

//key events triggered
function onKeyPressed(e){
    var neededTime;

    if (e.repeat) { return }

    if (hasChanged) {
        switch (e.keyCode) {
            case LEFT_CODE:
            case RIGHT_CODE:
                //Do things common between left and right keys
                trialCounter++;
                let endtime = new Date();
                neededTime = endtime - startTime;
                arrayOfResults.push([neededTime, true]);
                result.classList.remove("hidden");
                result.innerHTML = neededTime + "ms";
                resetBackground();
                timeOut = setTimeout(changeColor, getRandomTime());

                break;
        }

        switch (e.keyCode) {
            case LEFT_CODE: //Red
                if (!answerIsRed) { //Fail
                    arrayOfResults[arrayOfResults.length - 1][1] = false;
                    result.innerHTML += "<a style='color: red; font-weight: bold'> Wrong!</a>";
                }
                break;
                
            case RIGHT_CODE: //Blue
                if (answerIsRed) { //Fail
                    arrayOfResults[arrayOfResults.length - 1][1] = false;
                    result.innerHTML += "<a style='color: red; font-weight: bold'> Wrong!</a>";
                }
                break;
        }
    }
 
    if(trialCounter == trials){
        resetBackground();
        clearTimeout(timeOut);
        showResults();
        document.removeEventListener("keydown", onKeyPressed);
    }
}

//reset everything to starting condition
function resetTest(){
    arrayOfResults = [];
    times.innerHTML = "";
    result.classList.add("hidden");
    description.style.visibility = "hidden";
}

//circle color set back to blue
function resetBackground(){
    circle.style.background = "white";
    hasChanged = false;
}

//show reaction times for user
function showResults(){
    let finalTimes = "", i;
    for (i = 0; i < arrayOfResults.length; i++){
        //changes
        //Changed to work with the array that stores both reaction time and correctness, as well as giving an indication of incorrect results
        let correctness = (!arrayOfResults[i][1]) ? " <a style='color: red; font-weight: bold'> Wrong!</a>" : "";
        if(i === arrayOfResults.length - 1){
            finalTimes += arrayOfResults[i][0] + "ms" + correctness;
        }else{
        finalTimes += arrayOfResults[i][0] + "ms" + correctness + ", ";}
    }
    times.innerHTML = "Reaction times: " + finalTimes;
    saveToCsv();
    arrayOfResults = [];
}

//csv file is created and ready to download
function saveToCsv(){
	var encodedUri, link;
	let csvContent = "data:text/csv;charset=utf-8,Reaction times in ms (visual), Answer\n";
	arrayOfResults.forEach(function (infoArray) {
		// changes
        let row = infoArray[0] + "," + ((infoArray[1]) ? "Correct" : "Incorrect") + ",";
        csvContent += row + "\r\n";
    });
	encodedUri = encodeURI(csvContent);
	
	link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", "resultsModified.csv");
	document.body.appendChild(link);
	link.click();
}

init();