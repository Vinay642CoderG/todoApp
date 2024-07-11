import React from 'react'
import {FaPlus} from 'react-icons/fa'

const TodoForm = ({addTodo=(todo)=>{}}) => {
    const handleAddTodo = (e)=>{
        e.preventDefault();
        const formdata = Object.fromEntries(new FormData(e.target));
        addTodo(formdata)
    }
  return (
    <form id='TodoForm' method='post' onSubmit={handleAddTodo}>
        <input type="text" name='task' maxLength={300} placeholder='Enter your task' required/>
        <button type='submit' className='mybtn' data-btn='add'><FaPlus/>Add</button>
    </form>
  )
}

export default TodoForm
