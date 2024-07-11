import { FaTrash} from 'react-icons/fa'

const Todo = ({text, index=0, datakey='test', deleteTodo=(val)=>{}}) => {
    const handleTodoAction = (e)=>{
        let targetEle = e.target.closest('.mybtn')?.dataset?.btn;
        if(targetEle=='delete'){
            //delete mode
            deleteTodo(text, index);
        }
    }
  return (
    <div className='todo' onClick={handleTodoAction}>
      <span>{text}</span>
      <div>
      <button className='mybtn' data-btn='delete' data-key={datakey}><FaTrash /></button>
      </div>
    </div>
  )
}

export default Todo
