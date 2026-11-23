const lessons = [
  {title:"Everyday greetings",emoji:"👋",word:"HELLO",meaning:"A friendly greeting used when meeting someone.",tip:"Raise your hand and wave gently to greet someone.",category:"Communication"},
  {title:"Being thankful",emoji:"🙏",word:"THANK YOU",meaning:"A polite way to show gratitude.",tip:"Use the recognised sign for thank you in the sign language you are learning.",category:"Communication"},
  {title:"Asking for help",emoji:"🆘",word:"HELP",meaning:"Use this when you need assistance.",tip:"Practise the sign for help and learn when to use it.",category:"Daily needs"},
  {title:"Yes and no",emoji:"✅",word:"YES / NO",meaning:"Two useful responses in everyday conversation.",tip:"Practise answering simple questions using yes and no.",category:"Daily needs"},
  {title:"Asking for water",emoji:"💧",word:"WATER",meaning:"A common word used to ask for drinking water.",tip:"Practise communicating this need clearly.",category:"Daily needs"},
  {title:"Learning letters",emoji:"🔤",word:"ALPHABET",meaning:"Letters are the building blocks of written language.",tip:"Practise fingerspelling letters one at a time.",category:"Basics"}
];
const signWords = [
  ["👋","Hello","A greeting used when meeting someone."],
  ["🙏","Thank you","Used to express gratitude."],
  ["🆘","Help","Used when assistance is needed."],
  ["👍","Yes","A positive response or agreement."],
  ["🙅","No","A negative response or disagreement."],
  ["💧","Water","Used to communicate a need for water."]
];
let data = loadData();
function loadData(){try{return JSON.parse(localStorage.getItem("smartLearningProgress"))||{lessons:[],attempts:0,best:0}}catch(e){return{lessons:[],attempts:0,best:0}}}
function saveData(){localStorage.setItem("smartLearningProgress",JSON.stringify(data))}
function showPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===id));
  document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.page===id));
  if(id==="progress") renderProgress();
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.go)));

function renderLessons(){
 const grid=document.getElementById("lessonGrid");
 grid.innerHTML=lessons.map((l,i)=>`<article class="lesson-card"><div class="lesson-emoji">${l.emoji}</div><p class="eyebrow">${l.category}</p><h3>${l.title}</h3><p>${l.meaning}</p><button class="secondary" data-lesson="${i}">Open lesson</button></article>`).join("");
 grid.querySelectorAll("[data-lesson]").forEach(b=>b.addEventListener("click",()=>openLesson(Number(b.dataset.lesson))));
}
function openLesson(i){
 const l=lessons[i], box=document.getElementById("lessonDetail");
 box.classList.remove("hidden");box.classList.add("lesson-detail");
 box.innerHTML=`<p class="eyebrow">LESSON ${i+1}</p><h2>${l.title}</h2><div class="big-word">${l.emoji} ${l.word}</div><p>${l.meaning}</p><p><b>Practice tip:</b> ${l.tip}</p><button class="primary" id="completeLesson">Mark lesson as completed</button>`;
 document.getElementById("completeLesson").addEventListener("click",()=>{
   if(!data.lessons.includes(i))data.lessons.push(i);saveData();
   box.insertAdjacentHTML("beforeend",'<p class="feedback">✓ Lesson completed! Your progress has been saved.</p>');
 });
 box.scrollIntoView({behavior:"smooth",block:"nearest"});
}
renderLessons();

const signGrid=document.getElementById("signGrid");
signGrid.innerHTML=signWords.map((s,i)=>`<button class="sign-option" data-sign="${i}"><span>${s[0]}</span>${s[1]}</button>`).join("");
signGrid.querySelectorAll("[data-sign]").forEach(b=>b.addEventListener("click",()=>{
 const s=signWords[Number(b.dataset.sign)];
 document.getElementById("signMeaning").textContent=`${s[0]} ${s[1]}: ${s[2]}`;
}));

// Text-to-speech uses the speech synthesis feature built into supported browsers.
document.getElementById("speakButton").addEventListener("click",()=>{
 const text=document.getElementById("speakText").value.trim();
 const status=document.getElementById("speakStatus");
 if(!text){status.textContent="Please type a message first.";return}
 if(!("speechSynthesis" in window)){status.textContent="Text-to-speech is not supported by this browser.";return}
 window.speechSynthesis.cancel();
 const utterance=new SpeechSynthesisUtterance(text);
 utterance.onstart=()=>status.textContent="Speaking...";
 utterance.onend=()=>status.textContent="Finished speaking.";
 utterance.onerror=()=>status.textContent="Could not play the message.";
 window.speechSynthesis.speak(utterance);
});
document.getElementById("clearSpeak").addEventListener("click",()=>{
 document.getElementById("speakText").value="";
 document.getElementById("speakStatus").textContent="";
});

// Speech-to-text uses the browser Web Speech API. Chrome support is recommended.
let recognition=null;
const startBtn=document.getElementById("startSpeech"),stopBtn=document.getElementById("stopSpeech");
const speechStatus=document.getElementById("speechStatus"),speechResult=document.getElementById("speechResult");
const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
if(SpeechRecognition){
 recognition=new SpeechRecognition();recognition.continuous=true;recognition.interimResults=true;recognition.lang="en-IN";
 recognition.onstart=()=>{speechStatus.textContent="Listening... Speak into your microphone.";startBtn.disabled=true;stopBtn.disabled=false};
 recognition.onresult=(event)=>{
   let finalText="",interim="";
   for(let i=event.resultIndex;i<event.results.length;i++){
     const transcript=event.results[i][0].transcript;
     if(event.results[i].isFinal)finalText+=transcript+" ";else interim+=transcript;
   }
   const previous=speechResult.dataset.final||"";
   if(finalText){speechResult.dataset.final=previous+finalText;}
   speechResult.textContent=(speechResult.dataset.final||"")+interim;
 };
 recognition.onerror=(event)=>{speechStatus.textContent="Speech recognition error: "+event.error+". Check microphone permission and browser support.";startBtn.disabled=false;stopBtn.disabled=true};
 recognition.onend=()=>{startBtn.disabled=false;stopBtn.disabled=true;if(speechStatus.textContent.startsWith("Listening"))speechStatus.textContent="Listening stopped."};
 startBtn.addEventListener("click",()=>{speechResult.dataset.final="";speechResult.textContent="";try{recognition.start()}catch(e){speechStatus.textContent="Recognition is already running."}});
 stopBtn.addEventListener("click",()=>recognition.stop());
}else{
 startBtn.disabled=true;stopBtn.disabled=true;
 speechStatus.textContent="Speech recognition is not supported here. Open this website in Google Chrome on a supported device.";
}

// Small adaptive quiz: recommendations are based on the student's quiz result.
const questions=[
 {q:"Which word is commonly used as a greeting?",options:["Hello","Water","No"],answer:0},
 {q:"Which word do you use when you need assistance?",options:["Thank you","Help","Goodbye"],answer:1},
 {q:"Which phrase expresses gratitude?",options:["Yes","Stop","Thank you"],answer:2}
];
let qIndex=0,score=0,answered=false;
function renderQuestion(){
 const q=questions[qIndex];answered=false;
 document.getElementById("questionNumber").textContent=`Question ${qIndex+1} of ${questions.length}`;
 document.getElementById("quizScore").textContent=`Score: ${score}`;
 document.getElementById("quizBar").style.width=`${(qIndex/questions.length)*100}%`;
 document.getElementById("questionText").textContent=q.q;
 document.getElementById("answerFeedback").textContent="";
 document.getElementById("nextQuestion").disabled=true;
 document.getElementById("nextQuestion").textContent=qIndex===questions.length-1?"See result":"Next question";
 document.getElementById("quizRecommendation").classList.add("hidden");
 document.getElementById("answerOptions").innerHTML=q.options.map((o,i)=>`<button class="answer-option" data-answer="${i}">${String.fromCharCode(65+i)}. ${o}</button>`).join("");
 document.querySelectorAll("[data-answer]").forEach(b=>b.addEventListener("click",()=>chooseAnswer(Number(b.dataset.answer))));
}
function chooseAnswer(choice){
 if(answered)return;answered=true;
 const q=questions[qIndex],buttons=[...document.querySelectorAll("[data-answer]")];
 buttons.forEach((b,i)=>{b.disabled=true;if(i===q.answer)b.classList.add("correct");else if(i===choice)b.classList.add("wrong")});
 if(choice===q.answer){score++;document.getElementById("answerFeedback").textContent="Correct! Well done."}
 else document.getElementById("answerFeedback").textContent=`Not quite. The correct answer is ${q.options[q.answer]}.`;
 document.getElementById("quizScore").textContent=`Score: ${score}`;
 document.getElementById("nextQuestion").disabled=false;
}
document.getElementById("nextQuestion").addEventListener("click",()=>{
 if(!answered)return;
 if(qIndex<questions.length-1){qIndex++;renderQuestion();return}
 data.attempts++;data.best=Math.max(data.best,score);saveData();
 const rec=document.getElementById("quizRecommendation");rec.classList.remove("hidden");
 let message=score===3?"Excellent work! Try the next set of advanced vocabulary and sentence lessons.":score===2?"Good effort! Practise the everyday communication lessons and try again.":"Keep practising! Start with the basic greeting and daily-needs lessons, then retake the quiz.";
 rec.textContent=`Your result: ${score}/3. ${message}`;
 document.getElementById("quizBar").style.width="100%";
 document.getElementById("nextQuestion").disabled=true;
 document.getElementById("nextQuestion").textContent="Quiz completed";
});
document.getElementById("restartQuiz").addEventListener("click",()=>{qIndex=0;score=0;renderQuestion()});
renderQuestion();

function renderProgress(){
 document.getElementById("lessonsCount").textContent=data.lessons.length;
 document.getElementById("quizAttempts").textContent=data.attempts;
 document.getElementById("bestScore").textContent=`${data.best}/3`;
 const pct=Math.round((data.lessons.length/lessons.length)*100);
 document.getElementById("overallBar").style.width=pct+"%";
 document.getElementById("progressMessage").textContent=data.lessons.length===0&&data.attempts===0?"Complete a lesson or quiz to see your progress here.":`You have completed ${data.lessons.length} of ${lessons.length} lessons and attempted the quiz ${data.attempts} time(s). Keep learning!`;
}
document.getElementById("resetProgress").addEventListener("click",()=>{
 if(confirm("Are you sure you want to reset all saved progress?")){data={lessons:[],attempts:0,best:0};saveData();renderProgress()}
});
renderProgress();
