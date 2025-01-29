import { useState } from "react";
import './index.css';
import Card from './components/Card';

function App() {

  const [count, setCount] = useState(0);

  const user = {
    username: 'amit',
    fullName: 'amit mahto',
    email: 'amitextinct@gmail.com',
  }

  const increseCount =  () => {
    // count++;
    // console.log(`count increased to ${count}`);
    setCount(count + 1);
    
    
  }

  // let count = 0;
  return (
    <>
      <h1 className="text-3xl bg-green-900 p-3">amit mahto</h1>
      <p>count : {count} </p>
      <button onClick={increseCount}>increseCount</button>
      <Card user={user} />
    </>
  )
}

export default App
