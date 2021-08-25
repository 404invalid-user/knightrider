var normalstr = '<ul class="filterul">'
staffids.forEach(function(word) {
    normalstr += '<li>' + word + '</li>';
});
normalstr += '</ul>';
document.getElementById("staffids").innerHTML = normalstr;


async function addToStaffids() {
    document.getElementById("info").innerHTML = ''
    var newWord = document.getElementById('staffidsInput').value.toLowerCase()

    await staffids.push(newWord)

    var str = '<ul class="filterul">'

    staffids.forEach(function(word) {
        str += '<li>' + word + '</li>';
    });

    str += '</ul>';
    document.getElementById("staffids").innerHTML = str;
    document.getElementById('staffidsInput').value = ""

}

async function removeStaffids() {
    document.getElementById("info").innerHTML = ''
    var newWord = document.getElementById('staffidsInput').value.toLowerCase()
    const index = staffids.indexOf(newWord);
    if (index > -1) {
        staffids.splice(index, 1);
        var str = '<ul class="filterul">'

        staffids.forEach(function(word) {
            str += '<li>' + word + '</li>';
        });

        str += '</ul>';
        document.getElementById("staffids").innerHTML = str;
        document.getElementById('staffidsInput').value = ""
    } else {
        document.getElementById('staffidsInput').value = ""
    }
}

var safestr = '<ul class="filterul">'

staffRoles.forEach(function(word) {
    safestr += '<li>' + word + '</li>';
});

safestr += '</ul>';
document.getElementById("staffRoles").innerHTML = safestr;

async function addToStaffRoles() {
    document.getElementById("info").innerHTML = ''
    var newWord = document.getElementById('staffRolesInput').value

    await staffRoles.push(newWord)

    var str = '<ul class="filterul">'

    staffRoles.forEach(function(word) {
        str += '<li>' + word + '</li>';
    });

    str += '</ul>';
    document.getElementById("staffRoles").innerHTML = str;
    document.getElementById('staffRolesInput').value = ""

}
staffRoles
async function removeStaffRoles() {
    document.getElementById("info").innerHTML = ''
    var newWord = document.getElementById('staffRolesInput').value
    const index = staffRoles.indexOf(newWord);
    if (index > -1) {
        staffRoles.splice(index, 1);
        var str = '<ul class="filterul">'

        staffRoles.forEach(function(word) {
            str += '<li>' + word + '</li>';
        });

        str += '</ul>';
        document.getElementById("staffRoles").innerHTML = str;
        document.getElementById('staffRolesInput').value = ""
    } else {
        document.getElementById('staffRolesInput').value = ""
    }
}




async function sendupdate() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", domain + '/api/updateoverview', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader("access-control-allow-origin", "*");
    await xhr.send(JSON.stringify({
        user: user,
        server: currentServer,
        prefix: document.getElementById('prefix').value.replace(' ', ''),
        staffids: staffids,
        staffRoles: staffRoles,
        channels: {
            modlogs: document.getElementById('modlogs').value.replace(' ', ''),
            announcments: document.getElementById('announcments').value.replace(' ', ''),
            townhall: document.getElementById('townhall').value.replace(' ', ''),
            townhallLogs: document.getElementById('townhallLogs').value.replace(' ', ''),
        }
    }));
    document.getElementById("info").innerHTML = "staff has been updated"
}