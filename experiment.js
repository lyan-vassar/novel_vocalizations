// Loads jsPsych
var jsPsych = initJsPsych({
    show_progress_bar: true
});

// Timeline that holds javascript variables (instructioins, stimuli) to appear in chronological order 
var timeline = [];

// preload
var preload = {
    type: jsPsychPreload,
    audio: ["vocalizations/AB_gather.wav", "vocalizations/BW_bad.wav"]
}
timeline.push(preload);

// Captures info from Prolific
var subject_id = jsPsych.data.getURLVariable('PROLIFIC_PID');
var study_id = jsPsych.data.getURLVariable('STUDY_ID');
var session_id = jsPsych.data.getURLVariable('SESSION_ID');

jsPsych.data.addProperties({
    subject_id: subject_id,
    study_id: study_id,
    session_id: session_id
});

// stimuli
var test_stimuli = [version_x, version_y, version_z];

// Randomly chooses version the subject gets and saves the data
var versionNum = jsPsych.randomization.sampleWithoutReplacement([0, 1, 2], 1)[0];

// Adds version number to data frame
jsPsych.data.addProperties({
    version: versionNum,
});

/* RUNNING THE EXPERIMENT */
// Welcome message
var welcome = {
    type: jsPsychHtmlButtonResponse,
    stimulus: "<p>Welcome to our study!</p><p>Click the button below to proceed.</p>",
    choices: ["Next"]
}

timeline.push(welcome);

// Instructions
var instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: "<p>In this study, you will hear a series of sounds. Each sound was created by a person in order to express a particular meaning. After listening to each sound, you will be asked to guess what that intended meaning was. Even if you feel unsure of the intended meaning, please make your best guess. You will not be penalized for guessing incorrectly.</p><p>It is important that you read the directions carefully and listen closely to the sounds. To ensure that you are paying attention, you will occasionally hear a person's voice saying \"cats and dogs\" and will be asked to indicate when you hear this. If you fail the attention check, your participation may not be counted.</p><p>Click the button below to proceed.</p>",
    choices: ["Next"]
};

timeline.push(instructions);

// make sure participant has headphones
var headphoneCheck = {
    type: jsPsychAudioButtonResponse,
    stimulus: "glass-of-wine-143532.mp3",
    choices: ["Next"],
    prompt: "<p>This experiment uses audio prompts. We ask that you use headphones.</p><p>Please adjust your audio until you can hear the music. Once you can hear the music, click the button above to proceed.</p>"
}

timeline.push(headphoneCheck);

var experimentStart = {
    type: jsPsychHtmlButtonResponse,
    stimulus: "<p>The experiment will now begin. You will be presented with 33 trials, followed by a short survey.</p><p>Click the button below to proceed.</p>",
    choices: ["Next"]
}

timeline.push(experimentStart);

// var audioPrompt = {
//     type: jsPsychAudioButtonResponse,
//     stimulus: jsPsych.timelineVariable("audio"),
//     prompt: "Press the button above once you are finished listening to the stimulus.",
//     choices: ["Continue"]
// }

// var question = {
//     type: jsPsychSurveyText, 
//     questions: [
//         {prompt: "What word would you associate with the previous sound?"}
//     ]
// }

var prompt = {
    type: jsPsychAudioSurveyText,
    stimulus: jsPsych.timelineVariable("audio"),
    //stimulus: "vocalizations/AB_gather.wav",
    questions: [
        {prompt: "<p>Listen carefully to the sound. <b>What meaning do you think the person was trying to express with this sound?</b> Type your answer in the box below.</p><p>When you have typed your response, click \"Continue\" to proceed.</p>"}
    ]
}

var experiment = {
    timeline: [prompt],
    //timeline: [audioPrompt, question],
    //timeline_variables: {audio: "vocalizations/AB_gather.wav"},
    timeline_variables: test_stimuli[versionNum],
    randomize_order: true
};

timeline.push(experiment);

// Saves data
var save_server_data = {
    type: jsPsychCallFunction,
    func: function () {
      var data = jsPsych.data.get().json();
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'php/save_json.php');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({ filedata: data }));
    },
    post_trial_gap: 1000
  }

timeline.push(save_server_data);


// // Debriefs the participant
// var debrief = {
//     type: jsPsychHtmlKeyboardResponse,
//     stimulus: "Thank you for participating in the experiment!\n If you'd like to learn more about the purpose of this experiment and what we're measuring, press 'y'.<p>Otherwise, <a href='https://app.prolific.co/submissions/complete?cc=9231C938'>click here to return to Prolific and complete the study</a>.</p>",
// };

// var full_debrief = {
//     type: jsPsychHtmlKeyboardResponse,
//     stimulus: "The main question being asked in this study is how the amount of privileged information provided in one perspective (level of embeddedness) affects projecting information to uninformed (other) perspectives. With each scenario, participants were shown one out of three levels of embeddedness: least embedded, somewhat embedded, and most embedded.\nThe main dependent variable being measured, which will be compared between each level of embeddedness, is the frequency with which participants overproject the privileged knowledge of one character by attributing it to another character. This will be measured by the participants' answers to sincere/sarcastic questions, which will be consistent with either the privileged knowledge of one character or the limited knowledge of the other.<p><a href='https://app.prolific.co/submissions/complete?cc=8A3B5E88'>Click here to return to Prolific and complete the study</a>.</p>",
//     choices: "NO_KEYS",
// }

// // Gives participant option of getting full debrief
// var if_full_debrief = {
//     timeline: [full_debrief],
//     conditional_function: function () {
//         // Checks which key was pressed
//         var key = jsPsych.data.get().last(1).values()[0];
//         if (jsPsych.pluginAPI.compareKeys(key.response, 'y')) {
//             return true;
//         }
//         else {
//             return false;
//         }
//     }
// }

var goodbye = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "Thanks for participating! <a href='https://app.prolific.co/submissions/complete?cc=9231C938'>Click here to return to Prolific and complete the study</a>."
}


timeline.push(goodbye);

jsPsych.run(timeline);
