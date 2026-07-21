const fs = require('fs');
const filePath = 'D:/Venture Builder/CS25.json';

const raw = fs.readFileSync(filePath, 'utf-8');
const json = JSON.parse(raw);

let converted = 0;
json.questions = json.questions.map(q => {
  if (q.negativeMarks === undefined) q.negativeMarks = 0;

  if (q.type === 'NAT') {
    const natFrom = q.answer.min;
    const natTo   = q.answer.max;
    delete q.answer;
    q.options       = [];
    q.correctAnswer = null;
    q.natAnswerFrom = natFrom;
    q.natAnswerTo   = natTo;
    converted++;
  }
  return q;
});

fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf-8');

const natCount = json.questions.filter(q => q.type === 'NAT').length;
const mcqCount = json.questions.filter(q => q.type === 'MCQ').length;
const msqCount = json.questions.filter(q => q.type === 'MSQ').length;
console.log(`✅ Done! Converted ${converted} NAT questions.`);
console.log(`   Total: ${json.questions.length} | MCQ: ${mcqCount} | MSQ: ${msqCount} | NAT: ${natCount}`);
