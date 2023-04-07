// Loads jsPsych
var jsPsych = initJsPsych({});

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
// Instructions
var instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<p>To begin the experiment, hit the space bar.</p>",
    choice: [" "],
};

timeline.push(instructions);

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
        {prompt: "What word would you associate with this?"}
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
