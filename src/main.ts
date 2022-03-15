/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const ONE = "<span class=\"one\">one</span>";

/// Question sets
class QuestionSet {
    commonTopics: string[] = [];
    saqOnlyTopics: (string | [string, boolean])[] = [];
    erqOnlyTopics: string[] = [];
    hlOnlyTopics: string[] = [];
    modelsAndTheories: string[] = [];
    hasSaq: boolean = true;
    enabled: boolean = true;
    hlExtension: boolean = true;

    pickSaqTopic(): string | [string, boolean] {
        return pickFromAll<string | [string, boolean]>([this.commonTopics, this.saqOnlyTopics]);
    }

    pickErqTopic(): string {
        return this.hlExtension ? pickFromAll([this.commonTopics, this.erqOnlyTopics, this.hlOnlyTopics]) : pickFromAll([this.commonTopics, this.erqOnlyTopics]);
    }

    pickTheoryOrModel(): string {
        return pick(this.modelsAndTheories);
    }
}

class QuestionSets {
    biological: QuestionSet;
    cognitive: QuestionSet;
    sociocultural: QuestionSet;
    abnormal: QuestionSet;

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

    all(erq: boolean): QuestionSet[] {
        return erq
            ? [this.biological, this.cognitive, this.sociocultural, this.abnormal]
            : [this.biological, this.cognitive, this.sociocultural];
    }

    enabled(erq: boolean): QuestionSet[] {
        const result: QuestionSet[] = [];
        for (const set of this.all(erq)) {
            if (set.enabled) {
                result.push(set);
            }
        }
        return result;
    }
}

// Set up question sets
const questionSets: QuestionSets = new QuestionSets();

/// Question types
class QuestionType {
    before: string;
    after: string;
    theoryOrModel: boolean;
    isErq: boolean;
    studyVariant: QuestionType | null;

    constructor(before: string, after: string = "") {
        this.before = before;
        this.after = after;
    }

    setTheoryOrModel(): QuestionType {
        this.theoryOrModel = true;
        return this;
    }

    saq(): QuestionType {
        this.isErq = false;
        return this;
    }

    erq(): QuestionType {
        this.isErq = true;
        return this;
    }

    setStudyVariant(studyVariant: QuestionType): QuestionType {
        this.studyVariant = studyVariant;
        return this;
    }

    apply(questions: QuestionSet): string | null {
        let topicName: string;

        if (this.theoryOrModel) {
            topicName = questions.pickTheoryOrModel();
        } else if (this.isErq) {
            topicName = questions.pickErqTopic();
        } else {
            const topic = questions.pickSaqTopic();

            if (Array.isArray(topic)) {
                // The second element is whether the topic is about studies.
                if (topic[1]) return this.studyVariant!.applyToTopic(topic[0]);
            } else {
                topicName = topic;
            }
        }
        
        if (topicName == null) {
            return null;
        }

        return this.applyToTopic(topicName);
    }

    applyToTopic(topic: string): string {
        return this.before + " " + topic + this.after + ".";
    }
}

const saqQuestionTypes: [QuestionType, number][] = [
    [new QuestionType("Explain", " with reference to " + ONE + " study").saq().setStudyVariant(new QuestionType("Explain")), 4],
    [new QuestionType("Outline " + ONE + " study about").saq().setStudyVariant(new QuestionType("Outline")), 1],
];
const erqQuestionTypes: [QuestionType, number][] = [
    [new QuestionType("Discuss").erq(), 4],
    [new QuestionType("Evaluate research about").erq(), 2],
    [new QuestionType("Evaluate").erq().setTheoryOrModel(), 1],
];

/// Math
function randomInt(max: number): number {
    return Math.floor(Math.random() * max);
}

function pick<E>(es: E[]): E {
    if (es.length == 0) return null;
    return es[randomInt(es.length)];
}

function pickFromAll<E>(arrays: E[][]): E {
    let totalLength: number = 0;
    for (const array of arrays) {
        totalLength += array.length;
    }

    let index: number = randomInt(totalLength);
    let i: number = 0;

    while (index >= arrays[i].length) {
        index -= arrays[i].length;
        i++;
    }

    return arrays[i][index];
}

function pickWeighted<E>(pairs: [E, number][]): E {
    const flat: E[] = [];

    for (const pair of pairs) {
        for (let j = 0; j < pair[1]; j++) {
            flat.push(pair[0]);
        }
    }

    return pick(flat);
}

/// Visualisation
function setQuestionHtml(html: string): void {
    document.getElementById("question").innerHTML = html;
}

function pickQuestion(questionTypes: [QuestionType, number][], questionSets: QuestionSet[]): string {
    let q: string | null = null;

    while (q == null) q = pickWeighted(questionTypes).apply(pick(questionSets));

    return q;
}

function setQuestion(questionTypes: [QuestionType, number][], erq: boolean): void {
    setQuestionHtml(pickQuestion(questionTypes, questionSets.enabled(erq)));
}

function generateSaq(): void {
    setQuestion(saqQuestionTypes, false);
}

function generateErq(): void {
    setQuestion(erqQuestionTypes, true);
}

function generateP1(): void {
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
function toggle(approach: string) {
    const set: QuestionSet = questionSets[approach];
    set.enabled = !set.enabled;

    const hlCheckbox = document.getElementById(approach + "-hl-checkbox");
    if (hlCheckbox != null) {
        (hlCheckbox as HTMLInputElement).disabled = !set.enabled;
    }

    updateButtonStatus("saq-button", false);
    updateButtonStatus("erq-button", true);
}

function toggleHl(approach: string) {
    const set: QuestionSet = questionSets[approach];
    set.hlExtension = !set.hlExtension;
}

function updateButtonStatus(id: string, erq: boolean): void {
    const questionCount = questionSets.enabled(erq).length;
    (document.getElementById(id) as HTMLButtonElement).disabled = (questionCount == 0);
}

// Set all approaches to be enabled by default
document.addEventListener("DOMContentLoaded", () => {
    const elements = document.getElementsByClassName("approach-checkbox");
    for (const checkbox of elements) {
        (checkbox as HTMLInputElement).checked = true;
    }
});
