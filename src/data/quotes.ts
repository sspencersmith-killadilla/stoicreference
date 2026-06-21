export type Quote = {
  id: string;
  text: string;
  author: "Marcus Aurelius" | "Seneca" | "Epictetus" | "Musonius Rufus";
  work: string;
  section: string;
  translator?: string;
  themes: string[];
};

export const QUOTES: Quote[] = [
  // Marcus Aurelius — Meditations
  { id: "ma-2-1", text: "Begin the morning by saying to thyself, I shall meet with the busy-body, the ungrateful, arrogant, deceitful, envious, unsocial.", author: "Marcus Aurelius", work: "Meditations", section: "2.1", translator: "George Long", themes: ["anger","adversity","others"] },
  { id: "ma-4-3", text: "Men seek retreats for themselves, houses in the country, sea-shores, and mountains... But this is altogether a mark of the most common sort of men, for it is in thy power whenever thou shalt choose to retire into thyself.", author: "Marcus Aurelius", work: "Meditations", section: "4.3", translator: "George Long", themes: ["control","time","inner-life"] },
  { id: "ma-4-7", text: "Take away thy opinion, and then there is taken away the complaint, 'I have been harmed.' Take away the complaint, and the harm is taken away.", author: "Marcus Aurelius", work: "Meditations", section: "4.7", translator: "George Long", themes: ["control","anger","perception"] },
  { id: "ma-5-1", text: "At dawn, when you have trouble getting out of bed, tell yourself: 'I have to go to work — as a human being.'", author: "Marcus Aurelius", work: "Meditations", section: "5.1", translator: "Gregory Hays", themes: ["duty","virtue","time"] },
  { id: "ma-6-30", text: "Take care not to be Caesarified, or dyed with purple; for it does happen. Keep thyself then simple, good, pure, serious, free from affectation.", author: "Marcus Aurelius", work: "Meditations", section: "6.30", translator: "George Long", themes: ["virtue","power"] },
  { id: "ma-7-22", text: "It is a man's special privilege to love even those who wrong him.", author: "Marcus Aurelius", work: "Meditations", section: "7.22", translator: "Maxwell Staniforth", themes: ["anger","others","virtue"] },
  { id: "ma-8-47", text: "If you are distressed by anything external, the pain is not due to the thing itself, but to your estimate of it; and this you have the power to revoke at any moment.", author: "Marcus Aurelius", work: "Meditations", section: "8.47", translator: "George Long", themes: ["control","perception","adversity"] },
  { id: "ma-9-6", text: "Your present opinion founded on understanding, your present conduct directed to social good, your present disposition contented with everything that happens — that is enough.", author: "Marcus Aurelius", work: "Meditations", section: "9.6", translator: "Maxwell Staniforth", themes: ["fate","virtue","contentment"] },
  { id: "ma-10-16", text: "Waste no more time arguing what a good man should be. Be one.", author: "Marcus Aurelius", work: "Meditations", section: "10.16", translator: "Gregory Hays", themes: ["virtue","action"] },
  { id: "ma-12-1", text: "Everything you're trying to reach — by taking the long way round — you could have right now, this moment. If you'd only stop thwarting your own attempts.", author: "Marcus Aurelius", work: "Meditations", section: "12.1", translator: "Gregory Hays", themes: ["time","virtue","desire"] },
  { id: "ma-2-17", text: "Of human life the time is a point, the substance flowing, the perception dull... The only thing that escorts a man on his way is philosophy.", author: "Marcus Aurelius", work: "Meditations", section: "2.17", translator: "George Long", themes: ["death","time","philosophy"] },
  { id: "ma-4-17", text: "Do not act as if thou wert going to live ten thousand years. Death hangs over thee. While thou livest, while it is in thy power, be good.", author: "Marcus Aurelius", work: "Meditations", section: "4.17", translator: "George Long", themes: ["death","time","virtue"] },

  // Seneca — Letters & essays
  { id: "se-ep-1", text: "Nothing, Lucilius, is ours, except time... Hold every hour in your grasp. Lay hold of today's task, and you will not need to depend so much upon tomorrow's.", author: "Seneca", work: "Letters to Lucilius", section: "Letter 1", translator: "Richard Gummere", themes: ["time","action"] },
  { id: "se-ep-13", text: "We suffer more often in imagination than in reality.", author: "Seneca", work: "Letters to Lucilius", section: "Letter 13", translator: "Richard Gummere", themes: ["fear","anxiety","perception"] },
  { id: "se-ep-16", text: "It is not the man who has too little, but the man who craves more, that is poor.", author: "Seneca", work: "Letters to Lucilius", section: "Letter 16", translator: "Richard Gummere", themes: ["desire","wealth","contentment"] },
  { id: "se-ep-26", text: "It is not that we have a short time to live, but that we waste a lot of it.", author: "Seneca", work: "On the Shortness of Life", section: "1.1", translator: "John W. Basore", themes: ["time","death"] },
  { id: "se-ep-47", text: "They are slaves. No, they are men. They are slaves. No, comrades.", author: "Seneca", work: "Letters to Lucilius", section: "Letter 47", translator: "Richard Gummere", themes: ["others","virtue","equality"] },
  { id: "se-ep-78", text: "Sometimes even to live is an act of courage.", author: "Seneca", work: "Letters to Lucilius", section: "Letter 78", translator: "Richard Gummere", themes: ["courage","adversity"] },
  { id: "se-ep-91", text: "He robs present ills of their power who has perceived their coming beforehand.", author: "Seneca", work: "Letters to Lucilius", section: "Letter 91", translator: "Richard Gummere", themes: ["adversity","preparation","fear"] },
  { id: "se-ep-101", text: "Let us order our minds as if we had come to the very end. Let us postpone nothing.", author: "Seneca", work: "Letters to Lucilius", section: "Letter 101", translator: "Richard Gummere", themes: ["death","time","action"] },
  { id: "se-tr-2", text: "It is the power of the mind to be unconquerable.", author: "Seneca", work: "On Tranquility of Mind", section: "II", translator: "John W. Basore", themes: ["control","adversity"] },
  { id: "se-ang-1", text: "The greatest remedy for anger is delay.", author: "Seneca", work: "On Anger", section: "II.29", translator: "John W. Basore", themes: ["anger","patience"] },
  { id: "se-prov-2", text: "A gem cannot be polished without friction, nor a man perfected without trials.", author: "Seneca", work: "On Providence", section: "5", translator: "Aubrey Stewart", themes: ["adversity","virtue","fate"] },
  { id: "se-brev-3", text: "You live as if you were destined to live forever; no thought of your frailty ever enters your head.", author: "Seneca", work: "On the Shortness of Life", section: "3", translator: "John W. Basore", themes: ["death","time"] },

  // Epictetus — Enchiridion & Discourses
  { id: "ep-en-1", text: "Some things are up to us, and some are not up to us. Up to us are opinion, motivation, desire, aversion... not up to us are body, property, reputation, public office.", author: "Epictetus", work: "Enchiridion", section: "1", translator: "Robin Hard", themes: ["control","dichotomy-of-control"] },
  { id: "ep-en-5", text: "Men are disturbed not by the things which happen, but by the opinions about the things.", author: "Epictetus", work: "Enchiridion", section: "5", translator: "George Long", themes: ["perception","control","anger"] },
  { id: "ep-en-8", text: "Do not seek to have events happen as you wish, but wish them to happen as they do happen, and your life will go on well.", author: "Epictetus", work: "Enchiridion", section: "8", translator: "George Long", themes: ["fate","desire","control"] },
  { id: "ep-en-11", text: "Never say of anything, 'I have lost it'; but, 'I have returned it.' Is your child dead? It is returned.", author: "Epictetus", work: "Enchiridion", section: "11", translator: "Elizabeth Carter", themes: ["loss","grief","fate"] },
  { id: "ep-en-20", text: "Remember that it is not he who gives abuse or strikes you who insults you, but it is your opinion about these things as being insulting.", author: "Epictetus", work: "Enchiridion", section: "20", translator: "George Long", themes: ["anger","others","perception"] },
  { id: "ep-en-33", text: "Lay down for yourself, at the outset, a certain stamp and character for yourself, which you shall preserve whether you are by yourself or with others.", author: "Epictetus", work: "Enchiridion", section: "33", translator: "Thomas Higginson", themes: ["virtue","character"] },
  { id: "ep-en-43", text: "Everything has two handles, the one by which it may be borne, the other by which it cannot. If your brother acts unjustly, do not lay hold on the action by the handle of his injustice... but by the opposite — that he is your brother.", author: "Epictetus", work: "Enchiridion", section: "43", translator: "Thomas Higginson", themes: ["perception","others","anger"] },
  { id: "ep-dis-2-5", text: "It is not events that disturb people, it is their judgements concerning them.", author: "Epictetus", work: "Discourses", section: "II.5", translator: "Robin Hard", themes: ["control","perception"] },
  { id: "ep-dis-1-1", text: "I must die. Must I then die lamenting? I must be put in chains. Must I then also lament? I must go into exile. Does any man then hinder me from going with smiles and cheerfulness?", author: "Epictetus", work: "Discourses", section: "I.1", translator: "George Long", themes: ["death","courage","fate"] },
  { id: "ep-en-15", text: "Remember that you are an actor in a play, the character of which is determined by the playwright... Your business is to act the part well that is given to you.", author: "Epictetus", work: "Enchiridion", section: "17", translator: "Thomas Higginson", themes: ["fate","duty","virtue"] },

  // Musonius Rufus — Lectures
  { id: "mu-3", text: "We will not look at what is sweet, but at what is good.", author: "Musonius Rufus", work: "Lectures", section: "III", translator: "Cynthia King", themes: ["virtue","desire"] },
  { id: "mu-6", text: "It is not possible to live well today unless one thinks of it as one's last.", author: "Musonius Rufus", work: "Lectures", section: "VI", translator: "Cynthia King", themes: ["death","time"] },
  { id: "mu-9", text: "Exile does not deprive us of any of the things which we really possess: water, earth, air, the sun, the moon, friends, family, and most of all virtue.", author: "Musonius Rufus", work: "Lectures", section: "IX", translator: "Cynthia King", themes: ["adversity","loss","virtue"] },
  { id: "mu-10", text: "If one accomplishes some good though with toil, the toil passes, but the good remains; if one does something dishonorable with pleasure, the pleasure passes, but the dishonor remains.", author: "Musonius Rufus", work: "Lectures", section: "X", translator: "Cynthia King", themes: ["virtue","desire","action"] },
];