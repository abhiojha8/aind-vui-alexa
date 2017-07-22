'use strict';
var Alexa = require('alexa-sdk');
var APP_ID = undefined;  // can be replaced with your app ID if publishing
var facts = require('./facts');
var GET_FACT_MSG_EN = [
    "Here's your fact: ",
    "Here it is : ",
    "The fact is :",
    "Here is your fun fact: ",
    "the fact is:"
];
// Test hooks - do not remove!
exports.GetFactMsg = GET_FACT_MSG_EN;
var APP_ID_TEST = "mochatest";  // used for mocha tests to prevent warning
// end Test hooks
/*

 TODO (Part 3) add reprompt messages as needed
 */
var languageStrings = {
    "en": {
        "translation": {
            "FACTS": facts.FACTS_EN,
            "SKILL_NAME": "My History Facts",  // OPTIONAL change this to a more descriptive name
            "GET_FACT_MESSAGE": GET_FACT_MSG_EN,
            "HELP_MESSAGE": "You can say tell me a fact, or, you can say exit... What can I help you with?",
            "HELP_REPROMPT": "What can I help you with?",
            "STOP_MESSAGE": "Goodbye!",
            "SKILL_NAME": "My History Facts"
        }
    }
};

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // set a test appId if running the mocha local tests
    if (event.session.application.applicationId == "mochatest") {
        alexa.appId = APP_ID_TEST
    }
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};


// const repromptString = "Do you want to know more facts?";
var handlers = {
    'LaunchRequest': function () {
        this.emit('GetFact');
    },
    'GetNewFactIntent': function () {
        this.emit('GetFact');
    },
    'GetNewYearFactIntent': function () {
        this.emit('GetNewYearFact');
    },
    'GetFact': function () {
        var factArr = this.t('FACTS');
        var randomFact = randomPhrase(factArr);

        var speechOutput = randomPhrase(this.t("GET_FACT_MESSAGE") )+ randomFact;
        this.emit(':askWithCard', speechOutput, "Say something like 'tell me a fact' to listen to " +
            "more facts ", this.t("SKILL_NAME"), randomFact)
    },
    'GetNewYearFact': function () {
        var factArr = this.t('FACTS');
        var yearAsked =  this.event.request.intent.slots.FACT_YEAR.value;
        // console.log('factArr is ' + factArr);
        var yearFact = GetYearFact(yearAsked, factArr);
        var speechOutput;

        if(yearFact===null) {
            yearFact = 'Fact not found. Here is a random fact: ' + randomPhrase(factArr);
            speechOutput = yearFact;
        }else
            speechOutput = randomPhrase(this.t("GET_FACT_MESSAGE") ) + yearFact;

        console.log('response is ' + speechOutput);
        this.emit(':askWithCard', speechOutput, "Say something like 'tell me a 1950 fact' to listen to " +
            "more facts ",  this.t("SKILL_NAME"), yearFact)

    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = this.t("HELP_MESSAGE");
        var reprompt = this.t("HELP_MESSAGE");
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    }
};

function randomPhrase(phraseArr) {
    // returns a random phrase
    // where phraseArr is an array of string phrases
    var i = 0;
    i = Math.floor(Math.random() * phraseArr.length);
    return (phraseArr[i]);
};

function GetYearFact(yearAsked, phraseArr) {

    for (var i=0; i < phraseArr.length; i++) {
        var phrase = phraseArr[i];
        if(phrase.includes(yearAsked)){
            return phrase
        }
    }

    return null

};
