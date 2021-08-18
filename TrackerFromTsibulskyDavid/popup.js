const google = 'google';
const facebook = 'facebook';
const twitter = 'twitter';
const linkedin = 'linkedin';
const tiktok = 'tiktok';


function markTracker(tracker) {
    document.getElementById(tracker).style.color = "maroon";
    document.getElementById(tracker).style.fontWeight = "bold";
    let icon_path = "url(/icons/" + tracker + "-red.png) no-repeat"
    document.getElementById(tracker + "-icon").style.background = icon_path;
}

function unmarkTracker(tracker) {
    document.getElementById(tracker).style.color = "lightgrey";
    document.getElementById(tracker).style.fontWeight = "light";
}

function getOrigin(url) {
    let pathArray = url.split('/');
    let protocol = pathArray[0];
    let host = pathArray[2];
    let origin = protocol + '//' + host;

    return origin;
}

function makeHeader(tracker_name, n_pages) {
    let header;
    tracker_name = tracker_name.toUpperCase();

    if (n_pages) {
        header = n_pages + " Websites Tracked You Using " + tracker_name.toUpperCase()
        document.getElementById("trackers-header").innerHTML = header;
        document.getElementById("trackers-header").style.color = "maroon";
    }
    else {
        document.getElementById("trackers-header").innerHTML =
            "No one tracked you using " + tracker_name + "...";

        document.getElementById("trackers-header").style.color = "blue";
    }
}

async function revealSites(tracker) {
    let list = "";
    const pages = await PageService.getPages(tracker);

    if (pages.length !== 0) {
        makeHeader(tracker, pages.length);
        for (page in pages) {
            list += "<li>" + pages[page] + "</li>"
        }
        document.getElementById("trackers-list").innerHTML = list;
    }
    else {
        makeHeader(tracker, 0)
        document.getElementById("trackers-list").innerHTML = "<pre>yet ...</pre>"
    }

    document.getElementById('clear').style.display = "block"
}


// WAITING FOR MESSAGE FROM CONTENT.JS
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        sendResponse("Trackers successfully passed to tracker extension");
        chrome.storage.local.set(
            {
                "url": sender.origin,
                "trackers": {
                    "facebook": request.facebook,
                    "google": request.google,
                    "tiktok": request.tiktok,
                    "twitter": request.twitter,
                    "linkedin": request.linkedin
                }
            })

        // Facebook
        if (request.facebook) {
            markTracker("facebook");
            PageService.savePage(facebook, sender.origin);
        }
        else {
            unmarkTracker("facebook")
        }

        // Google
        if (request.google) {
            markTracker("google");
            PageService.savePage(google, sender.origin);
        }
        else {
            unmarkTracker("google")
        }

        // Linkedin
        if (request.linkedin) {
            markTracker("linkedin");
            PageService.savePage(linkedin, sender.origin);
        }
        else {
            unmarkTracker("linkedin")
        }

        // TikTok
        if (request.tiktok) {
            markTracker("tiktok")
            PageService.savePage(tiktok, sender.origin);
        }
        else {
            unmarkTracker("tiktok")
        }

        // Twitter
        if (request.twitter) {
            PageService.savePage(twitter, sender.origin);
            markTracker("twitter")
        }
        else {
            unmarkTracker("twitter")
        }
    }
);

// USING EXISTING DATA
window.onload = function () {
    chrome.storage.local.get(["url", "trackers"], (data) => {
        console.log("data:", data);
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            current_url = getOrigin(tabs[0].url);
            if (data.trackers.facebook && data.url == current_url) {
                markTracker("facebook")
            }
            if (data.trackers.google && data.url == current_url) {
                markTracker("google")
            }
            if (data.trackers.linkedin && data.url == current_url) {
                markTracker("linkedin")
            }
            if (data.trackers.twitter && data.url == current_url) {
                markTracker("twitter")
            }
            if (data.trackers.tiktok && data.url == current_url) {
                markTracker("tiktok")
            }
        });
    })
    let facebook_all = document.getElementById('facebook-all');
    let google_all = document.getElementById('google-all');
    let twitter_all = document.getElementById('twitter-all');
    let tiktok_all = document.getElementById('tiktok-all');
    let linkedin_all = document.getElementById('linkedin-all');

    facebook_all.addEventListener('click', function () {
        revealSites(facebook)
    });
    google_all.addEventListener('click', function () {
        revealSites(google)
    });
    twitter_all.addEventListener('click', function () {
        revealSites(twitter)
    });
    tiktok_all.addEventListener('click', function () {
        revealSites(tiktok)
    });
    linkedin_all.addEventListener('click', function () {
        revealSites(linkedin)
    });

    document.getElementById('clear')
        .addEventListener('click', function () {
            document.getElementById("trackers-list").innerHTML = ""
            document.getElementById("trackers-header").innerHTML = ""

            document.getElementById('clear').style.display = "none"
        });
}
