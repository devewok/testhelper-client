import {useState} from "react";

const Admin = ({socket}) => {
  const [count, setCount] = useState(0)

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = document.getElementById("question").value
    const question = {"id": count}
    if (text) {
      const data = text.split("\n")
      question[count] = {"question": data.shift(), "options": {}}
      data.map((option, i) => {
        if (option) {
          question[count]["options"][i] = {"text": option, "votes": 0}
        }
      })
      setCount(prev => prev + 1)
      socket.emit("newquestion", question)
    }
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <form>
        <textarea cols="100" rows="20" id="question">
        </textarea>
        <br />
        <input type="button" value="Guardar" onClick={handleSubmit} />
      </form>
    </div>
  )
}

export default Admin;
