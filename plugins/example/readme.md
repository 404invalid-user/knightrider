# example plugin for knightrider 

this is an example plugin for the bot knightrider that includes examples for developers to develop their own plugins.


### whats included:
 - example message events 
   - for eg a plugin that tracks users activety
   - for message commands using the bots predefined prefix or a custom one
 - webserver api and example pages
   - an example of how you can make a custom page on the website i ask you to follow the general theme to make it easy for people but you can go crazy  if you want
 - slash command with sub command examples 






a little details on the bot

you need to have the folder name and name in config.json the same

you only get one base route on the website that is the name of your plugin 

your slash command is the same name as your plugin it gets the description from slashDescription in config.json

each file you put in ./slashCommand/subCommands will be added as a sub command to your slash command with the same name as the file if you want to give it a description you will add it at the top of the file like so

```js
module.exports.description = "my sub command";
```


every event will have a database object this will contain a few thing depending on what it is

user 
guild

get
new


as you can see there is a database.js file this is your tables scema each plugin can make its own table then access, create, and update data in it

we use squliser so look at their docs on how to make a table this is also direct table access so if you mess something up you will make the bot error 

alternatively you could use your own sqlite db or some other database up to you