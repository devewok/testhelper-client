import {useEffect, useState} from "react";

const Option = ({handleToVote, backup, quid, opid, data, isAnswered}) => {

  const [voted, setVoted] = useState(() => {

    if (backup.hasOwnProperty(quid))
      if (backup[quid].hasOwnProperty(opid))
        return true
    return false
  })
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
      <div id="votos">Votos: {data.votes}</div>
      <div id="accion">
        <input type="button" value={voted ? "Anular" : "Votar"} onClick={onToVote} disabled={isAnswered && !voted} />
      </div>
    </div>
  )
}
const Question = ({data, backup, handleToVote}) => {
  const [isAnswered, setIsAnswered] = useState(backup.hasOwnProperty(data.id))
  const handleAnswer = (quid, opid, vote) => {
    handleToVote(quid, opid, vote)
    setIsAnswered(prev => !prev)
  }
  return (

    <div id="question">
      <h3>{data.id + 1 + ". "}{data[data.id]["question"]}</h3>
      {Object.entries(data[data.id]["options"]).map(([key, value]) =>
        <Option key={key} handleToVote={handleAnswer} backup={backup} isAnswered={isAnswered} quid={data.id} opid={key} data={value}></Option>
      )}
    </div>
  )
}
const Test = ({socket, uid}) => {
  const [questions, setQuestions] = useState({})
  const [code, setCode] = useState("demo")
  const [backup, setBackup] = useState({})

  useEffect(() => {
    const callbackNewQuestion = (test) => {
      setQuestions(test)
    }
    socket.on("newquestion", callbackNewQuestion)
    return () => {
      socket.off("newquestion", callbackNewQuestion)
    }
  })
  useEffect(() => {
    const data = localStorage.getItem("backup")
    if (data) {
      setBackup(JSON.parse(data))
    }
  }, [setBackup])
  useEffect(() => {
    if (Object.values(backup).length > 0)
      localStorage.setItem("backup", JSON.stringify(backup))
  }, [backup])
  const handleCode = (event) => {
    event.preventDefault()
    event.target.disabled = true
    const value = document.getElementById("code").value
    setCode(value)
    socket.emit("loaddata", value)
    sessionStorage.setItem("uid", uid)
  }

  const handleToVote = (quid, opid, vote) => {
    const id = questions[quid].id
    questions[quid][id]["options"][opid]["votes"] += vote
    socket.emit("ontovote", {quid, opid, vote, code})
    const ans = {[opid]: vote === 1 ? true : false}
    setBackup({...backup, [quid]: ans})
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
          <Question key={data.id} data={data} backup={backup} handleToVote={handleToVote} />
        ))
      }
    </div>
  )
}

export default Test;
