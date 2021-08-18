const google = 'google';
const facebook = 'facebook';
const twitter = 'twitter';
const linkedin = 'linkedin';
const tiktok = 'tiktok';


function markTracker(tracker) {
    document.getElementById(tracker).style.color = "maroon";
    document.getElementById(tracker).style.fontWeight = "bold";

    let icon = "url(/icons/" + tracker + "-red.png) no-repeat center";
    document.getElementById(tracker + "-icon").style.background = icon;
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
            });
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            let current_url = getOrigin(tabs[0].url);
            if (sender.origin == current_url) {
                if (!(request.facebook || request.google || request.twitter
                    || request.tiktok || request.linkedin)) {
                    document.getElementById('no-tracker-found-message').style.display = "block";
                    document.getElementsByTagName('main')[0].style.opacity = "1";
                    document.getElementById('loading').style.display = "none";
                }
                else {
                    // Facebook
                    if (request.facebook) {
                        markTracker("facebook");
                        PageService.savePage(facebook, sender.origin);
                    }

                    // Google
                    if (request.google) {
                        markTracker("google");
                        PageService.savePage(google, sender.origin);
                    }

                    // Linkedin
                    if (request.linkedin) {
                        markTracker("linkedin");
                        PageService.savePage(linkedin, sender.origin);
                    }

                    // TikTok
                    if (request.tiktok) {
                        markTracker("tiktok");
                        PageService.savePage(tiktok, sender.origin);
                    }

                    // Twitter
                    if (request.twitter) {
                        markTracker("twitter");
                        console.log("TWITTER:", request.twitter);
                        PageService.savePage(twitter, sender.origin);
                    }

                    document.getElementsByTagName('main')[0].style.opacity = "1";
                    document.getElementById('loading').style.display = "none";
                }
            }
        })
    }
);

// USING EXISTING DATA
async function Run() {
    document.getElementById('loading').style.display = "block";
    document.getElementsByTagName('main')[0].style.opacity = "0.3";
    chrome.storage.local.get(["url", "trackers"], (data) => {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            let current_url = getOrigin(tabs[0].url);
            console.log(data);
            if (data.url == current_url) {
                if (data.trackers.facebook) {
                    markTracker("facebook")
                }
                if (data.trackers.google) {
                    markTracker("google")
                }
                if (data.trackers.linkedin) {
                    markTracker("linkedin")
                }
                if (data.trackers.twitter) {
                    markTracker("twitter")
                }
                if (data.trackers.tiktok) {
                    markTracker("tiktok")
                }
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


window.onload = function () {
    Run()
}