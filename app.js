 // dom selectors
 const timerDisplay = document.querySelector('.timer'),
 questionCard = document.querySelector('.question'),
 questionNumber = document.querySelector('.question-number'),
 options =Array.from(document.querySelectorAll('.option')),
 loader = document.querySelector('.quiz-loader'),
 score = document.querySelector('.user-score'),
 nextBtn = document.querySelector('.next-btn'),
 currentQuestion =  document.querySelector('.current-question'),
 totalQues =  document.querySelector('.total-questions')

 let questionCounter = 0
 let userScore = 0
 totalQuestions = 50
 let singleQuizData = {}
 let acceptUserInput = false
 let countdownTime = 300;


 const loadQuizData = async () => {    
      try {
        const response = await 
            fetch('https://opentdb.com/api.php?amount=50&category=18&type=multiple')
      const quizData = await response.json()
      return quizData
      }
      catch(err) {
        console.log(err)
      }
 }
 
 loadQuizData().then (quizData => {
  
    // console.log(quizData.results)
    quizArray  =  quizData.results.map(quizDatum => {
      const questionBank = {
         question: quizDatum.question
       }

       const allOptions = [...quizDatum.incorrect_answers ]
       questionBank.answer = Math.floor(Math.random() * 3) + 1;
       allOptions.splice(questionBank.answer -1, 0, quizDatum.correct_answer
         )

         allOptions.map((option, i) => {
            questionBank["option" + (i + 1)] = option
         })
         return questionBank
    })
    //console.log(quizArray)

    //START QUEEZ
    let quizCollection = []
   
 
    startQueez = () => {
      questionCounter = 0
      userScore = 0
     quizCollection = [...quizArray]
     getQuestion()
     }


     getQuestion = () => {
       const questionIndex =  Math.floor(Math.random() * quizCollection.length)
        singleQuizData = quizCollection[questionIndex]
        questionCard.innerText = singleQuizData.question

        // fill in the otions array with values
        options.map(option => {
          const number = option.dataset['number']
          option.innerText = singleQuizData['option' + number]
        })
        quizCollection.splice(questionIndex, 1)
        acceptUserInput = true            
        
           // track quiz progress
      counter = questionCounter++
      currentQuestion.innerText = counter + 1
      totalQues.innerText = ` of ${totalQuestions}`

        // SET COUNTDOWN TIMER
      let countdownSeconds = 60 * 5 ;
      setInterval(() => {
      const countdownTimer = () => {
        let countdownMinutes = Math.round((countdownSeconds -30) / 60),
            remTime = countdownSeconds % 60;
      
      const  timer = `${countdownMinutes}:${(remTime < 10 ? "0" : "")}${remTime}`;
      timerDisplay.innerText = timer
      console.log(timer)
      //console.log(remTime)

        if(countdownSeconds === 0) {
           //End of quiz, quiztime and grading of user performance
            if(userScore <= 39){
              loader.innerHTML = `
              <h3>Your Maester Journey Ends Here</h3>
              <h2>You scored ${userScore}</h2>
              <br>
              <h3>SORRY::!!!</h3>
              <br>
              <h2>YOU can do Better</h2>
              `
            }
            else {
              loader.innerHTML = `
              <h3>Your Maester Journey Ends Here</h3>
              <h2>You scored ${userScore}</h2>
              <br>
              <h3>Congratulations!!!!</h3>
              <br>
              <h2>You are a QUEEZ MAESTER</h2>
              `
            }
           setTimeout(() => {
            window.location = '/end.html'     
           }, 5000)
         
          console.log('done')
        }
        else {
          countdownSeconds--;
        console.log('pending');
        }
  };  
    countdownTimer();
  }, 1000);
  clearInterval();
        }

     // validate user choice of answer
     options.map(option => {
      option.addEventListener('click', e => {
       if(!acceptUserInput) return;

          acceptUserInput = false
          const selectedOption = parseInt(e.target.dataset['number'])
          if(selectedOption === singleQuizData.answer) {
            option.classList.add('success')

            userScore++;
            score.innerText = userScore
            console.log(userScore)                
            // delay the next question display
            setTimeout(()=> {
              option.classList.remove('success')
              getQuestion()
            }, 1000)

          } else {
            option.classList.add('error')
            setTimeout(()=> {
              option.classList.remove('error')
              getQuestion()
            }, 1000)
          }

      })
    })


     startQueez()
 })
 