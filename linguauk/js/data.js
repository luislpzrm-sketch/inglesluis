const DATA = {

  grammarQuestions: [
    {
      track: 'General', color: '#5F5E5A',
      type: 'Grammar · UK English',
      q: 'Choose the correct sentence a British person would say:',
      opts: ['I have been living in London since five years.', 'I have lived in London for five years.', 'I live in London since five years.', 'I am living in London for five years.'],
      c: 1,
      f: '"For" + duration, "since" + starting point. Present perfect + "for" is the natural British form. This is one of the most common errors for Spanish speakers.'
    },
    {
      track: 'General', color: '#5F5E5A',
      type: 'US → British English',
      q: 'You need to throw something away in the UK. You look for the:',
      opts: ['Trash can', 'Garbage bin', 'Rubbish bin', 'Waste basket'],
      c: 2,
      f: '"Rubbish bin" is standard British English. "Trash" and "garbage" are American — people understand but you\'ll sound foreign. Other common ones: "shop" not "store", "post" not "mail".'
    },
    {
      track: 'General', color: '#5F5E5A',
      type: 'British register',
      q: 'Your UK flatmate says: "Could you not leave your stuff on the sofa?" They mean:',
      opts: ['They\'re asking if you\'re able to move it', 'Please don\'t leave your stuff there', 'They don\'t mind where you leave it', 'They want to know if you have stuff'],
      c: 1,
      f: 'Classic British indirect request. "Could you not..." is a polite but firm way of saying "please stop doing that". Much more common than a direct command in British culture.'
    },
    {
      track: 'Veterinary', color: '#0F6E56',
      type: 'Clinical English',
      q: 'A client says their dog has been "off its food" for two days. This means:',
      opts: ['The dog ate spoiled food', 'The dog has not been eating well', 'The dog is food aggressive', 'The dog has been vomiting food'],
      c: 1,
      f: '"Off its food" is a very common British expression for reduced appetite or not eating. You\'ll hear this constantly from clients. Also: "off-colour" = feeling unwell, "peaky" = looking ill.'
    },
    {
      track: 'Veterinary', color: '#0F6E56',
      type: 'Clinical communication',
      q: 'Complete what a UK vet would say: "We\'re going to run _____ to check her kidney function."',
      opts: ['an exam', 'some tests', 'a blood', 'some analysis'],
      c: 1,
      f: '"Run some tests" or "run a blood panel" is natural clinical English. "Do some tests" also works. "Analysis" sounds overly formal or translated. "Run" is the standard verb in clinical contexts.'
    },
    {
      track: 'Veterinary', color: '#0F6E56',
      type: 'Clinical notes',
      q: 'In a UK clinical record, "BAR" as a patient status means:',
      opts: ['Below average response', 'Bright, alert and responsive', 'Breathing and reacting', 'Basic assessment result'],
      c: 1,
      f: 'BAR (Bright, Alert, Responsive) is standard in English-language clinical notes. Also: QAR (Quiet, Alert, Responsive) for a slightly subdued but stable patient. These are universal in UK practice.'
    },
    {
      track: 'Tech', color: '#185FA5',
      type: 'Dev culture',
      q: 'In a code review, a colleague comments "nit: maybe rename this variable". They mean:',
      opts: ['This is a critical bug that must be fixed', 'A small, optional style suggestion', 'The variable name causes a bug', 'They want to rewrite the entire function'],
      c: 1,
      f: '"Nit" (nitpick) = a minor, often optional suggestion about style or naming. Not blocking. Other common review terms: "blocking" (must fix), "suggestion" (optional), "LGTM" (looks good to me, approve).'
    },
    {
      track: 'Tech', color: '#185FA5',
      type: 'UK workplace English',
      q: 'Your tech lead says "let\'s table this for now" in a UK team meeting. They mean:',
      opts: ['Let\'s discuss it right now', 'Let\'s postpone it for later', 'Let\'s delete it from the backlog', 'Let\'s document it immediately'],
      c: 1,
      f: 'Critical difference: in British English "table" = postpone/set aside. In American English it means the opposite (bring to the table = discuss now). Easy to misread in a UK team. Very important!'
    },
    {
      track: 'Tech', color: '#185FA5',
      type: 'Professional writing',
      q: 'Which is the most natural Slack message to your UK dev team?',
      opts: ['I will work in this feature since tomorrow.', 'I\'ll be picking up this feature from tomorrow.', 'I work on this feature from tomorrow on.', 'I am going to work this feature starting tomorrow.'],
      c: 1,
      f: '"Pick up" a task is natural workplace English. "From tomorrow" is clean British phrasing. The others have preposition or tense errors typical for Spanish speakers. "I\'ll be..." is more natural than "I will" in casual UK workplace communication.'
    },
    {
      track: 'General', color: '#5F5E5A',
      type: 'Listening comprehension',
      q: 'A UK landlord texts you: "The boiler\'s on the blink again — rung the engineer, he should be round Thursday-ish." What happened?',
      opts: ['The boiler was incorrectly installed', 'The boiler is broken and a repair visit is scheduled', 'You need to call the engineer yourself', 'There is a problem with the blink sensor'],
      c: 1,
      f: '"On the blink" = broken/not working. "Ring" = call (British). "Round" = coming to your place. "Thursday-ish" = approximately Thursday. This is typical informal British texting style you\'ll receive constantly.'
    },
  ],

  vocabCards: [
    {
      word: 'Knackered', phonetic: '/ˈnækəd/', track: 'General', color: '#5F5E5A',
      def: 'Extremely tired, exhausted.',
      ex: '"After a double shift at the practice I was absolutely knackered."',
      us: 'Exhausted / wiped out'
    },
    {
      word: 'Fortnight', phonetic: '/ˈfɔːtnaɪt/', track: 'General', color: '#5F5E5A',
      def: 'A period of two weeks.',
      ex: '"The follow-up appointment is in a fortnight."',
      us: 'Two weeks (Americans never say "fortnight")'
    },
    {
      word: 'Moggy', phonetic: '/ˈmɒɡi/', track: 'Veterinary', color: '#0F6E56',
      def: 'Informal British word for a domestic cat, especially a non-pedigree one.',
      ex: '"The owner brought her moggy in for a routine vaccination."'
    },
    {
      word: 'Off-colour', phonetic: '/ɒf ˈkʌlə/', track: 'Veterinary', color: '#0F6E56',
      def: 'Feeling slightly unwell, not at one\'s best.',
      ex: '"The owner says the dog has been a bit off-colour since yesterday — reduced appetite and lethargy."',
      us: '"Under the weather" or just "not feeling well"'
    },
    {
      word: 'Prognosis', phonetic: '/prɒɡˈnəʊsɪs/', track: 'Veterinary', color: '#0F6E56',
      def: 'The likely course of a disease or condition; the prospect of recovery.',
      ex: '"I have to be honest with you — the prognosis for this type of lymphoma is unfortunately quite guarded."'
    },
    {
      word: 'Refactor', phonetic: '/riːˈfæktə/', track: 'Tech', color: '#185FA5',
      def: 'Restructure existing code without changing its external behaviour. To improve code quality without adding features.',
      ex: '"Before we add the new auth flow, we need to refactor the user model — it\'s getting messy."'
    },
    {
      word: 'Technical debt', phonetic: '/ˈteknɪkəl det/', track: 'Tech', color: '#185FA5',
      def: 'The implied cost of additional work caused by choosing an easy/quick solution now instead of a better approach that would take longer.',
      ex: '"We shipped fast but we\'ve accumulated a lot of technical debt — the next sprint should address that."'
    },
    {
      word: 'Cheeky', phonetic: '/ˈtʃiːki/', track: 'General', color: '#5F5E5A',
      def: 'Slightly disrespectful but in a charming or amusing way. Also used positively to mean doing something slightly naughty but fun.',
      ex: '"Fancy a cheeky pint after the practice closes?" / "That was a cheeky move in the code review."',
      us: 'Sassy / bold — but in British English it\'s often affectionate'
    },
    {
      word: 'Dysuria', phonetic: '/dɪsˈjʊəriə/', track: 'Veterinary', color: '#0F6E56',
      def: 'Painful or difficult urination. Common presenting complaint in cats with FLUTD.',
      ex: '"The cat is showing signs of dysuria and haematuria — suspect feline idiopathic cystitis."'
    },
    {
      word: 'Sprint', phonetic: '/sprɪnt/', track: 'Tech', color: '#185FA5',
      def: 'In agile development, a fixed time period (usually 1-2 weeks) during which specific work must be completed.',
      ex: '"We\'ll pick this up in the next sprint — it\'s not in scope for this one."'
    },
    {
      word: 'Brilliant', phonetic: '/ˈbrɪliənt/', track: 'General', color: '#5F5E5A',
      def: 'In everyday British English, "brilliant" often simply means "great" or "fine" — not necessarily spectacular.',
      ex: '"Can you send me the report by Thursday?" "Brilliant, no problem."',
      us: '"Great" / "Awesome" — Americans would find British "brilliant" overused'
    },
    {
      word: 'Murmur', phonetic: '/ˈmɜːmə/', track: 'Veterinary', color: '#0F6E56',
      def: 'An abnormal heart sound heard through a stethoscope, caused by turbulent blood flow.',
      ex: '"On auscultation I detected a grade 3/6 systolic murmur — we should discuss cardiac referral."'
    },
  ],

  speakingPhrases: [
    {
      track: 'General', color: '#5F5E5A',
      label: 'Everyday British phrase',
      phrase: 'The boiler\'s on the blink again — I\'ve already rung the landlord about it.',
      tip: 'Focus on: "blink" (bliŋk), "rung" (rʌŋ) — past tense of "ring" in British English'
    },
    {
      track: 'Veterinary', color: '#0F6E56',
      label: 'Clinical pronunciation',
      phrase: 'The patient presented with acute gastroenteritis and mild dehydration.',
      tip: 'Focus on: "gastroenteritis" (ˌɡæstrəʊˌentəˈraɪtɪs) — stress on -rai-tis'
    },
    {
      track: 'Tech', color: '#185FA5',
      label: 'Tech meeting phrase',
      phrase: 'I\'ll pick that up after the sprint review — let\'s park it for now.',
      tip: 'Natural rhythm: emphasis on "pick UP", "sprint RE-view", "park IT"'
    },
    {
      track: 'Veterinary', color: '#0F6E56',
      label: 'Client communication',
      phrase: 'I\'d like to keep her in for observation overnight, if that\'s alright with you.',
      tip: 'British vets use "alright with you" to soften clinical decisions — very important with worried owners'
    },
    {
      track: 'General', color: '#5F5E5A',
      label: 'Social British English',
      phrase: 'Shall we grab a coffee after the standup? There\'s a decent place just round the corner.',
      tip: '"Shall we" is very British. "Round the corner" not "around the corner". "Decent" = good/acceptable'
    },
    {
      track: 'Tech', color: '#185FA5',
      label: 'Code review language',
      phrase: 'This is a nit, but I think we could make this function name a bit more descriptive.',
      tip: '"A bit more" is quintessentially British understatement. Direct equivalent of "much more"'
    },
  ],

  roleplayScenarios: [
    {
      id: 'vet-client',
      name: 'Worried dog owner',
      track: 'Veterinary',
      color: '#0F6E56',
      badgeBg: '#E1F5EE',
      preview: 'Golden Retriever, limping since yesterday, owner very worried...',
      system: `You are a worried British dog owner. Your Golden Retriever called Biscuit has been limping on his front left leg for 2 days and won't put weight on it. You are speaking to a vet at the consultation.

Be realistic: use everyday British expressions (not medical terms), show genuine worry, ask the questions a real pet owner would ask. Use expressions like "he's just not himself", "I'm ever so worried", "will he be alright?". Keep responses to 2-3 sentences. Speak only in English.`,
      opening: "Hello, I'm ever so worried about my dog Biscuit. He's been limping on his front leg since yesterday morning and won't put any weight on it at all — is it serious?"
    },
    {
      id: 'tech-standup',
      name: 'Morning standup',
      track: 'Tech',
      color: '#185FA5',
      badgeBg: '#E6F1FB',
      preview: 'Daily standup with your UK dev team, senior dev asking for updates...',
      system: `You are a British senior developer called James running a morning standup. The user is a new team member who has just joined from Spain. Be professional but casual and friendly. Use real dev workplace language naturally: "blockers", "picking up", "sprint", "backlog", etc. Ask about what they did yesterday, what they're working on today, and if they have any blockers. Keep responses short and realistic. Speak only in English.`,
      opening: "Morning! Right, let's crack on — what did you get done yesterday, and what are you picking up today?"
    },
    {
      id: 'uk-landlord',
      name: 'Flat viewing in London',
      track: 'General',
      color: '#633806',
      badgeBg: '#FAEEDA',
      preview: 'Viewing a flat in London, landlord asking about your situation...',
      system: `You are a London landlord showing a one-bedroom flat in Hackney to a prospective tenant who has just moved from Spain and works as a vet. Be friendly but business-like. Use British expressions naturally. Ask about employment contract, references, and when they want to move in. Mention things like council tax, the letting agency, deposit. Keep responses short and realistic. Speak only in English.`,
      opening: "Hi there, come in! So you're looking to move in from the first of July, is that right? Have you rented in London before, or would this be your first time?"
    },
    {
      id: 'vet-colleague',
      name: 'Handover with a colleague',
      track: 'Veterinary',
      color: '#0F6E56',
      badgeBg: '#E1F5EE',
      preview: 'End-of-shift handover with a UK vet colleague...',
      system: `You are a British vet nurse called Sophie doing an end-of-shift handover at a mixed practice in Bristol. The user is the incoming vet taking over. Ask about specific patients, medications due, and anything that needs monitoring overnight. Use clinical abbreviations naturally (BAR, QAR, TPR, etc.) and British clinical communication style. Keep responses concise and professional. Speak only in English.`,
      opening: "Hi, glad you're here — it's been a busy one. So, we've got three inpatients to hand over. Shall I start with the spaniel in bay 2? He's the most pressing."
    },
  ],

  usukPairs: [
    { us: 'Trash can', uk: 'Rubbish bin', context: 'When telling clients what to do with medication packaging.' },
    { us: 'Elevator', uk: 'Lift', context: 'The vet practice is on the 2nd floor — tell the client where to go.' },
    { us: 'Apartment', uk: 'Flat', context: 'When your UK colleagues ask where you live.' },
    { us: 'Vacation', uk: 'Holiday', context: '"I\'m off on ___ next week."' },
    { us: 'Drugstore / pharmacy', uk: 'Chemist', context: 'Where to send clients to collect prescriptions.' },
    { us: 'Cell phone', uk: 'Mobile', context: '"Can I take your ___ number?"' },
    { us: 'Sidewalk', uk: 'Pavement', context: '"Be careful on the ___ — it\'s icy today."' },
    { us: 'Schedule', uk: 'Diary / Timetable', context: '"Check my ___ for a free appointment slot."' },
    { us: 'Gotten', uk: 'Got', context: '"I\'ve got / I\'ve ___ better" — British English uses "got".' },
    { us: 'Fall', uk: 'Autumn', context: '"The practice gets very busy in ___."' },
    { us: 'Freeway / Highway', uk: 'Motorway', context: '"Take the ___ north towards Birmingham."' },
    { us: 'Truck', uk: 'Lorry', context: 'Large vehicle on the road.' },
    { us: 'Mom', uk: 'Mum', context: '"Is it OK if I call your ___ to discuss the treatment?"' },
    { us: 'Band-aid', uk: 'Plaster', context: 'Small wound dressing.' },
    { us: 'Can I get...', uk: 'Could I have...', context: 'Ordering in a café or asking for something politely.' },
    { us: 'Pants', uk: 'Trousers (pants = underwear!)', context: 'Very important — "pants" in the UK means underwear.' },
  ],

  trackDetails: [
    {
      name: 'General UK',
      level: 'B2',
      color: '#888780',
      desc: 'Daily life, culture, bureaucracy, social English',
      pct: 62,
      subgoals: [
        { name: 'NHS & GP registration', level: 'B2' },
        { name: 'Renting a flat', level: 'B1+' },
        { name: 'British idioms & expressions', level: 'B1' },
        { name: 'Regional UK accents', level: 'A2+' },
        { name: 'Formal correspondence', level: 'B2' },
      ]
    },
    {
      name: 'Veterinary clinical',
      level: 'B1',
      color: '#1D9E75',
      desc: 'Dog & cat consultations, clinical notes, client comms',
      pct: 38,
      subgoals: [
        { name: 'Client communication', level: 'B1+' },
        { name: 'Clinical terminology', level: 'B1' },
        { name: 'Clinical notes in English', level: 'A2+' },
        { name: 'Emergency scenarios', level: 'A2' },
        { name: 'Referral letters', level: 'B1' },
      ]
    },
    {
      name: 'Tech & Dev',
      level: 'B1',
      color: '#378ADD',
      desc: 'Dev, AI, certifications, remote teams, interviews',
      pct: 35,
      subgoals: [
        { name: 'Code review language', level: 'B2' },
        { name: 'Tech interview English', level: 'B1' },
        { name: 'Slack / async comms', level: 'B1+' },
        { name: 'Technical documentation', level: 'B1' },
        { name: 'Certification exam English', level: 'B1' },
      ]
    },
    {
      name: 'US → UK',
      level: 'Custom',
      color: '#D85A30',
      desc: 'Deamericanise vocabulary, pronunciation & register',
      pct: 20,
      subgoals: [
        { name: 'Vocabulary differences', level: 'In progress' },
        { name: 'Vowel sounds (US vs UK)', level: 'In progress' },
        { name: 'British vs American register', level: 'In progress' },
        { name: 'Spelling differences', level: 'To start' },
      ]
    },
  ],

  plan: [
    { month: 'Jun – Jul 2026', focus: 'Vocabulary intensive across 3 tracks · Deamericanise · British listening daily', current: true },
    { month: 'Aug – Sep 2026', focus: 'Speaking 50% of session time · Vet & tech simulations · Role play AI' },
    { month: 'Oct – Nov 2026', focus: 'Regional UK accents · Professional writing · Real technical texts' },
    { month: 'Dec – Jan 2027', focus: 'Full simulations: consultation, tech interview, day in UK life' },
  ]
};
