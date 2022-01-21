import {useEffect, useState} from "react";

const Option = ({handleToVote, quid, opid, data, isAnswered}) => {

  const [voted, setVoted] = useState(false)
  const onToVote = (event) => {
    event.preventDefault()
    setVoted(prev => !prev)
    handleToVote(quid, opid, voted ? -1 : +1)
  }
  return (
    <div id="option">
      <div id="text">
        {data.text}
      </div>
      <div id="votos">{}Votos: {data.votes}</div>
      <div id="accion">
        <input type="button" value={voted ? "Anular" : "Votar"} onClick={onToVote} disabled={isAnswered && !voted} />
      </div>
    </div>
  )
}
const Question = ({data, handleToVote}) => {
  const [isAnswered, setIsAnswered] = useState(false)
  const handleAnswer = (quid, opid, vote) => {
    handleToVote(quid, opid, vote)
    setIsAnswered(prev => !prev)
  }
  return (

    <div id="question">
      <h3>{data.id + 1 + ". "}{data[data.id]["question"]}</h3>
      {Object.entries(data[data.id]["options"]).map(([key, value]) =>
        <Option key={key} handleToVote={handleAnswer} isAnswered={isAnswered} quid={data.id} opid={key} data={value}></Option>
      )}
    </div>
  )
}
const Test = ({socket}) => {
  const [questions, setQuestions] = useState({})
  const [code, setCode] = useState("demo")

  useEffect(() => {
    const callbackNewQuestion = (test) => {
      setQuestions(test)
    }
    socket.on("newquestion", callbackNewQuestion)
    return () => {
      socket.off("newquestion", callbackNewQuestion)
    }
  })
  const handleCode = (event) => {
    event.preventDefault()
    event.target.disabled = true
    const value = document.getElementById("code").value
    setCode(value)
    socket.emit("loaddata", value)
  }

  const handleToVote = (quid, opid, vote) => {
    const id = questions[quid].id
    questions[quid][id]["options"][opid]["votes"] += vote
    socket.emit("ontovote", {quid, opid, vote, code})
  }

  return (
    <div>
      <h1>Test</h1>
      <form>
        <label>Codigo</label>
        <input id="code" defaultValue={code} />
        <button onClick={handleCode}>Empezar</button>
      </form>
      {code !== "demo" && Object.entries(questions).length === 0 ? <h2>Espere mientras el admin carga las preguntas</h2> : null}
      {
        Object.values(questions).map((data) => (
          <Question key={data.id} data={data} handleToVote={handleToVote} />
        ))
      }
    </div>
  )
}

export default Test;
