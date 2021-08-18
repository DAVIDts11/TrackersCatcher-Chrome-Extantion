// THE SECONDS TASK -> MANAGING EACH LIST FOR OUR 5 SELECTED TRACKERS

class PageService {
    static getPages = (key) => {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get([key], (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                    console.log("REJECTED", key)
                }

                const researches = result[key] ? result[key] : [];
                resolve(researches);
            });
        });
    }

    static savePage = async (key, url) => {
        const pages = await this.getPages(key);
        if (pages.includes(url))
            return;

        console.log("pages:", pages);
        const updatedPages = [...pages, url];
        console.log(updatedPages);

        return new Promise((resolve, reject) => {
            chrome.storage.local.set({ [key]: updatedPages }, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                    console.log("REJECTED", key)
                }
                resolve(updatedPages);
            });
        });
    }

    static clearPages = () => {
        return new Promise((resolve, reject) => {
            chrome.storage.local.remove(
                ['google', 'facebook', 'twiiter', 'linkedin', 'tiktok'],
                () => {
                    if (chrome.runtime.lastError)
                        reject(chrome.runtime.lastError);
                    resolve();
                });
        });
    }
}
