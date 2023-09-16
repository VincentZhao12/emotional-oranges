const songs_list = [];
const chosen_songs_IDs = [];

function convertEmotion(emotion) {
    switch (emotion){
        case "angry":
            getSixteenSongs(0, 1);
            break;
        case "disgusted":
            getSixteenSongs(0, 0.5);
            break;
        case "fearful":
            getSixteenSongs(0, 1);
            break;
        case "happy":
            getSixteenSongs(1, 0.75);
            break;
        case "neutral":
            getSixteenSongs(0.5, 0.5);
            break;
        case "sad":
            getSixteenSongs(0, 0);
        default: //suprised
            getSixteenSongs(1, 1);
            break;
    }
}
function getSixteenSongs(valence, energy) {
    for(let i = 0; i < songs_list; i++ ){
        if(Math.abs(songs_list[i].getValence() - valence) < 0.25 ){
            if(Math.abs(songs_list[i].getEnergy() - energy) < 0.25){
                chosen_songs_IDs.push(songs_list[i].getID());
            }
        }
        if(chosen_songs_IDs.length === 16){
            return;
        }
    }
}



