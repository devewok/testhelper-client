import {useEffect, useState} from "react";

const Option = ({handleToVote, quid, opid, data}) => {

  const [voted, setVoted] = useState(false)
  const onToVote = (event) => {
    event.preventDefault()
    setVoted(prev => !prev)
    handleToVote(quid, opid, voted ? -1 : +1)
  }
  return (
    <li>
      <div>
        {data.text}
      </div>
      <span>{data.votes}</span>
      <input type="button" value={voted ? "Anular" : "Votar"} onClick={onToVote} />
    </li>
  )
}
const Test = ({socket}) => {
  const [questions, setQuestions] = useState({})

  useEffect(() => {
    const callbackNewQuestion = (test) => {
      setQuestions(test)
    }
    socket.on("newquestion", callbackNewQuestion)
    return () => {
      socket.off("newquestion", callbackNewQuestion)
    }
  })

  const handleToVote = (quid, opid, vote) => {
    const id = questions[quid].id
    questions[quid][id]["options"][opid]["votes"] += vote
    socket.emit("ontovote", {quid, opid, vote})
  }

  return (
    <div>
      <h1>Test</h1>
      {
        Object.values(questions).map((data) => (
          <ul key={data.id}>
            {data[data.id]["question"]}
            {Object.entries(data[data.id]["options"]).map(([key, value]) =>
              <Option key={key} handleToVote={handleToVote} quid={data.id} opid={key} data={value}></Option>
            )}
          </ul>
        ))
      }
    </div>
  )
}

export default Test;
