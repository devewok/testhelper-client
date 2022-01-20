import {useState} from "react";

const Admin = ({socket}) => {
  const [count, setCount] = useState(0)
  const [code, setCode] = useState("demo")

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = document.getElementById("question").value
    const question = {"id": count}
    if (text) {
      const data = text.split("\n")
      question[count] = {"question": data.shift(), "options": {}}
      // eslint-disable-next-line array-callback-return
      data.map((option, i) => {
        if (option) {
          question[count]["options"][i] = {"text": option, "votes": 0}
        }
      })
      setCount(prev => prev + 1)
      socket.emit("newquestion", {question, code})
    }
  }

  const handleCode = (event) => {
    event.preventDefault()
    const value = document.getElementById("code").value
    setCode(value)
    socket.emit("newtest", value)

  }
  return (
    <div>
      <h1>Admin Panel</h1>
      <form>
        <label>Codigo</label>
        <input id="code" defaultValue={code} />
        <button onClick={handleCode}>Empezar</button>
      </form>
      <form>
        <textarea cols="100" rows="20" id="question">
        </textarea>
        <br />
        <button onClick={handleSubmit}>Enviar</button>
      </form>
    </div>
  )
}

export default Admin;
