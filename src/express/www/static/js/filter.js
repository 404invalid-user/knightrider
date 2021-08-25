    var normalstr = '<ul class="filterul">';
    filterNormal.forEach(function(word) {
        normalstr += '<li>' + word + '</li>';
    });
    normalstr += '</ul>';
    document.getElementById("filterNormal").innerHTML = normalstr;


    async function addTofilterNormal() {
        document.getElementById("info").innerHTML = ''
        var newWord = document.getElementById('filterNormalInput').value.toLowerCase()

        await filterNormal.push(newWord)

        var str = '<ul class="filterul">'

        filterNormal.forEach(function(word) {
            str += '<li>' + word + '</li>';
        });

        str += '</ul>';
        document.getElementById("filterNormal").innerHTML = str;
        document.getElementById('filterNormalInput').value = ""

    }

    async function removeFilterNormal() {
        document.getElementById("info").innerHTML = ''
        var newWord = document.getElementById('filterNormalInput').value.toLowerCase()
        const index = filterNormal.indexOf(newWord);
        if (index > -1) {
            filterNormal.splice(index, 1);
            var str = '<ul class="filterul">'

            filterNormal.forEach(function(word) {
                str += '<li>' + word + '</li>';
            });

            str += '</ul>';
            document.getElementById("filterNormal").innerHTML = str;
            document.getElementById('filterNormalInput').value = ""
        } else {
            document.getElementById('filterNormalInput').value = ""
        }
    }

    var safestr = '<ul class="filterul">'

    filterSafe.forEach(function(word) {
        safestr += '<li>' + word + '</li>';
    });

    safestr += '</ul>';
    document.getElementById("filterSafe").innerHTML = safestr;

    async function addTofilterSafe() {
        document.getElementById("info").innerHTML = ''
        var newWord = document.getElementById('filterSafeInput').value.toLowerCase()

        await filterSafe.push(newWord)

        var str = '<ul class="filterul">'

        filterSafe.forEach(function(word) {
            str += '<li>' + word + '</li>';
        });

        str += '</ul>';
        document.getElementById("filterSafe").innerHTML = str;
        document.getElementById('filterSafeInput').value = ""

    }

    async function removeFilterSafe() {
        document.getElementById("info").innerHTML = ''
        var newWord = document.getElementById('filterSafeInput').value.toLowerCase()
        const index = filterSafe.indexOf(newWord);
        if (index > -1) {
            filterSafe.splice(index, 1);
            var str = '<ul class="filterul">'

            filterSafe.forEach(function(word) {
                str += '<li>' + word + '</li>';
            });

            str += '</ul>';
            document.getElementById("filterSafe").innerHTML = str;
            document.getElementById('filterSafeInput').value = ""
        } else {
            document.getElementById('filterSafeInput').value = ""
        }
    }




    async function updateFilters() {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", domain + '/api/updatefilter', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader("access-control-allow-origin", "*");
        await xhr.send(JSON.stringify({
            user: user,
            server: currentServer,
            normalFilter: filterNormal,
            safeFilter: filterSafe
        }));
        document.getElementById("info").innerHTML = "Filter has been updated"
    }