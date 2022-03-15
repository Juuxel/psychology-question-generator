const ONE = "<span class=\"one\">one</span>";
/// Question sets
class QuestionSet {
    constructor() {
        this.commonTopics = [];
        this.saqOnlyTopics = [];
        this.erqOnlyTopics = [];
        this.hlOnlyTopics = [];
        this.modelsAndTheories = [];
        this.hasSaq = true;
        this.enabled = true;
        this.hlExtension = true;
    }
    pickSaqTopic() {
        return pickFromAll([this.commonTopics, this.saqOnlyTopics]);
    }
    pickErqTopic() {
        return this.hlExtension ? pickFromAll([this.commonTopics, this.erqOnlyTopics, this.hlOnlyTopics]) : pickFromAll([this.commonTopics, this.erqOnlyTopics]);
    }
    pickTheoryOrModel() {
        return pick(this.modelsAndTheories);
    }
}
class QuestionSets {
    constructor() {
        this.biological = new QuestionSet();
        this.biological.commonTopics = [
            "the relationship between brain and behaviour",
            "localisation of function",
            "neuroplasticity",
            "the relationship between genetics and behaviour",
            "evolutionary explanations for behaviour",
        ];
        this.biological.saqOnlyTopics = [
            ONE + " technique used to study the brain",
            "neural network",
            "neural pruning",
            ONE + " neurotransmitter",
            "neurons",
            "synapses",
            ONE + " agonist",
            ONE + " antagonist",
            "the effect of " + ONE + " hormone on behaviour",
            "the effect of " + ONE + " pheromone on behaviour",
            "the effect of genes on behaviour",
            [ONE + " twin study", true],
            [ONE + " kinship study", true],
        ];
        this.biological.erqOnlyTopics = [
            "techniques used to study the brain",
            "neurotransmitters",
            "the effect of hormones on behaviour",
            "the effect of pheromones on behaviour",
        ];
        this.biological.hlOnlyTopics = [
            "the role of animal research in understanding human behaviour",
        ];
        this.cognitive = new QuestionSet();
        this.cognitive.commonTopics = [
            "cognitive processing",
            "models of memory",
            "schema theory",
            "reliability of cognitive processes",
            "reconstructive memory",
            "emotion and cognition",
            "the influence of emotion on cognitive processes",
        ];
        this.cognitive.saqOnlyTopics = [
            "the multi-store memory model",
            "the working memory model",
            "cognitive schemas",
            "rational thinking",
            "intuitive thinking",
            ONE + " model of thinking and decision-making",
            ONE + " bias in thinking and decision-making",
        ];
        this.cognitive.erqOnlyTopics = [
            "models of thinking and decision-making",
            "biases in thinking and decision-making",
        ];
        this.cognitive.hlOnlyTopics = [
            "cognitive processing in a technological world",
        ];
        this.cognitive.modelsAndTheories = [
            "schema theory",
            "models in thinking and decision-making",
            "models of memory",
        ];
        this.sociocultural = new QuestionSet();
        this.sociocultural.commonTopics = [
            "the individual and the group",
            "social identity theory",
            "social cognitive theory",
            "formation of stereotypes",
            "the effect of stereotypes on behaviour",
            "cultural origins of behaviour and cognition",
            "culture and its influence on behaviour and cognition",
            "cultural influences on individual behaviour",
            "enculturation",
            "acculturation",
        ];
        this.sociocultural.saqOnlyTopics = [
            "social groups",
            "cultural groups",
            ONE + " cultural dimension",
            "norms",
            "assimilation",
        ];
        this.sociocultural.erqOnlyTopics = [
            "cultural dimensions",
        ];
        this.sociocultural.hlOnlyTopics = [
            "the influence of globalisation on individual behaviour",
        ];
        this.sociocultural.modelsAndTheories = [
            "social identity theory",
            "social cognitive theory",
        ];
        this.abnormal = new QuestionSet();
        this.abnormal.erqOnlyTopics = [
            "factors influencing diagnosis",
            "normality versus abnormality",
            "classification systems",
            "the role of clinical biases in diagnosis",
            "validity and reliability of diagnosis",
            "etiology of abnormal psychology",
            "explanations for disorders",
            "prevalence rates and disorders",
            "treatment of disorders",
            "biological treatment of disorders",
            "psychological treatment of disorders",
            "the role of culture in treatment",
            "assessing the effectiveness of treatments",
        ];
    }
    all(erq) {
        return erq
            ? [this.biological, this.cognitive, this.sociocultural, this.abnormal]
            : [this.biological, this.cognitive, this.sociocultural];
    }
    enabled(erq) {
        const result = [];
        for (const set of this.all(erq)) {
            if (set.enabled) {
                result.push(set);
            }
        }
        return result;
    }
}
// Set up question sets
const questionSets = new QuestionSets();
/// Question types
class QuestionType {
    constructor(before, after = "") {
        this.before = before;
        this.after = after;
    }
    setTheoryOrModel() {
        this.theoryOrModel = true;
        return this;
    }
    saq() {
        this.isErq = false;
        return this;
    }
    erq() {
        this.isErq = true;
        return this;
    }
    setStudyVariant(studyVariant) {
        this.studyVariant = studyVariant;
        return this;
    }
    apply(questions) {
        let topicName;
        if (this.theoryOrModel) {
            topicName = questions.pickTheoryOrModel();
        }
        else if (this.isErq) {
            topicName = questions.pickErqTopic();
        }
        else {
            const topic = questions.pickSaqTopic();
            if (Array.isArray(topic)) {
                // The second element is whether the topic is about studies.
                if (topic[1])
                    return this.studyVariant.applyToTopic(topic[0]);
            }
            else {
                topicName = topic;
            }
        }
        if (topicName == null) {
            return null;
        }
        return this.applyToTopic(topicName);
    }
    applyToTopic(topic) {
        return this.before + " " + topic + this.after + ".";
    }
}
const saqQuestionTypes = [
    [new QuestionType("Explain", " with reference to " + ONE + " study").saq().setStudyVariant(new QuestionType("Explain")), 4],
    [new QuestionType("Outline " + ONE + " study about").saq().setStudyVariant(new QuestionType("Outline")), 1],
];
const erqQuestionTypes = [
    [new QuestionType("Discuss").erq(), 4],
    [new QuestionType("Evaluate research about").erq(), 2],
    [new QuestionType("Evaluate").erq().setTheoryOrModel(), 1],
];
/// Math
function randomInt(max) {
    return Math.floor(Math.random() * max);
}
function pick(es) {
    if (es.length == 0)
        return null;
    return es[randomInt(es.length)];
}
function pickFromAll(arrays) {
    let totalLength = 0;
    for (const array of arrays) {
        totalLength += array.length;
    }
    let index = randomInt(totalLength);
    let i = 0;
    while (index >= arrays[i].length) {
        index -= arrays[i].length;
        i++;
    }
    return arrays[i][index];
}
function pickWeighted(pairs) {
    const flat = [];
    for (const pair of pairs) {
        for (let j = 0; j < pair[1]; j++) {
            flat.push(pair[0]);
        }
    }
    return pick(flat);
}
/// Visualisation
function setQuestionHtml(html) {
    document.getElementById("question").innerHTML = html;
}
function pickQuestion(questionTypes, questionSets) {
    let q = null;
    while (q == null)
        q = pickWeighted(questionTypes).apply(pick(questionSets));
    return q;
}
function setQuestion(questionTypes, erq) {
    setQuestionHtml(pickQuestion(questionTypes, questionSets.enabled(erq)));
}
function generateSaq() {
    setQuestion(saqQuestionTypes, false);
}
function generateErq() {
    setQuestion(erqQuestionTypes, true);
}
function generateP1() {
    const bioSaq = pickQuestion(saqQuestionTypes, [questionSets.biological]);
    const cogSaq = pickQuestion(saqQuestionTypes, [questionSets.cognitive]);
    const socSaq = pickQuestion(saqQuestionTypes, [questionSets.sociocultural]);
    const bioErq = pickQuestion(erqQuestionTypes, [questionSets.biological]);
    const cogErq = pickQuestion(erqQuestionTypes, [questionSets.cognitive]);
    const socErq = pickQuestion(erqQuestionTypes, [questionSets.sociocultural]);
    const html = "<h2>Section A</h2><ol><li>" + bioSaq
        + "<li>" + cogSaq + "<li>" + socSaq
        + "</ol><h2>Section B</h2><ol start=\"4\"><li>" + bioErq
        + "<li>" + cogErq + "<li>" + socErq + "</ol>";
    setQuestionHtml(html);
}
/// Configuration
function toggle(approach) {
    const set = questionSets[approach];
    set.enabled = !set.enabled;
    const hlCheckbox = document.getElementById(approach + "-hl-checkbox");
    if (hlCheckbox != null) {
        hlCheckbox.disabled = !set.enabled;
    }
    updateButtonStatus("saq-button", false);
    updateButtonStatus("erq-button", true);
}
function toggleHl(approach) {
    const set = questionSets[approach];
    set.hlExtension = !set.hlExtension;
}
function updateButtonStatus(id, erq) {
    const questionCount = questionSets.enabled(erq).length;
    document.getElementById(id).disabled = (questionCount == 0);
}
// Set all approaches to be enabled by default
document.addEventListener("DOMContentLoaded", () => {
    const elements = document.getElementsByClassName("approach-checkbox");
    for (const checkbox of elements) {
        checkbox.checked = true;
    }
});
