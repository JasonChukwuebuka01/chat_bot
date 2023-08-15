window.onload = () => {
  const sendButton = document.querySelector(`#send-button`);

  let apiKey = `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`;

  const userInput = document.querySelector(`#user-input`);

  const chatBox = document.querySelector(`.chat-box`);

  const chatbotToggler = document.querySelector(`.chatbot-toggler`);

  const body = document.body;

  const closeBtn = document.querySelector(`.closeButton`);

  let audioCorrect = new Audio();

  audioCorrect.src = `https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3?filename=correct-2-46134.mp3`;

  let userInputValue;

  let inputInitialHeight = userInput.scrollHeight;

  alert(`Click Last Bot Response To Toggle Bot's Voice`);

  chatbotToggler.addEventListener(`click`, () => {
    body.classList.toggle(`show-chatbot`);
  });

  closeBtn.addEventListener(`click`, () => {
    body.classList.remove(`show-chatbot`);
  });

  sendButton.addEventListener(`click`, () => {
    handleList();
  });

  userInput.addEventListener(`input`, () => {
    userInput.style.height = `${inputInitialHeight}px`;

    userInput.style.height = `${userInput.scrollHeight}px`;

    responsiveVoice.cancel();
  });

  userInput.addEventListener(`keyup`, (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
      e.preventDefault();

      handleList();
    }
  });

  function handleList() {
    userInputValue = userInput.value.trim();

    userInput.style.height = `${inputInitialHeight}px`;

    if (!userInputValue) return;

    chatBox.appendChild(createList(userInputValue, `outgoing`));

    chatBox.scrollTo(0, chatBox.scrollHeight);

    // Append Bot chat in 600 milliseconds

    setTimeout(() => {
      let incomingMessageList = createList(`Thinking`, `incoming`);

      chatBox.appendChild(incomingMessageList);

      generateResponse(incomingMessageList);

      chatBox.scrollTo(0, chatBox.scrollHeight);

      // loop all <ul> children

      let children = chatBox.querySelectorAll(`li`);

      children.forEach((list, index) => {
        if (index % 2 === 0) {
          list.addEventListener(`click`, function () {
            let p = list.querySelector(`p`).textContent;

            list.classList.toggle(`play`);

            if (list.classList.contains(`play`)) {
              responsiveVoice.speak(p, `UK English Male`);

              navigator.vibrate(1050);
            } else {
              responsiveVoice.cancel();
            } // End of inner if/else

            selectedListOption(index); // LOOPS AGAIN!
          }); // list event Listener;
        } // End of outer if;
      }); // End of forEach;

      // remove fa-fade class in a 1.5sec

      setTimeout(() => {
        incomingMessageList.querySelector(`i`).classList.remove(`fa-fade`);
      }, 1500); // 2nd setTimeout;
    }, 600); // 1st setTimeout;

    userInput.value = ``;
  }

  /* A () that loops <ul> children again



1) if index of clicked <li> matches the new loop <li>, add fa-bounce class it its <i> child element



ELSE



2) IF IT DOESNT match, remove the classList PLAY from unmatched <li>



*/

  function selectedListOption(index1) {
    let children = chatBox.querySelectorAll(`li`);

    children.forEach((card2, index2) => {
      if (index1 != index2) {
        card2.classList.remove(`play`);
      } else {
        card2.querySelector(`i`).classList.add(`fa-bounce`);

        setTimeout(() => {
          card2.querySelector(`i`).classList.remove(`fa-bounce`);
        }, 1000);
      } // End of if/else
    }); // End of forEach;
  }

  // End of selectedListOption();

  // A () that returns a <li></li> element to be appeneded in <ul></ul>

  function createList(message, className) {
    let chatList = document.createElement(`li`);

    chatList.classList.add(`chat`, className);

    let textContent =
      className === `outgoing`
        ? `<p></p>`
        : `<i class="fa-solid fa-robot fa-fade"></i><p></p>`;

    chatList.innerHTML = textContent;

    chatList.querySelector(`p`).textContent = message;

    return chatList;
  }

  // A () that fetches content from openAi

  function generateResponse(incomingMessageList) {
    let incomingMsgListPTag = incomingMessageList.querySelector(`p`);

    const apiUrl = "https://api.openai.com/v1/chat/completions";

    let requestOptions = {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${apiKey}`,
      },

      body: JSON.stringify({
        model: "gpt-3.5-turbo",

        messages: [
          {
            role: "user",

            content: userInputValue,
          },
        ],
      }),
    };

    fetch(apiUrl, requestOptions)
      .then((res) => res.json())

      .then((data) => {
        incomingMsgListPTag.textContent = data.choices[0].message.content;

        let val = data.choices[0].message.content;

        responsiveVoice.speak(val, `US English Female`);
      })

      .catch((e) => {
        incomingMsgListPTag.classList.add(`error`);

        incomingMsgListPTag.textContent = `Oops,something went wrong`;

        let err = `Oops,something went wrong`;

        responsiveVoice.speak(err, `UK English Male`);
      })
      .finally(() => chatBox.scrollTo(0, chatBox.scrollHeight));
  }
}; // End of Geneal ()✅
