async function generateQuote() {
    try {
        // Show Loading Spinner while we fetch a new quote and a new background
        const loadingSpinner = document.querySelector(".loading-spinner");
        loadingSpinner.style.display = "block";

        // Hide the Quote till we receive the fresh quote 
        const quoteContentElement = document.querySelector(".quote-content");
        const quoteAuthorElement = document.querySelector(".quote-author");
        quoteContentElement.style.display = "none";
        quoteAuthorElement.style.display = "none";

        // Fetch the quote from the API
        const options = { method: 'GET', headers: { accept: 'application/json' } };
        const response = await fetch("https://api.freeapi.app/api/v1/public/quotes/quote/random", options);
        const data = await response?.json();

        // Set the quote to DOM elements
        quoteContentElement.textContent = data?.data?.content;
        quoteAuthorElement.textContent = `- ${data?.data?.author}`;

        // Change background image
        await changeBackgroundImage();

        // Stop showing the loading spinner and show the quote
        loadingSpinner.style.display = "none";
        quoteContentElement.style.display = "block";
        quoteAuthorElement.style.display = "block";
    } catch (error) {
        console.error("Error while fetching random quote: ", error);
        document.querySelector(".loading-spinner").style.display = "none";
    }
}

function shareToTwitter() {
    // Fetch the quote from DOM
    const tweetContent = copyText();
    // Call twitter to create a new post with the quote
    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetContent}`;
    window.open(twitterUrl, '_blank');

}

function copyText() {
    // Fetch the quote from the DOM elements
    const quoteContentElement = document.querySelector(".quote-content");
    const quoteAuthorElement = document.querySelector(".quote-author");
    return `${quoteContentElement?.innerText} ${quoteAuthorElement?.innerText}`;
}

async function changeBackgroundImage() {
    try {
        // Take the viewport width and height: This takes care of most responsive needs
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;

        // Fetch image with the screen width and height size
        const response = await fetch(`https://picsum.photos/${screenWidth}/${screenHeight}?blur=4`);

        // Set the image as the background
        const container = document.querySelector(".container");
        container.style.backgroundImage = `url("${response.url}")`;
    } catch (error) {
        console.error("Error while fetching background image: ", error);
    }
}

function exportToDesktop() {
    // Just to add a loading state, show that we're in the process of exporting
    const exportBtn = document.querySelector(".export-btn");
    const originalText = exportBtn.textContent;
    exportBtn.textContent = "Exporting...";

    // Select the element to be screenshotted
    const container = document.querySelector(".container");

    // Using the html2canvas library to take screenshots
    html2canvas(container, {
        scale: 2,
        useCORS: true
    }).then(canvas => {
        // Create the URL for the image download
        const image = canvas.toDataURL("image/png");

        // Create a link to download the image
        const downloadLink = document.createElement("a");
        downloadLink.href = image;

        // Fetch the name of the author of quote to create the file name of the image to be downloaded
        const quoteAuthor = document.querySelector(".quote-author").textContent;
        // For the URL of the file to be downloaded
        downloadLink.download = `quote${quoteAuthor.trim().split(" ").join("")}.png`;

        // Add the download link to document
        document.body.appendChild(downloadLink);
        // Click on the download link to download
        downloadLink.click();
        // Remove the download link from the DOM
        document.body.removeChild(downloadLink);

        // Change the export button text to original
        exportBtn.textContent = originalText;
    }).catch(error => {
        console.error("Error exporting quote:", error);
        exportBtn.textContent = originalText;
    });
}

function copyToClipboad() {
    // Change the text of the copy to clipboard button to show a loading state
    const copyToClipboardBtn = document.querySelector(".copy-btn")
    copyToClipboardBtn.textContent = "Copied..."

    // Save to the clip board the copied text
    navigator.clipboard.writeText(copyText());

    // After some time, change the text of the button back to original
    setTimeout(() => {
        copyToClipboardBtn.textContent = "Copy To Clipboard"
    }, 5000)
}

window.addEventListener("load", () => {
    // On load of the webpage, we need to generate the quote
    generateQuote();
})
