// home page nav

const profile = document.querySelector(".profile");
const nav = document.querySelector(".nav");

// profile.addEventListener('click', () => {
//   if (nav.classList.contains("d-none")){
//     nav.classList.remove("d-none");
//   } else {
//     nav.classList.add("d-none");
//   }
// });

const leng_checkbox = document.getElementById('lang-checkbox');
const geo = document.getElementById('geo');
const eng = document.getElementById('eng')

leng_checkbox.addEventListener('change', () => {
  if (document.querySelector('#lang-checkbox:checked')) {
    eng.classList.remove("lang__action");
    geo.classList.add("lang__action");
  } else {
    geo.classList.remove("lang__action");
    eng.classList.add("lang__action");
  }
});


// Initialize the first sentence, create a function for displaying the next sentence

const targetCardText = document.getElementById('target-card-text');
const nextButton = document.getElementById('next-submit-ticket')

var fetchNextText = async function () {
    let response = await fetch('/api/ticketrequest');
    return await response.json();
};

async function displayNextText() {
    currentTextData = await fetchNextText();
    console.log('displayNextText running')
    console.log(currentTextData)
    if (currentTextData.text) {
        targetCardText.style.opacity = 1
        targetCardText.innerHTML = currentTextData.text

        targetCardText.animate([
          { transform: 'translate3D(-2000px, 0, 0)' },
          { transform: 'translate3D(0, 0, 0)' }
        ], {
          duration: 1500,
          iterations: 1
        })
        targetCardText.style.right = 0
        console.log(targetCardText.style.position)
        targetCardText.style.position = 'static'

        targetCardText.style.color = '#000000'
        nextButton.style.opacity = 1
    } else {
        targetCardText.innerHTML = 'თქვენ ამოწურეთ მარკირებისთვის განკუთვნილი წინადადებების საცავი. ახალი წინადადებები მოგვიანებით დაემატება. '
        targetCardText.style.color = '#320606'
        nextButton.style.opacity = 0.5
        nextButton.disabled = true
    }
}



displayNextText()


// Update Current Emotion Info by clicking on Selector Areas

const emotionSelectors = document.querySelectorAll('.emotions');
const title = document.getElementById('title');
const synonym = document.getElementById('synonym');
const about = document.getElementById('about');
const help = document.getElementById('help');
const aboutQuestion = document.getElementById('about-question');
const helpQuestion = document.getElementById('help-question');

const emotionAreaIdentifiers = ['38', '30', '29',
  '28', '31', 'Group_1540',
  '34', '17', '7',
  '35', '11', '8',
  '36', '12', '14',
  '25', '21', '13',
  '37', '15', '9',
  'Group_1525', '19', '10',
  '27', '26', '6', '5', '4', '3', '2', '1', '40']  // selectors for clickable areas corresponding to an emotion have these IDs
const emptyAreaIdentifiers = ['33', '32', '16', '24', '23', '22', '20', '18']  // selectors for empty areas, not corresponding to any emotion


fetch('/api/emotionlist')
  .then((response) => {
    if (!response.ok) {
      throw Error('ERROR');
    }
    return response.json();
  })
  .then((data) => {
    emotionNamesData = data
  })


for (let i = 0; i < emotionSelectors.length; i++) {
  emotionSelectors[i].addEventListener('click', () => {
    if (!emptyAreaIdentifiers.includes(emotionSelectors[i].id)) {
        let correctIndex = emotionAreaIdentifiers.indexOf(emotionSelectors[i].id)

        title.innerHTML = emotionNamesData[correctIndex].emotion;
        synonym.innerHTML = emotionNamesData[correctIndex].synonym;
        about.innerHTML = emotionNamesData[correctIndex].example;
        help.innerHTML = emotionNamesData[correctIndex].example;
        aboutQuestion.innerHTML = "რას გვეუბნება " + emotionNamesData[correctIndex].emotion + ":"
        helpQuestion.innerHTML = "როგორ დაგეხმარება " + emotionNamesData[correctIndex].emotion + ":"
        nextButton.disabled = false

        chosenEmotion = correctIndex
  }
  });
}


// Initialize function to reset the selected emotion after the emotion is submitted

function resetSelectedEmotion() {
    title.innerHTML = 'აირჩიეთ ემოცია'
    synonym.innerHTML = 'არჩეული ემოციის სინონიმი'
    about.innerHTML = 'არჩეული ემოციის განმარტება'
    help.innerHTML = 'არჩეული ემოციის მნიშვნელობის განმარტება'
    aboutQuestion.innerHTML = 'რას გვეუბნება ეს ემოცია:'
    helpQuestion.innerHTML = 'როგორ დაგეხმარება ეს ემოცია:'
    nextButton.disabled = true

    chosenEmotion = null
}

// Send a POST request by clicking on Next button, submit data, and move on to the next sentence

successField = document.getElementById('ticket-submit-success')

nextButton.addEventListener('click', function() {
        if (chosenEmotion != null) {
            let text = currentTextData.id
            let emotion = chosenEmotion
            let user = currentTextData.user
            let secret = currentTextData.secret

            fetch('/api/ticketrequest', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    emotion: emotion,
                    user: user,
                    secret: secret
                })
            }).then(response => response.json())
                .then(data => {
                    successField.style.color = '#054718'
                    successField.innerHTML = 'მონამეცები მიღებულია (ემოცია: ' + emotionNamesData[chosenEmotion].emotion + ')'
                    successField.style.display = 'block'

                    targetCardText.style.position = 'absolute'
                    targetCardText.animate([
                      { transform: 'translate3D(0, 0, 0)' },
                      { transform: 'translate3D(2000px, 0, 0)' }
                    ], {
                      duration: 1000,
                      iterations: 1
                    })
                    setTimeout(displayNextText(), 1000)
                    resetSelectedEmotion()
                })
                .catch((error) => {
                    console.log(error)
                    successField.style.color = '#47050b'
                    successField.innerHTML = 'დაფიქსირდა შეცდომა'
                    successField.style.display = 'block'
                });
        }
    }
)