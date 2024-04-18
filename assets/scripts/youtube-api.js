// *API KEY Entry and fetch URL.
const youTubeApiKey = "AIzaSyBVd9Fn_22Glar1jMSqBFTOv18yGy1ICkk";

// Array of investing channels
const investingChannels = [
  {
    channelName: "GrahamStephan",
    id: "UCV6KDgJskWaEckne5aPA0aQ",
  },
  {
    channelName: "MeetKevin",
    id: "UCUvvj5lwue7PspotMDjk5UA",
  },
  {
    channelName: "BiggerPockets",
    id: "UCVWDbXqQ8cupuVpotWNt2eg",
  },
  {
    channelName: "investor_weekly",
    id: "UCo_E54zSKyuQpG2PNUMbQng",
  },
  {
    channelName: "DougPolkCrypto",
    id: "UC4sS8q8E5ayyghbhiPon4uw",
  },
  {
    channelName: "CNBCMakeIt",
    id: "UCH5_L3ytGbBziX0CLuYdQ1Q",
  },
];

//Array of savings channels
const savingsChannels = [
  {
    channelName: "thefinancialdiet",
    id: "UCSPYNpQ2fHv9HJ-q6MIMaPw",
  },
  {
    channelName: "FrugalFitMom",
    id: "UCdzq21gdrw1k5jw6xzaCADg",
  },
  {
    channelName: "jordanpagecompany",
    id: "UCIBM8DAHoehmJ7_LSLDkB3A",
  },
  {
    channelName: "eWasteBen",
    id: "UCMNtGapF13fwDLMR_sHmi6g",
  },
  {
    channelName: "freakinfrugal5268",
    id: "UCR4u4zBm37-uODgDlvsu7Bg",
  },
  {
    channelName: "MomTheEbayer101",
    id: "UCez9rG7-mnFtq4wpqA9zfXQ",
  },
  {
    channelName: "ExploringAlternatives",
    id: "UC8EQAfueDGNeqb1ALm0LjHA",
  },
  {
    channelName: "TinyHouseExpedition",
    id: "CmpHOZ6GqCvcWyPX3svgz-g",
  },
];

//Array of spending channels
const spendingChannels = [
  {
    channelName: "luxurytravelexpert",
    id: "UCYxsXxbjJO1YYa9yQ3lKC8w",
  },
  {
    channelName: "Archdigest",
    id: "UC0k238zFx-Z8xFH0sxCrPJg",
  },
  {
    channelName: "EnesYilmazer",
    id: "UCHWbZM3BIGgZksvXegx_h3w",
  },
  {
    channelName: "erikvanconover",
    id: "UCu8ucb1LRJd1gwwXutYDgTg",
  },
  {
    channelName: "sothebysrealty",
    id: "UCNZ3t1dMKJGl6-kV9BD5Lqg",
  },
  {
    channelName: "SupercarBlondie",
    id: "UCKSVUHI9rbbkXhvAXK-2uxA",
  },
  {
    channelName: "DenisonYachting",
    id: "UCrS7LVKWs4YIJNWgW3cM6sw",
  },
  {
    channelName: "SamChui",
    id: "UCfYCRj25JJQ41JGPqiqXmJw",
  },
];

// Fetch channel ID from YouTube API
async function fetchChannelId(apiKey, channelName) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    channelName
  )}&type=channel&key=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.items.length > 0) {

      return data.items[0].id.channelId;
    } else {
      console.error("No channel found with that name.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching channel ID:", error);
    return null;
  }
}

// Fetch a random video from a channel
async function fetchRandomVideoFromChannel(youTubeApiKey, randomChannelId) {
  const uploadsPlaylistId = `UU${randomChannelId.substring(2)}`;
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=25&key=${youTubeApiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!data.items || data.items.length === 0) {

      return null; // No videos to return
    }

    // Selecting a random video from the fetched items
    const randomIndex = Math.floor(Math.random() * data.items.length);
    const randomVideo = data.items[randomIndex];
    const videoDetails = {
      title: randomVideo.snippet.title,
      videoId: randomVideo.snippet.resourceId.videoId,
      description: randomVideo.snippet.description,
      publishedAt: randomVideo.snippet.publishedAt,
      videoUrl: `https://www.youtube.com/watch?v=${randomVideo.snippet.resourceId.videoId}`,
    };
    return videoDetails;
  } catch (error) {
    console.error(`Error fetching videos: ${error}`);
    return null; // Return null or handle error as appropriate
  }
}

// this function builds the YouTube modal.
function createVideoModal() {
  // Modal overlay
  const modalOverlay = document.createElement("div");
  modalOverlay.id = "videoModal";
  modalOverlay.className =
    "fixed z-50 inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden";

  // Modal content box
  const modalContent = document.createElement("div");
  modalContent.id = "modalContent";
  modalContent.className =
    "fixed  left-1/2 top-10 p-5 border-10 border-black rounded-xl w-1/3 transform -translate-x-1/2 shadow-xl rounded-md bg-white hidden sm:w-1/3 md:w-1/4 lg:w-1/5";

  // Close button
  const closeButton = document.createElement("button");
  closeButton.textContent = "×";
  closeButton.className =
    "absolute top-2 right-2 text-2xl text-gray-600 hover:text-gray-900";
  closeButton.onclick = closeModal;

  // Title
  const videoTitle = document.createElement("h3");
  videoTitle.id = "videoTitle";
  videoTitle.className = "text-lg leading-6 font-medium text-gray-900";

  // Video frame
  const videoFrame = document.createElement("iframe");
  videoFrame.id = "videoFrame";
  videoFrame.style.width = "100%";
  videoFrame.style.height = "315px";
  videoFrame.setAttribute("frameBorder", "0");
  videoFrame.allowFullscreen = true;
  videoFrame.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";

  // Dropdown button for video description
  const descriptionToggle = document.createElement("button");
  descriptionToggle.textContent = "Show Description";
  descriptionToggle.className =
    "mt-3 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 cursor-pointer";

  // Description
  const videoDescription = document.createElement("p");
  videoDescription.id = "videoDescription";
  videoDescription.className = "mt-2 text-gray-700 hidden"; // Initially hidden

  // Notes textarea
  const notesTextarea = document.createElement("textarea");
  notesTextarea.id = "videoNotes";
  notesTextarea.className =
    "mt-4 p-2 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm w-full";
  notesTextarea.placeholder = "Take your notes here and copy them for future use... ";
  notesTextarea.rows = "4";

  // Save notes to clipboard button
  const saveNotesToClipboard = document.createElement("button");
  saveNotesToClipboard.textContent = "Save Notes to Clipboard";
  saveNotesToClipboard.className =
    "mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer";
  saveNotesToClipboard.onclick = () => {
    const notes = document.getElementById("videoNotes").value;
    navigator.clipboard.writeText(notes)
    .then(() => {
        alert('Notes copied to clipboard');
    })
    .catch(err => {
        console.error('Failed to copy notes: ', err);
        alert('Failed to copy notes');
    });
};

  const resizeHandle = document.createElement("div");
  resizeHandle.className = "absolute bottom-0 right-0 cursor-se-resize p-2";
  resizeHandle.style.background = "rgba(0, 0, 0, 0.2)";

  // Appending all elements
  modalContent.appendChild(closeButton);
  modalContent.appendChild(videoTitle);
  modalContent.appendChild(videoFrame);
  modalContent.appendChild(descriptionToggle);
  modalContent.appendChild(videoDescription);
  modalContent.appendChild(notesTextarea);
  modalContent.appendChild(saveNotesToClipboard);
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);
  modalContent.appendChild(resizeHandle);

  descriptionToggle.addEventListener("click", function () {
    if (videoDescription.classList.contains("hidden")) {
      videoDescription.classList.remove("hidden");
      descriptionToggle.textContent = "Hide Description";
    } else {
      videoDescription.classList.add("hidden");
      descriptionToggle.textContent = "Show Description";
    }
  });
// this is the event lisnter to the rezise button
  resizeHandle.addEventListener("mousedown", function (e) {
    e.preventDefault();
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResize);
  });
}

function resize(e) {
  const modalContent = document.getElementById("modalContent");
  modalContent.style.width =
    e.clientX - modalContent.getBoundingClientRect().left + "px";
  modalContent.style.height =
    e.clientY - modalContent.getBoundingClientRect().top + "px";
}

// Define stopResize function
function stopResize() {
  window.removeEventListener("mousemove", resize);
  window.removeEventListener("mouseup", stopResize);
}

function closeModal() {
  document.getElementById("videoModal").classList.add("hidden");
  document.getElementById("modalContent").classList.add("hidden");
  document.getElementById("videoFrame").src = "";
  document.getElementById("videoNotes").value = "";
}

// Display video modal
function displayVideoModal(video) {
  document.getElementById("videoTitle").textContent = video.title;
  document.getElementById("videoDescription").textContent = video.description;
  document.getElementById(
    "videoFrame"
  ).src = `https://www.youtube.com/embed/${video.videoId}?autoplay=1`;
  document.getElementById("videoModal").classList.remove("hidden");
  document.getElementById("modalContent").classList.remove("hidden");
}

// Implement the logic for high income
async function getRandomspendingChannel() {
  // Implement the logic for high income
  const randomIndex = Math.floor(Math.random() * spendingChannels.length);
  const randomChannelId = spendingChannels[randomIndex].id;
  const videoData = await fetchRandomVideoFromChannel(
    youTubeApiKey,
    randomChannelId
  );
  displayVideoModal(videoData);
}

// Implement the logic for happy money
async function getInvestingChannel() {
  // Implement the logic for happy money
  const randomIndex = Math.floor(Math.random() * investingChannels.length);
  const randomChannelId = investingChannels[randomIndex].id;
  fetchRandomVideoFromChannel(youTubeApiKey, randomChannelId);
  const videoData = await fetchRandomVideoFromChannel(
    youTubeApiKey,
    randomChannelId
  );
  displayVideoModal(videoData);
}

// Implement the logic for sad money
async function getSavingsChannel() {
  // Implement the logic for sad money
  const randomIndex = Math.floor(Math.random() * savingsChannels.length);
  const randomChannelId = savingsChannels[randomIndex].id;
  fetchRandomVideoFromChannel(youTubeApiKey, randomChannelId);
  const videoData = await fetchRandomVideoFromChannel(
    youTubeApiKey,
    randomChannelId
  );
  displayVideoModal(videoData);
}

// Event listeners
document.getElementById("incomeSubmit").addEventListener("click", function () {
  const income = parseInt(document.getElementById("incomeInput").value, 10);
  if (income > 10000) {
    getRandomspendingChannel();
  }
});

// Event listener for the "Calculate" button
document
  .getElementById("calculateSadHappyMoney")
  .addEventListener("click", function () {
    const storedFinancialStatus = parseInt(
      localStorage.getItem("financialStatus"),
      10
    );
     // Retrieve the stored financial status
    if (storedFinancialStatus > 0) {
      getInvestingChannel();
    } else if (storedFinancialStatus <= 0) {
      getSavingsChannel();
    }
  });

document.addEventListener("DOMContentLoaded", () => {
  createVideoModal();
});
