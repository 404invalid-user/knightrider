function loadroles() {
    //lmao js
    var rrstr = '<ul class="filterul">';
    reactionRoles.forEach(function(role) {
        server.roles.forEach(r => {
            if (role.roleID == r.id) {
                server.channels.forEach(chan => {
                    if (role.channelID == chan.id) {
                        rrstr += '<li>Channel: ' + chan.name + ' Role id: ' + r.name + ' emoji: ' + role.emoji + '</li><br>';
                    }
                })
            }
        })
    });
    rrstr += '</ul>';
    document.getElementById("ReactionRoles").innerHTML = rrstr;
}


async function addReactionRole() {
    document.getElementById("info").innerHTML = ''
    var channel = document.getElementById('ReactionRoleChannel').value.toLowerCase().replace(' ', '')
    var role = document.getElementById('ReactionRole').value.toLowerCase().replace(' ', '');
    var emoji = document.getElementById('ReactionRoleEmoji').value;

    await reactionRoles.push({ channelID: channel, roleID: role, emoji: emoji });

    loadroles()

    document.getElementById('ReactionRoleChannel').value = '';
    document.getElementById('ReactionRole').value = '';
    document.getElementById('ReactionRoleEmoji').value = '';
}

async function removeReactionRole() {
    document.getElementById("info").innerHTML = ''
    var role = document.getElementById('ReactionRole').value.toLowerCase().replace(' ', '');
    var channel = document.getElementById('ReactionRoleChannel').value.toLowerCase().replace(' ', '')

    for (let i = 0; i < reactionRoles.length; i++) {

        if (reactionRoles[i].channelID == channel) {
            if (reactionRoles[i].roleID == role) {
                reactionRoles.splice(i, 1);
                loadroles()
                document.getElementById('ReactionRoleChannel').value = '';
                document.getElementById('ReactionRole').value = '';
                document.getElementById('ReactionRoleEmoji').value = '';

            };
        };
    };
}

async function sendupdate() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", domain + '/api/updatereactionroles', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader("access-control-allow-origin", "*");
    await xhr.send(JSON.stringify({
        user: user,
        server: currentServer,
        reactionRoles: reactionRoles
    }));
    document.getElementById("info").innerHTML = "ReactionRoles have been updated."
}
loadroles()