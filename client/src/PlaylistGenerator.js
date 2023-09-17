let happy = [];
let angry = [];
let disgusted = [];
let fearful = [];
let neutral = [];
let sad = [];
let surprised = [];

let playlist = [];
let chosenEmotion = [];
let input; //Number representing emotion

switch(input) {
    case 0:
        chosenEmotion = happy;
        break;
    case 1:
        chosenEmotion = angry; //and fearful
        break;
    case 2:
        chosenEmotion = disgusted;
        break;
    case 3:
        chosenEmotion = neutral;
        break;
    case 4:
        chosenEmotion = sad;
        break;
    case 5:
        chosenEmotion = surprised;
        break;
}

let selectedIndexes = [];
let iterationLimit = 35;
while(playlist.length < 17){
    let index = (Math.random()*chosenEmotion.length)|0;
    let notRepeated = true;
    for(let i = 0; i < selectedIndexes.length; i++){
        if(selectedIndexes[i] === index){
            notRepeated = false;
        }
    }

    if(notRepeated){
        selectedIndexes.push(index);
        playlist.push(chosenEmotion[index].id);
    }

    if(iterationLimit === 0){
        break;
    }
    iterationLimit -= 1;
}