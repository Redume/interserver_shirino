const discord = require("discord.js");
const client = new discord.Client();

let token = process.env.TOKEN;
let is = require("./data/file.json");

const fs = require("fs");

let bl = []; //ID сервер / каналов, уже не помню
let chnls = []; //ID каналов

//let chs = chnls.filter(obj=>{client.channels.cache.has(obj)})

client.on("ready", () => console.log("Ok"));

client.on("message", msg => {
  if (msg.author.bot) return;
  if(bl.indexOf(msg.author.id)!= -1) return 
  let sid = msg.guild.id;
  let uid = msg.author.id;
  let users = is.users;
  let guilds = is.guilds;
  if (bl.indexOf(uid) != -1) return;
  if (!users[uid]) {
    users[uid] = {
      isDev: false,
      color: "None",
      icons: []
    };
  }
  if (chnls.indexOf(msg.channel.id) != -1) {
    if (msg.content.length >= 2000)
      return msg.reply(`Максимальное число символов в сообщении 2000`);
    
    let text = `${msg.author.tag}`;
    if (users[uid].icons.length > 0)
      text = `${msg.author.tag} | ${users[uid].icons.map(obj => obj).join("")}`;
    let emb = new discord.MessageEmbed()
      .setThumbnail(msg.author.displayAvatarURL())
      .setTitle(text)
      .setDescription(msg.content)
      .setTimestamp();
    if (msg.attachments.size > 0) {
      emb.setImage(msg.attachments.first().url);
    }
    emb.setFooter(`${msg.guild.name}`);
    if (users[uid].color != "None") emb.setColor(users[uid].color);
    //if (msg.author.id == "444509762676326411" || "518081673812770887")
    // emb.setColor("#36393f");
    chnls
      .filter(obj => obj != msg.channel.id)
      .map(obj => {
      if(client.channels.cache.has(obj)) {
      client.channels.cache.get(obj).send(emb).then(()=>msg.react("707034550781345813"))}})
  }
  if (msg.content == "=rules") {
    msg.channel.send(">>> **Правила межсервера shirino**\n1. `Никакого спама, флуда, оффтопа, также попрошу не злоупотреблять использованием мата в своих сообщениях`\n2. `Сообщайте разработчикам об удалении канала межсервера`\n3. `Никаких ссылок, приглашений не относящихся к разговору`");
  }
  
  if (msg.content.startsWith("=setColor")) {
    if (users[uid].isDev == false) return;
    msg.delete();
    let id = msg.content.split(/ +/)[1];
    let color = msg.content.split(/ +/)[2];
    users[id].color = color;
  }
  if (msg.content.startsWith("=addDev")) {
    if (users[uid].isDev == false) return;
    msg.delete();
    let id = msg.mentions.users.first().id;
    users[id].isDev = true;
  }
  if (msg.content.startsWith("=clearIcons")) {
    if (users[uid].isDev == false) return;
    msg.delete();
    let id = msg.content.split(/ +/)[1];
    users[id] = {
      isDev: users[id].isDev,
      color:users[id].color, 
      icons: []
    };
  }
  if (msg.content.startsWith("=addIcon")) {
    //if(users[uid].icons.length+1>users[uid].max) return msg.reply("Максимальное колво значков" )
    if (users[uid].isDev == false) return msg.reply("No");

    msg.delete();
    let id = msg.content.split(/ +/)[1];
    let icon = msg.content.split(/ +/)[2];
    users[id].icons.push(icon);
  }
  fs.writeFile("./data/file.json", JSON.stringify(is), err => console.log(err));
});

client.login(token);