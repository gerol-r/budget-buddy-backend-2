const avatars = [
  "https://api.dicebear.com/9.x/bottts/svg?seed=Vivian",

  "https://api.dicebear.com/9.x/bottts/svg?seed=Aidan",

  "https://api.dicebear.com/9.x/bottts/svg?seed=Ryker",

  "https://api.dicebear.com/9.x/bottts/svg?seed=Sophia",

  "https://api.dicebear.com/9.x/bottts/svg?seed=Brian",

  "https://api.dicebear.com/9.x/bottts/svg?seed=Jocelyn",

  "https://api.dicebear.com/9.x/bottts/svg?seed=Eden",

  "https://api.dicebear.com/9.x/bottts/svg?seed=Kingston",

  "https://api.dicebear.com/9.x/bottts/svg?seed=Avery",

  "https://api.dicebear.com/9.x/bottts/svg?seed=Amaya",

  "https://api.dicebear.com/9.x/bottts/svg?seed=Andrea",

  "https://api.dicebear.com/9.x/bottts/svg?seed=Destiny",

  "https://api.dicebear.com/9.x/bottts/svg?seed=Easton",

  "https://api.dicebear.com/9.x/bottts/svg?seed=Leo",

  "https://api.dicebear.com/9.x/bottts/svg?seed=Valentina",

  "https://api.dicebear.com/9.x/bottts/svg?seed=Liam",

  "https://api.dicebear.com/9.x/bottts/svg?seed=Jack",

  "https://api.dicebear.com/9.x/bottts/svg?seed=Kimberly",

  "https://api.dicebear.com/9.x/bottts/svg?seed=Wyatt",

  "https://api.dicebear.com/9.x/bottts/svg?seed=Aiden",
];

const getrandomavatar = () => avatars[Math.floor(Math.random() * avatars.length)];
module.exports = { getrandomavatar };
