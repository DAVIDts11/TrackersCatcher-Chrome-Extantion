let scripts = null;

var trackers = {
    "facebook": false,
    "google": false,
    "tiktok": false,
    "twitter": false,
    "linkedin": false
}


async function getScripts() {
    return document.getElementsByTagName("script");
}

async function findTrackers(scripts) {
    for (ns of scripts) {
        if (ns.innerHTML.includes("google-analytics") ||
            ns.outerHTML.includes("google-analytics")) {
            trackers.google = true;
        }
        if (ns.innerHTML.includes("connect.facebook") ||
            ns.outerHTML.includes("connect.facebook")) {
            trackers.facebook = true;
        }
        if (ns.innerHTML.includes("analytics.tiktok") ||
            ns.outerHTML.includes("analytics.tiktok")) {
            trackers.tiktok = true;
        }
        if (ns.innerHTML.includes("analytics.twitter") ||
            ns.outerHTML.includes("analytics.twitter")) {
            trackers.twitter = true;
        }
        if (ns.innerHTML.includes("snap.licdn") ||
            ns.outerHTML.includes("snap.licdn")) {
            trackers.linkedin = true;
        }
    }
    
    try {
        chrome.runtime.sendMessage(trackers);
    } catch (error) {
        console.log(error);
    }

}

async function Start() {
    setInterval(async function () {
        scripts = await getScripts();
        await findTrackers(scripts);
    }, 1000)

}

document.addEventListener('DOMContentLoaded',
    Start());